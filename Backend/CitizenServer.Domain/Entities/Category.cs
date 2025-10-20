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

        // Nom de la catégorie 
        [Required]
        public string Name { get; set; }

       
        public string? Description { get; set; }

        //  Une catégorie peut contenir plusieurs types de documents
        public ICollection<DocumentType> DocumentTypes { get; set; }

  
        public Category()
        {
            Id = Guid.NewGuid();  
            DocumentTypes = new List<DocumentType>();  
        }

     
        public Category(Guid id, string name, string? description)
        {
            Id = id;
            Name = name;
            Description = description;
            DocumentTypes = new List<DocumentType>();  
        }
    }
}
