using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Domain.Entities
{
    public class DossierAdministratif
    {
        [Key]
        public Guid Id { get; set; }  // Identifiant unique du dossier

        public Guid UserId { get; set; }  

        public Guid TypeDossierId { get; set; }  
        public required string Status { get; set; }  // Statut du dossier 
        
        public DateTime SubmissionDate { get; set; }  // Date de soumission du dossier
        public DateTime? ValidationDate { get; set; }  // Date de validation du dossier 
        public bool IsCompleted { get; set; }  // Indicateur si le dossier est complet

        // Référence vers TypeDossier
        public TypeDossier TypeDossier { get; set; }

        public ICollection<Document> Documents { get; set; }  // Liste des documents associés au dossier 

   
        public DossierAdministratif()
        {
            Documents = new List<Document>(); 
        }
    }
}
