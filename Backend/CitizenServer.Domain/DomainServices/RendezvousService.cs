using System;
using CitizenServer.Domain.Entities;

namespace CitizenServer.Domain.DomainServices
{
    public class RendezvousService
    {
        public Rendezvous CreerRendezvous(Guid userId, Guid typeDossierId, DateTime date)
        {
            if (date < DateTime.UtcNow)
                throw new InvalidOperationException("La date du rendez-vous doit être dans le futur.");

            return new Rendezvous
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                TypeDossierId = typeDossierId,
                AppointmentDate = date,
                Status = "Planifié"
            };
        }

        public void AnnulerRendezvous(Rendezvous rendezvous)
        {
            if (rendezvous == null)
                throw new ArgumentNullException(nameof(rendezvous));

            rendezvous.Status = "Annulé";
        }

        public void ConfirmerPresence(Rendezvous rendezvous)
        {
            if (rendezvous == null)
                throw new ArgumentNullException(nameof(rendezvous));

            rendezvous.Status = "Confirmé";
        }
    }
}