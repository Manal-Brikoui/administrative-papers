using CitizenServer.Application.DTO;
using CitizenServer.Application.Interfaces;
using CitizenServer.Domain.Entities;
using CitizenServer.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CitizenServer.Application.Services
{
    public class RendezvousService : IRendezvousService
    {
        private readonly CitizenServiceDbContext _context;

        public RendezvousService(CitizenServiceDbContext context)
        {
            _context = context;
        }

        // Récupérer tous les rendez-vous d'un utilisateur
        public async Task<IEnumerable<RendezvousDTO>> GetAllRendezvousAsync(Guid userId)
        {
            var rendezvousList = await _context.Rendezvous
                .Where(r => r.UserId == userId)
                .ToListAsync();

            return rendezvousList.Select(MapToDTO);
        }

        // Récupérer un rendez-vous par ID
        public async Task<RendezvousDTO> GetRendezvousByIdAsync(Guid id)
        {
            var rendezvous = await _context.Rendezvous.FindAsync(id);
            return rendezvous == null ? null : MapToDTO(rendezvous);
        }

        // Planifier un rendez-vous
        public async Task<RendezvousDTO> ScheduleRendezvousAsync(RendezvousDTO dto)
        {
            if (dto == null) return null;

            var entity = new Rendezvous
            {
                Id = dto.Id == Guid.Empty ? Guid.NewGuid() : dto.Id,
                UserId = dto.UserId,
                TypeDossierId = dto.TypeDossierId,
                AppointmentDate = dto.AppointmentDate,
                Status = dto.Status
            };

            _context.Rendezvous.Add(entity);
            await _context.SaveChangesAsync();

            return MapToDTO(entity);
        }

        // Mettre à jour un rendez-vous
        public async Task<RendezvousDTO> UpdateRendezvousAsync(RendezvousDTO dto)
        {
            var entity = await _context.Rendezvous.FindAsync(dto.Id);
            if (entity == null) return null;

            entity.TypeDossierId = dto.TypeDossierId;
            entity.AppointmentDate = dto.AppointmentDate;
            entity.Status = dto.Status;

            await _context.SaveChangesAsync();

            return MapToDTO(entity);
        }

        // Annuler un rendez-vous
        public async Task<bool> CancelRendezvousAsync(Guid id)
        {
            var entity = await _context.Rendezvous.FindAsync(id);
            if (entity == null) return false;

            _context.Rendezvous.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        // Mapping Entity -> DTO
        private static RendezvousDTO MapToDTO(Rendezvous entity)
        {
            return new RendezvousDTO
            {
                Id = entity.Id,
                UserId = entity.UserId,
                TypeDossierId = entity.TypeDossierId,
                AppointmentDate = entity.AppointmentDate,
                Status = entity.Status
            };
        }
    }
}
