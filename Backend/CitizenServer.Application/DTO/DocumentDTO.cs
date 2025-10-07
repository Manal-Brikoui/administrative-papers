using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Application.DTO
{
    public class DocumentDTO
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string DossierAdministratifId { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public DateTime UploadDate { get; set; }
        public bool IsOnPlatform { get; set; }
        public string? ImportLocation { get; set; }
    }
}
