using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CitizenServer.Domain.Entities;
namespace CitizenServer.Domain.Entities
{
    public class Rendezvous
    {
        public Guid UserId { get; set; }
        [Key]
        public Guid Id { get; set; }
        public Guid TypeDossierId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; }
        public TypeDossier TypeDossier { get; set; }  // Le type de dossier associé à ce rendez- vous 
    }
}
