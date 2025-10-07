using System;

namespace CitizenServer.Domain.DomainEvents
{
    /// <summary>
    /// Événement de domaine qui se déclenche lorsqu'un dossier administratif est validé.
    /// Utilisé pour notifier d'autres parties du système (logs, envoi d'email, etc.).
    /// </summary>
    public class DossierValidatedEvent
    {
        /// <summary>
        /// Identifiant du dossier validé.
        /// </summary>
        public Guid DossierId { get; }

        /// <summary>
        /// Identifiant de l'utilisateur qui possède ce dossier.
        /// </summary>
        public Guid UserId { get; }

        /// <summary>
        /// Date à laquelle le dossier a été validé.
        /// </summary>
        public DateTime ValidationDate { get; }

        /// <summary>
        /// Constructeur pour initialiser l'événement.
        /// </summary>
        /// <param name="dossierId">Id du dossier</param>
        /// <param name="userId">Id de l'utilisateur</param>
        /// <param name="validationDate">Date de validation</param>
        public DossierValidatedEvent(Guid dossierId, Guid userId, DateTime validationDate)
        {
            DossierId = dossierId;
            UserId = userId;
            ValidationDate = validationDate;
        }
    }
}
