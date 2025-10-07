using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Domain.Entities
{
    public class Category
    {


        // Identifiant unique pour la catégorie
        [Key]
        public Guid Id { get; set; }

        // Nom de la catégorie (obligatoire)
        [Required]
        public string Name { get; set; }

        // Description optionnelle de la catégorie
        public string? Description { get; set; }

        // Relation avec DocumentType : Une catégorie peut contenir plusieurs types de documents
        public ICollection<DocumentType> DocumentTypes { get; set; }

        // Constructeur par défaut
        public Category()
        {
            Id = Guid.NewGuid();  // Génération automatique d'un identifiant unique
            DocumentTypes = new List<DocumentType>();  // Initialisation de la collection des types de documents
        }

        // Constructeur avec paramètres
        public Category(Guid id, string name, string? description)
        {
            Id = id;
            Name = name;
            Description = description;
            DocumentTypes = new List<DocumentType>();  // Initialisation de la collection des types de documents
        }
    }
}
