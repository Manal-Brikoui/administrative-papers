using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using CitizenServer.Domain.Entities;
using CitizenServer.Domain.IRepositories;

namespace CitizenService.API.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        // Récupérer toutes les catégories
        [HttpGet]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _categoryRepository.GetAllCategoriesAsync();
            return Ok(categories);
        }

        // Récupérer une catégorie par son ID 
        [HttpGet("{id}")]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> GetCategoryById(Guid id)
        {
            var category = await _categoryRepository.GetCategoryByIdAsync(id);
            if (category == null)
                return NotFound("La catégorie n'a pas été trouvée.");

            return Ok(category);
        }

        // Ajouter une catégorie
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            if (category == null || string.IsNullOrWhiteSpace(category.Name))
                return BadRequest("Les informations de la catégorie sont invalides.");

            await _categoryRepository.AddCategoryAsync(category);

            return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
        }

        //Mettre à jour une catégorie
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] Category updatedCategory)
        {
            if (updatedCategory == null || id != updatedCategory.Id || string.IsNullOrWhiteSpace(updatedCategory.Name))
                return BadRequest("Données invalides.");

            var existing = await _categoryRepository.GetCategoryByIdAsync(id);
            if (existing == null)
                return NotFound("La catégorie n'a pas été trouvée.");

            // Mise à jour sécurisée
            existing.Name = updatedCategory.Name;

            await _categoryRepository.UpdateCategoryAsync(existing);

            return NoContent();
        }

        // Supprimer une catégorie
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var existing = await _categoryRepository.GetCategoryByIdAsync(id);
            if (existing == null)
                return NotFound("La catégorie n'a pas été trouvée.");

            await _categoryRepository.DeleteCategoryAsync(id);

            return NoContent();
        }
    }
}
