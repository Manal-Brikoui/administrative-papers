using CitizenServer.API;
using CitizenServer.Domain.IRepositories;
using CitizenServer.Infrastructure.Data;
using CitizenServer.Infrastructure.Repositories;
using CitizenServer.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using CitizenServer.Application.Extensions;
using CitizenServer.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

// ===== Database =====
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<CitizenServiceDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// ===== CORS Configuration =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder.WithOrigins("http://localhost:5173") // URL de ton frontend React
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// ===== API Configuration (délégué à DependencyInjection) =====
builder.Services.AddApi(builder.Configuration);
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireCitizenRole", policy =>
        policy.RequireRole("Citizen"));

    options.AddPolicy("RequireAdminRole", policy =>
        policy.RequireRole("Admin"));
});

var app = builder.Build();

// ===== Middleware de debug (uniquement en développement) =====
if (app.Environment.IsDevelopment())
{
    app.Use(async (context, next) =>
    {
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("===== Headers reçus par le service Citizen =====");

        // Log uniquement les headers X-User-* pour éviter le spam
        foreach (var header in context.Request.Headers.Where(h => h.Key.StartsWith("X-User-")))
        {
            logger.LogInformation("{Key}: {Value}", header.Key, header.Value.ToString());
        }
        logger.LogInformation("===== Fin des headers =====");
        await next();
    });
}

// ===== Database Migration =====
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CitizenServiceDbContext>();
    db.Database.Migrate();
}

// ===== Pipeline HTTP =====
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Citizen Service API v1"));
}

app.UseHttpsRedirection();
app.UseAuthentication();    // Configuré dans AddApi()
app.UseAuthorization();     // Configuré dans AddApi()

// ===== CORS Middleware =====
app.UseCors("AllowReactApp"); // Ajout de la configuration CORS

app.MapControllers();

app.Run();
