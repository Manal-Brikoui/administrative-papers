using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CitizenServer.Domain.Entities
{
    public class DocumentType
    {
        [Key]
        public Guid Id { get; set; }  // Identifiant unique du document type

        public required string Name { get; set; }  // Nom du type de document 

        public bool IsImportable { get; set; }  // Indique si le document est importable

        public string Category { get; set; }  // Catégorie du document 

      
        public Guid CategoryId { get; set; }

        [JsonIgnore]  
        public Category CategoryEntity { get; set; }

       
        public Guid TypeDossierId { get; set; }

        [JsonIgnore]  
        public TypeDossier TypeDossierEntity { get; set; }

        public DocumentType() { }

        public DocumentType(Guid id, string name, bool isImportable, string category, Guid categoryId, Guid typeDossierId)
        {
            Id = id;
            Name = name;
            IsImportable = isImportable;
            Category = category;
            CategoryId = categoryId;
            TypeDossierId = typeDossierId;
        }
    }
}
