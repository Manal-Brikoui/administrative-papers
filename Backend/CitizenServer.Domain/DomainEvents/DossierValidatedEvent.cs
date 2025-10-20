using System;

namespace CitizenServer.Domain.DomainEvents
{
  
    public class DossierValidatedEvent
    {
        public Guid DossierId { get; }

        public Guid UserId { get; }

       
        public DateTime ValidationDate { get; }

        
        public DossierValidatedEvent(Guid dossierId, Guid userId, DateTime validationDate)
        {
            DossierId = dossierId;
            UserId = userId;
            ValidationDate = validationDate;
        }
    }
}
