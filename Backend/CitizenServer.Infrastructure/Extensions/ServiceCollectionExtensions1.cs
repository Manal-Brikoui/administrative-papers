using CitizenServer.Domain.IRepositories;
using CitizenServer.Infrastructure.Data;
using CitizenServer.Infrastructure.Repositories;
using CitizenServer.Infrastructure.Services;
using CitizenService.Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
namespace CitizenServer.Infrastructure.Extensions
{
    /// <summary>
    /// Contient les extensions pour enregistrer les services et repositories de la couche Infrastructure
    /// </summary>
    public static class ServiceCollectionExtensions1
    {
        /// <summary>
        /// Enregistre tous les repositories et services externes de l'infrastructure
        /// </summary>
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddRepositories();
            services.AddServices(); // Ajout des services

            return services;
        }

        #region Repositories
        private static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            // ✅ Repositories
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IDocumentRepository, DocumentRepository>();
            services.AddScoped<IDocumentTypeRepository, DocumentTypeRepository>();
            services.AddScoped<IDossierAdministratifRepository, DossierAdministratifRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();
            services.AddScoped<IRendezvousRepository, RendezvousRepository>();
            services.AddScoped<ITypeDossierRepository, TypeDossierRepository>();

            return services;
        }
        #endregion

        #region Services
        private static IServiceCollection AddServices(this IServiceCollection services)
        {
            // Nécessaire pour CurrentUserService
            ;
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            return services;
        }
        #endregion
    }
}