using System;
using CitizenServer.Domain.Aggregates;
using CitizenServer.Domain.DomainEvents;

namespace CitizenServer.Domain.DomainServices
{
    
    public class DossierService
    {
        public DossierValidatedEvent ValiderDossier(DossierAggregate dossier, Guid userId)
        {
            if (dossier == null)
                throw new ArgumentNullException(nameof(dossier), "Le dossier ne peut pas être null.");

            // Vérification de règles métiers minimales
            if (!dossier.IsComplete())
                throw new InvalidOperationException("Le dossier ne peut pas être validé car il est incomplet.");

            //  validation du dossier
            dossier.Validate();

            return new DossierValidatedEvent(dossier.Dossier.Id, userId, DateTime.UtcNow);
        }
    }
}
