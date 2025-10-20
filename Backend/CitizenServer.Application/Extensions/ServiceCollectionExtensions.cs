
using CitizenServer.Application.Interfaces;
using CitizenServer.Application.Services;
using CitizenServer.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CitizenServer.Application.Extensions
{
   
    public static class ServiceCollectionExtensions
    {
        
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
           
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IDocumentService, DocumentService>();
            services.AddScoped<IDocumentTypeService, DocumentTypeService>();
            services.AddScoped<IDossierAdministratifService, DossierAdministratifService>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IRendezvousService, RendezvousService>();
            services.AddScoped<ITypeDossierService, TypeDossierService>();

           
            services.AddScoped<ICurrentUserService, CurrentUserService>();

          
            return services;
        }
    }
}
