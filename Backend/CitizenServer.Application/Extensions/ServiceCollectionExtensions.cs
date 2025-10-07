
using CitizenServer.Application.Interfaces;
using CitizenServer.Application.Services;
using CitizenServer.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CitizenServer.Application.Extensions
{
    /// <summary>
    /// Contient les extensions pour enregistrer les services de la couche Application
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Enregistre tous les services métiers et auxiliaires de l'application
        /// </summary>
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // ✅ Services métiers (logique applicative)
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IDocumentService, DocumentService>();
            services.AddScoped<IDocumentTypeService, DocumentTypeService>();
            services.AddScoped<IDossierAdministratifService, DossierAdministratifService>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IRendezvousService, RendezvousService>();
            services.AddScoped<ITypeDossierService, TypeDossierService>();

            // ✅ Current User (lié à l’authentification JWT/Keycloak)
            services.AddScoped<ICurrentUserService, CurrentUserService>();

          
            return services;
        }
    }
}
