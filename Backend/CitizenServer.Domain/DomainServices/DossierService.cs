using System;
using CitizenServer.Domain.Aggregates;
using CitizenServer.Domain.DomainEvents;

namespace CitizenServer.Domain.DomainServices
{
    /// <summary>
    /// Service de domaine pour gérer la logique métier des dossiers administratifs.
    /// </summary>
    public class DossierService
    {
        /// <summary>
        /// Valide un dossier et déclenche un événement de validation.
        /// </summary>
        /// <param name="dossier">Dossier à valider</param>
        /// <param name="userId">Identifiant de l'utilisateur (provenant du header HTTP)</param>
        /// <returns>L'événement de validation</returns>
        public DossierValidatedEvent ValiderDossier(DossierAggregate dossier, Guid userId)
        {
            if (dossier == null)
                throw new ArgumentNullException(nameof(dossier), "Le dossier ne peut pas être null.");

            // Vérification de règles métiers minimales
            if (!dossier.IsComplete())
                throw new InvalidOperationException("Le dossier ne peut pas être validé car il est incomplet.");

            // Action métier : validation du dossier
            dossier.Validate();

            // Retourne l’événement de validation qui sera ensuite publié
            return new DossierValidatedEvent(dossier.Dossier.Id, userId, DateTime.UtcNow);
        }
    }
}