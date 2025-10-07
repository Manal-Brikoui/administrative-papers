using CitizenServer.Domain.Entities;
using System;
using System.Collections.Generic;

namespace CitizenServer.Domain.Aggregates
{
    // Agrégat racine pour représenter un citoyen
    public class CitizenAggregate
    {
        public Guid UserId { get; private set; }   // Identifiant unique du citoyen (venant du header)

        // Collections d'entités liées
        public List<DossierAdministratif> Dossiers { get; private set; }
        public List<Rendezvous> RendezvousList { get; private set; }

        // Constructeur privé (DDD)
        private CitizenAggregate()
        {
            Dossiers = new List<DossierAdministratif>();
            RendezvousList = new List<Rendezvous>();
        }

        // Factory method pour créer un CitizenAggregate
        public static CitizenAggregate Create(Guid userId)
        {
            return new CitizenAggregate
            {
                UserId = userId
            };
        }

        // Méthode métier : ajouter un dossier
        public void AddDossier(DossierAdministratif dossier)
        {
            if (dossier == null) throw new ArgumentNullException(nameof(dossier));
            if (dossier.UserId != UserId)
                throw new InvalidOperationException("Le UserId du dossier ne correspond pas à celui du citoyen.");

            Dossiers.Add(dossier);
        }

        // Méthode métier : ajouter un rendez-vous
        public void AddRendezvous(Rendezvous rendezvous)
        {
            if (rendezvous == null) throw new ArgumentNullException(nameof(rendezvous));
            if (rendezvous.UserId != UserId)
                throw new InvalidOperationException("Le UserId du rendez-vous ne correspond pas à celui du citoyen.");

            RendezvousList.Add(rendezvous);
        }

        // Exemple : récupérer tous les dossiers validés
        public IEnumerable<DossierAdministratif> GetValidatedDossiers()
        {
            return Dossiers.FindAll(d => d.Status == "validé");
        }

        // Exemple : récupérer tous les rendez-vous à venir
        public IEnumerable<Rendezvous> GetUpcomingRendezvous()
        {
            return RendezvousList.FindAll(r => r.AppointmentDate >= DateTime.Now);
        }
    }
}
