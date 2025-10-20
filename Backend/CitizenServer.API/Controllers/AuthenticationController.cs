using CitizenServer.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Text.Json;

namespace CitizenServer.API.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly ICurrentUserService _currentUserService;

        // Injection de dépendances pour récupérer l'utilisateur courant
        public AuthenticationController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        // Récupérer les informations de l'utilisateur authentifié
        [HttpGet("user-info")]
        [Authorize(Roles = "admin,citizen")]
        public IActionResult GetUserInfo()
        {
            try
            {
                var userInfo = new
                {
                    IsAuthenticated = _currentUserService.IsAuthenticated,
                    UserId = _currentUserService.UserId,
                    Email = _currentUserService.Email,
                    UserName = _currentUserService.UserName,
                    FirstName = _currentUserService.FirstName,
                    LastName = _currentUserService.LastName,
                    Roles = _currentUserService.Roles
                };

                return Ok(userInfo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Erreur interne : {ex.Message}" });
            }
        }

        [HttpPut("update-profile")]
        [Authorize(Roles = "admin,citizen")]
        public IActionResult UpdateProfile([FromBody] JsonElement updatedProfile)
        {
            try
            {
                if (!_currentUserService.IsAuthenticated)
                {
                    return Unauthorized(new { error = "Utilisateur non authentifié" });
                }

                // Vérification des données mises à jour
                if (updatedProfile.ValueKind == JsonValueKind.Object)
                {
                    string firstName = updatedProfile.GetProperty("firstName").GetString();
                    string lastName = updatedProfile.GetProperty("lastName").GetString();
                    string email = updatedProfile.GetProperty("email").GetString();

                    if (string.IsNullOrWhiteSpace(firstName) || string.IsNullOrWhiteSpace(lastName) || string.IsNullOrWhiteSpace(email))
                    {
                        return BadRequest(new { error = "Tous les champs du profil doivent être renseignés." });
                    }

                    var updatedUser = new
                    {
                        FirstName = firstName,
                        LastName = lastName,
                        Email = email
                    };

                    // Logique pour mettre à jour les informations dans une base de données ou un autre système
                    // Exemple : _userService.UpdateUserProfile(_currentUserService.UserId, updatedUser);

                    return Ok(new { message = "Profil mis à jour avec succès", user = updatedUser });
                }
                else
                {
                    return BadRequest(new { error = "Format de données invalide" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Erreur lors de la mise à jour du profil : {ex.Message}" });
            }
        }


        //  Modifier le mot de passe
        [HttpPut("change-password")]
        [Authorize(Roles = "admin,citizen")]
        public IActionResult ChangePassword([FromBody] JsonElement passwordData)
        {
            try
            {
                var oldPassword = passwordData.GetProperty("oldPassword").GetString();
                var newPassword = passwordData.GetProperty("newPassword").GetString();

                if (string.IsNullOrWhiteSpace(oldPassword) || string.IsNullOrWhiteSpace(newPassword))
                {
                    return BadRequest(new { error = "Le mot de passe actuel et le nouveau mot de passe sont requis." });
                }

                // affiche les mots de passe pour vérifier qu'ils arrivent correctement
                Console.WriteLine($"Ancien mot de passe: {oldPassword}, Nouveau mot de passe: {newPassword}");

                
              

                return Ok(new { message = "Mot de passe modifié avec succès" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Erreur lors du changement de mot de passe : {ex.Message}" });
            }
        }

        // Déconnexion
        [HttpPost("logout")]
        [Authorize(Roles = "admin,citizen")]
        public IActionResult Logout()
        {
            try
            {
                // Déconnexion via Keycloak
                HttpContext.SignOutAsync();
                return Ok(new { message = "Déconnexion réussie" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Erreur lors de la déconnexion : {ex.Message}" });
            }
        }
    }
}
