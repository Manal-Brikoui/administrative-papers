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
        public Guid DossierAdministratifId { get; set; }  // Clé étrangère vers DossierAdministratif
        public required string Type { get; set; }  // Type du document (par exemple : "Pièce d'identité", "Justificatif de domicile")
        public required string FilePath { get; set; }  // Chemin d'accès du fichier document
        public DateTime UploadDate { get; set; }  // Date de soumission du document
        public bool IsOnPlatform { get; set; }  // Indique si le document est présent sur la plateforme
        public string? ImportLocation { get; set; }  // L'emplacement d'importation du document

        // Référence vers DossierAdministratif
        public DossierAdministratif DossierAdministratif { get; set; }
    }
}
