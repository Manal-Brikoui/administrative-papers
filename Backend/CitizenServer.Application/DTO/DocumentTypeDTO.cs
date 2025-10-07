using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Application.DTO
{
    public class DocumentTypeDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsImportable { get; set; }
        public string Category { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        public Guid TypeDossierId { get; set; }

    }
}
