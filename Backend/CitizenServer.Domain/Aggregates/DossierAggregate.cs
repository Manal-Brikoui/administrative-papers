using System;
using System.Collections.Generic;
using CitizenServer.Domain.Entities;

namespace CitizenServer.Domain.Aggregates
{
    /// <summary>
    /// Agrégat qui représente un Dossier Administratif et regroupe
    /// toutes les règles métier liées au dossier, ses documents et rendez-vous.
    /// </summary>
    public class DossierAggregate
    {
        // Propriété principale du dossier
        public DossierAdministratif Dossier { get; private set; }

        // Liste des documents liés au dossier
        public IReadOnlyCollection<Document> Documents => (IReadOnlyCollection<Document>)_documents;
        private readonly List<Document> _documents;

        // Liste des rendez-vous liés au dossier
        public IReadOnlyCollection<Rendezvous> Rendezvous => (IReadOnlyCollection<Rendezvous>)_rendezvous;
        private readonly List<Rendezvous> _rendezvous;

        // Constructeur
        public DossierAggregate(DossierAdministratif dossier)
        {
            Dossier = dossier ?? throw new ArgumentNullException(nameof(dossier));
            _documents = dossier.Documents != null ? new List<Document>(dossier.Documents) : new List<Document>();
            _rendezvous = new List<Rendezvous>();
        }

        /// <summary>
        /// Ajouter un document au dossier.
        /// </summary>
        public void AddDocument(Document document)
        {
            if (document == null)
                throw new ArgumentNullException(nameof(document));

            _documents.Add(document);
        }

        /// <summary>
        /// Associer un rendez-vous au dossier.
        /// </summary>
        public void AddRendezvous(Rendezvous rendezvous)
        {
            if (rendezvous == null)
                throw new ArgumentNullException(nameof(rendezvous));

            _rendezvous.Add(rendezvous);
        }

        /// <summary>
        /// Valider le dossier (par exemple après vérification des documents).
        /// </summary>
        public void Validate()
        {
            if (!_documents.Any())
                throw new InvalidOperationException("Impossible de valider un dossier sans documents.");

            Dossier.Status = "Validé";
            Dossier.ValidationDate = DateTime.UtcNow;
            Dossier.IsCompleted = true;

            // Ici on pourrait lever un DomainEvent : DossierValidatedEvent
        }

        /// <summary>
        /// Vérifier si le dossier est complet (tous les documents requis présents).
        /// </summary>
        public bool IsComplete()
        {
            return Dossier.IsCompleted && _documents.Any();
        }
    }
}
