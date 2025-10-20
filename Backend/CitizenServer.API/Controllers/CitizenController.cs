using CitizenServer.Domain.Entities;
using CitizenServer.Infrastructure.Data;
using CitizenServer.Infrastructure.Services;
using CitizenServer.Application.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CitizenService.API.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class CitizenController : ControllerBase
    {
        private readonly CitizenServiceDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public CitizenController(CitizenServiceDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        // Informations du citoyen 
        [HttpGet("citizen-info")]
        [Authorize(Roles = "citizen")]
        public IActionResult GetCitizenInfo()
        {
            try
            {
                _currentUser.LogCurrentUser(); // Debug logs

                var userInfo = new
                {
                    IsAuthenticated = _currentUser.IsAuthenticated,
                    UserId = _currentUser.UserId,
                    Email = _currentUser.Email,
                    UserName = _currentUser.UserName,
                    FirstName = _currentUser.FirstName,
                    LastName = _currentUser.LastName,
                    Roles = _currentUser.Roles
                };

                return new JsonResult(userInfo)
                {
                    StatusCode = 200,
                    ContentType = "application/json"
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Erreur interne : {ex.Message}" });
            }
        }

        //  Dossiers du citoyen
        [HttpGet("dossiers")]
        [Authorize(Roles = "citizen")]
        public async Task<IActionResult> GetDossiers()
        {
            if (!Guid.TryParse(Request.Headers["X-User-Id"], out Guid userId))
                return BadRequest("UserId header is missing or invalid.");

            try
            {
                var dossiers = await _context.Dossiers
                    .Where(d => d.UserId == userId)
                    .Include(d => d.TypeDossier)
                    .Select(d => new DossierAdministratifDTO
                    {
                        UserId = d.UserId,
                        Id = d.Id,
                        TypeDossierId = d.TypeDossierId,
                        Status = d.Status,
                        SubmissionDate = d.SubmissionDate,
                        ValidationDate = d.ValidationDate,
                        IsCompleted = d.IsCompleted
                    })
                    .ToListAsync();

                return dossiers.Any()
                    ? Ok(dossiers)
                    : Ok(new { Message = $"No dossiers found for UserId: {userId}." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Notifications du citoyen 
        [HttpGet("notifications")]
        [Authorize(Roles = "citizen")]
        public async Task<IActionResult> GetNotifications()
        {
            if (!Guid.TryParse(Request.Headers["X-User-Id"], out Guid userId))
                return BadRequest("UserId header is missing or invalid.");

            try
            {
                var notifications = await _context.Notifications
                    .Where(n => n.UserId == userId)
                    .ToListAsync();

                return notifications.Any()
                    ? Ok(notifications)
                    : Ok(new { Message = $"No notifications found for UserId: {userId}." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
