using System;
using CitizenServer.Domain.Entities;

namespace CitizenServer.Domain.Aggregates
{
    
    public class RendezvousAggregate
    {
        public Rendezvous Rendezvous { get; private set; }

        // Constructeur principal
        public RendezvousAggregate(Guid userId, Guid typeDossierId, DateTime appointmentDate)
        {
            if (appointmentDate < DateTime.Now)
                throw new ArgumentException("La date du rendez-vous doit être dans le futur.");

            Rendezvous = new Rendezvous
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                TypeDossierId = typeDossierId,
                AppointmentDate = appointmentDate,
                Status = "En attente"
            };
        }

        //confirmation des rendez-vous 
        public void Confirmer()
        {
            if (Rendezvous.Status == "Annulé")
                throw new InvalidOperationException("Impossible de confirmer un rendez-vous annulé.");

            Rendezvous.Status = "Confirmé";
        }

       //annulation des rendez-vous 
        public void Annuler()
        {
            if (Rendezvous.Status == "Confirmé" && Rendezvous.AppointmentDate <= DateTime.Now)
                throw new InvalidOperationException("Impossible d'annuler un rendez-vous déjà passé.");

            Rendezvous.Status = "Annulé";
        }

  
        // Reprogrammer le rendez-vous à une nouvelle date.
       
        public void Reprogrammer(DateTime nouvelleDate)
        {
            if (nouvelleDate <= DateTime.Now)
                throw new ArgumentException("La nouvelle date doit être dans le futur.");

            Rendezvous.AppointmentDate = nouvelleDate;
            Rendezvous.Status = "Reprogrammé";
        }
    }
}
