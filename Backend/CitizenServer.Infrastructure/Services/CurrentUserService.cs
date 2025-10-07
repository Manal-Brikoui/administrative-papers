using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CitizenServer.Infrastructure.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<CurrentUserService> _logger;
        private bool _headersLogged;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor, ILogger<CurrentUserService> logger)
        {
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }
        // === Headers envoyés par l'API Gateway ===
        public string? UserId => GetHeader("X-User-Id");
        public string? Email => GetHeader("X-User-Email");
        public string? UserName => GetHeader("X-User-Name");
        public string? FirstName => GetHeader("X-User-First-Name");
        public string? LastName => GetHeader("X-User-Last-Name");

        public IEnumerable<string> Roles
        {
            get
            {
                var rolesHeader = GetHeader("X-User-Roles");
                if (string.IsNullOrWhiteSpace(rolesHeader))
                    return Enumerable.Empty<string>();

                try
                {
                    if (rolesHeader.StartsWith("["))
                        return JsonSerializer.Deserialize<string[]>(rolesHeader) ?? Enumerable.Empty<string>();

                    return rolesHeader.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                      .Select(r => r.Trim());
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Impossible de parser X-User-Roles: {HeaderValue}", rolesHeader);
                    return Enumerable.Empty<string>();
                }
            }
        }

        public bool IsAuthenticated => !string.IsNullOrWhiteSpace(UserId);

        public bool IsInRole(string role) => Roles.Contains(role, StringComparer.OrdinalIgnoreCase);

        public string GetClaim(string claimName) => GetHeader($"X-User-{claimName}") ?? string.Empty;

        // === Lecture et debug des headers ===
        private string? GetHeader(string headerName)
        {
            try
            {
                var context = _httpContextAccessor.HttpContext;
                if (context == null)
                {
                    _logger.LogDebug("Pas de HttpContext disponible pour le header {Header}", headerName);
                    return null;
                }

                if (!_headersLogged)
                {
                    LogAllHeaders(context);
                    _headersLogged = true;
                }

                if (context.Request.Headers.TryGetValue(headerName, out var values))
                {
                    var value = values.FirstOrDefault();
                    _logger.LogDebug("Lecture header {Header} = {Value}", headerName, value);
                    return value;
                }

                _logger.LogTrace("Header {Header} non trouvé", headerName);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la lecture du header {Header}", headerName);
                return null;
            }
        }

        // === Log complet de tous les headers pertinents ===
        private void LogAllHeaders(HttpContext context)
        {
            _logger.LogInformation("==== [DEBUG] Lecture des headers envoyés par l'API Gateway ====");

            foreach (var header in context.Request.Headers)
            {
                // On peut ignorer Authorization pour éviter de logguer le token
                if (!string.Equals(header.Key, "Authorization", StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogInformation("Header {Key}: {Value}", header.Key, header.Value.ToString());
                }
            }

            _logger.LogInformation("==== [DEBUG] Fin de lecture des headers ====");
        }

        // === Méthode pour debug complet de toutes les propriétés ===
        public void LogCurrentUser()
        {
            _logger.LogInformation("==== [DEBUG] CurrentUserService properties ====");
            _logger.LogInformation("IsAuthenticated: {Value}", IsAuthenticated);
            _logger.LogInformation("UserId: {Value}", UserId);
            _logger.LogInformation("Email: {Value}", Email);
            _logger.LogInformation("UserName: {Value}", UserName);
            _logger.LogInformation("FirstName: {Value}", FirstName);
            _logger.LogInformation("LastName: {Value}", LastName);
            _logger.LogInformation("Roles: {Value}", string.Join(", ", Roles));
            _logger.LogInformation("==== [DEBUG] Fin CurrentUserService properties ====");
        }
    }
    public interface ICurrentUserService
    {
        string? UserId { get; }
        string? Email { get; }
        string? UserName { get; }
        string? FirstName { get; }
        string? LastName { get; }
        IEnumerable<string> Roles { get; }
        bool IsAuthenticated { get; }
        bool IsInRole(string role);
        string GetClaim(string claimName);
        void LogCurrentUser();
    }
}
