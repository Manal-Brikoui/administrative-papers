using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text.Json;

namespace CitizenServer.API
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApi(this IServiceCollection services, IConfiguration configuration)
        {
            // ===== Controllers =====
            services.AddControllers()
                .ConfigureApiBehaviorOptions(options =>
                {
                    options.SuppressModelStateInvalidFilter = true;
                });

            services.AddHttpContextAccessor();

            // ===== Authentication basé sur headers de l'API Gateway =====
            services.AddAuthentication("Gateway")
                .AddScheme<AuthenticationSchemeOptions, HeaderAuthenticationHandler>("Gateway", options => { });

            // ===== Authorization =====
            services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireAuthenticatedUser", policy =>
                    policy.RequireAuthenticatedUser());

                options.AddPolicy("RequireAdminRole", policy =>
                    policy.RequireRole("admin"));

                options.AddPolicy("RequireCitizenRole", policy =>
                    policy.RequireRole("citizen", "admin"));
            });

            // ===== Swagger =====
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Citizen Service API",
                    Version = "v1",
                    Description = "API pour la gestion des services citoyens"
                });

                // Pas besoin de sécurité Bearer dans Swagger car l'auth se fait via headers
                // Le JWT est géré par l'API Gateway

                // Include XML comments if present
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                if (File.Exists(xmlPath))
                {
                    c.IncludeXmlComments(xmlPath);
                }
            });

            return services;
        }
    }

    public class HeaderAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public HeaderAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock) : base(options, logger, encoder, clock)
        {
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var httpContext = Context;

            // Si pas de X-User-Id, la requête est anonyme
            if (!httpContext.Request.Headers.TryGetValue("X-User-Id", out var userIdValues) ||
                string.IsNullOrWhiteSpace(userIdValues.FirstOrDefault()))
            {
                Logger.LogDebug("Aucun header X-User-Id trouvé - requête anonyme");
                return Task.FromResult(AuthenticateResult.NoResult());
            }

            try
            {
                var claims = BuildClaimsFromHeaders(httpContext);
                var identity = new ClaimsIdentity(claims, Scheme.Name);
                var principal = new ClaimsPrincipal(identity);
                var ticket = new AuthenticationTicket(principal, Scheme.Name);

                Logger.LogDebug("Authentification réussie pour l'utilisateur: {UserId}", userIdValues.First());
                return Task.FromResult(AuthenticateResult.Success(ticket));
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Erreur dans HeaderAuthenticationHandler");
                return Task.FromResult(AuthenticateResult.Fail("Échec de l'authentification par headers"));
            }
        }

        private List<Claim> BuildClaimsFromHeaders(HttpContext httpContext)
        {
            var claims = new List<Claim>();

            // User ID (obligatoire)
            var userId = httpContext.Request.Headers["X-User-Id"].First();
            claims.Add(new Claim(ClaimTypes.NameIdentifier, userId));

            // Claims optionnels
            AddClaimIfExists(httpContext, "X-User-Email", ClaimTypes.Email, claims);
            AddClaimIfExists(httpContext, "X-User-Name", ClaimTypes.Name, claims);
            AddClaimIfExists(httpContext, "X-User-First-Name", ClaimTypes.GivenName, claims);
            AddClaimIfExists(httpContext, "X-User-Last-Name", ClaimTypes.Surname, claims);

            // Rôles (parsing JSON ou CSV)
            AddRolesFromHeader(httpContext, claims);

            return claims;
        }

        private void AddClaimIfExists(HttpContext httpContext, string headerName, string claimType, List<Claim> claims)
        {
            if (httpContext.Request.Headers.TryGetValue(headerName, out var values))
            {
                var value = values.FirstOrDefault();
                if (!string.IsNullOrWhiteSpace(value))
                {
                    claims.Add(new Claim(claimType, value));
                }
            }
        }

        private void AddRolesFromHeader(HttpContext httpContext, List<Claim> claims)
        {
            if (!httpContext.Request.Headers.TryGetValue("X-User-Roles", out var rolesValues))
                return;

            var rolesRaw = rolesValues.FirstOrDefault();
            if (string.IsNullOrWhiteSpace(rolesRaw))
                return;

            try
            {
                IEnumerable<string> roles;
                rolesRaw = rolesRaw.Trim();

                if (rolesRaw.StartsWith("["))
                {
                    // Format JSON array: ["admin", "citizen"]
                    roles = JsonSerializer.Deserialize<string[]>(rolesRaw) ?? Array.Empty<string>();
                }
                else
                {
                    // Format CSV: "admin,citizen"
                    roles = rolesRaw.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                    .Select(r => r.Trim());
                }

                foreach (var role in roles.Where(r => !string.IsNullOrWhiteSpace(r)))
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                Logger.LogDebug("Rôles ajoutés: {Roles}", string.Join(", ", roles));
            }
            catch (Exception ex)
            {
                Logger.LogWarning(ex, "Impossible de parser le header X-User-Roles: {Value}", rolesRaw);
            }
        }
    }
}