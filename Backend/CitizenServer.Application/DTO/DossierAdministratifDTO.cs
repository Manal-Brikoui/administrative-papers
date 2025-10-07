using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Application.DTO
{
    public class DossierAdministratifDTO
    {
        public Guid UserId { get; set; }
        public Guid Id { get; set; }
        public Guid TypeDossierId { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime SubmissionDate { get; set; }
        public DateTime? ValidationDate { get; set; }
        public bool IsCompleted { get; set; }
    }
}
