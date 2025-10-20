using System;
using System.Collections.Generic;
using CitizenServer.Domain.Entities;

namespace CitizenServer.Domain.Aggregates
{
   
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


        public DossierAggregate(DossierAdministratif dossier)
        {
            Dossier = dossier ?? throw new ArgumentNullException(nameof(dossier));
            _documents = dossier.Documents != null ? new List<Document>(dossier.Documents) : new List<Document>();
            _rendezvous = new List<Rendezvous>();
        }

        public void AddDocument(Document document)
        {
            if (document == null)
                throw new ArgumentNullException(nameof(document));

            _documents.Add(document);
        }

    
        public void AddRendezvous(Rendezvous rendezvous)
        {
            if (rendezvous == null)
                throw new ArgumentNullException(nameof(rendezvous));

            _rendezvous.Add(rendezvous);
        }

       
            if (!_documents.Any())
                throw new InvalidOperationException("Impossible de valider un dossier sans documents.");

            Dossier.Status = "Validé";
            Dossier.ValidationDate = DateTime.UtcNow;
            Dossier.IsCompleted = true;

           
        }

       
        public bool IsComplete()
        {
            return Dossier.IsCompleted && _documents.Any();
        }
    }
}
