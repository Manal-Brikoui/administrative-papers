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

        public required string Name { get; set; }  // Nom du type de document (ex: "Pièce d'identité")

        public bool IsImportable { get; set; }  // Indique si le document est importable

        public string Category { get; set; }  // Catégorie du document (ex: "Identité")

        // Clé étrangère vers Category
        public Guid CategoryId { get; set; }

        [JsonIgnore]  // Évite le cycle infini lors de la sérialisation
        public Category CategoryEntity { get; set; }

        // Clé étrangère vers TypeDossier
        public Guid TypeDossierId { get; set; }

        [JsonIgnore]  // Évite le cycle infini lors de la sérialisation
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
