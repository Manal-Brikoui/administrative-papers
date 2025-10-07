using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Application.DTO
{
    public class RendezvousDTO
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid TypeDossierId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
