using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Domain.Entities
{
    public class Document
    {
        [Key]
        public Guid Id { get; set; }  // Identifiant unique du document
        public Guid UserId { get; set; }
        public Guid DossierAdministratifId { get; set; }  
        public required string Type { get; set; }  // Type du document 
        public required string FilePath { get; set; }  // Chemin d'accès du fichier document
        public DateTime UploadDate { get; set; }  // Date de soumission du document
        public bool IsOnPlatform { get; set; }  // Indique si le document est présent sur la plateforme
        public string? ImportLocation { get; set; }  // L'emplacement d'importation du document

   
        public DossierAdministratif DossierAdministratif { get; set; }
    }
}
