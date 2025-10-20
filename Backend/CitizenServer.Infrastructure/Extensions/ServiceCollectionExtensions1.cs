using CitizenServer.Domain.IRepositories;
using CitizenServer.Infrastructure.Data;
using CitizenServer.Infrastructure.Repositories;
using CitizenServer.Infrastructure.Services;
using CitizenService.Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
namespace CitizenServer.Infrastructure.Extensions
{
   >
    public static class ServiceCollectionExtensions1
    {
       
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddRepositories();
            services.AddServices(); // Ajout des services

            return services;
        }

       
        private static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IDocumentRepository, DocumentRepository>();
            services.AddScoped<IDocumentTypeRepository, DocumentTypeRepository>();
            services.AddScoped<IDossierAdministratifRepository, DossierAdministratifRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();
            services.AddScoped<IRendezvousRepository, RendezvousRepository>();
            services.AddScoped<ITypeDossierRepository, TypeDossierRepository>();

            return services;
        }
     
        private static IServiceCollection AddServices(this IServiceCollection services)
        {
           
            ;
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            return services;
        }
       
    }
}
