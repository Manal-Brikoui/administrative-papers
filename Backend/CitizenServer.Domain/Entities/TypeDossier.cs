using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Domain.Entities
{
    public class TypeDossier
    {
        [Key]
        public Guid Id { get; set; }  // Identifiant unique du type de dossier

        [Required] 
        public string Name { get; set; }

        public string? Description { get; set; }  

        // Liste des dossiers associés à ce type de dossier
        public ICollection<DossierAdministratif> Dossiers { get; set; }

        // Liste des rendez-vous associés à ce type de dossier
        public ICollection<Rendezvous> Rendezvous { get; set; }

        // Liste des types de documents associés à ce type de dossier
        public ICollection<DocumentType> DocumentTypes { get; set; }  

  
        public TypeDossier()
        {
            Dossiers = new List<DossierAdministratif>();  // Initialiser la collection des dossiers
            Rendezvous = new List<Rendezvous>();  // Initialiser la collection des rendez-vous
            DocumentTypes = new List<DocumentType>();  // Initialiser la collection des types de documents
        }

        public TypeDossier(Guid id, string name, string? description)
        {
            Id = id;
            Name = name;
            Description = description;
            Dossiers = new List<DossierAdministratif>();  // Initialiser la collection des dossiers
            Rendezvous = new List<Rendezvous>();  // Initialiser la collection des rendez-vous
            DocumentTypes = new List<DocumentType>();  // Initialiser la collection des types de documents
        }
    }
}
