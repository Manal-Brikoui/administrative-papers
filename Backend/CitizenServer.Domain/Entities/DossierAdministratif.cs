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

        public Guid UserId { get; set; }  // Clé étrangère vers l'utilisateur (remplace CitizenId)

        public Guid TypeDossierId { get; set; }  // Clé étrangère vers TypeDossier (changement ici, utilisez Guid pour correspondre à la clé primaire de TypeDossier)
        public required string Status { get; set; }  // Statut du dossier (par exemple : "en cours", "validé", etc.)
        public DateTime SubmissionDate { get; set; }  // Date de soumission du dossier
        public DateTime? ValidationDate { get; set; }  // Date de validation du dossier (peut être nulle)
        public bool IsCompleted { get; set; }  // Indicateur si le dossier est complet

        // Référence vers TypeDossier
        public TypeDossier TypeDossier { get; set; }

        // Relation 1-N avec Document
        public ICollection<Document> Documents { get; set; }  // Liste des documents associés au dossier 

        // Constructeur par défaut
        public DossierAdministratif()
        {
            Documents = new List<Document>();  // Initialiser la collection des documents
        }
    }
}
