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
    public class CategoryService : ICategoryService
    {
        private readonly CitizenServiceDbContext _context;

        public CategoryService(CitizenServiceDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync()
        {
            var categories = await _context.Categories.ToListAsync();
            return categories.Select(MapToDTO);
        }

        public async Task<CategoryDTO> GetCategoryByIdAsync(Guid id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
            return category == null ? null : MapToDTO(category);
        }

        public async Task<CategoryDTO> CreateCategoryAsync(CategoryDTO dto)
        {
            if (dto == null) return null;

            var entity = MapToEntity(dto);
            _context.Categories.Add(entity);
            await _context.SaveChangesAsync();
            return MapToDTO(entity);
        }

        public async Task<CategoryDTO> UpdateCategoryAsync(CategoryDTO dto)
        {
            var entity = await _context.Categories.FindAsync(dto.Id);
            if (entity == null) return null;

            entity.Name = dto.Name;
            entity.Description = dto.Description;

            await _context.SaveChangesAsync();
            return MapToDTO(entity);
        }

        public async Task<bool> DeleteCategoryAsync(Guid id)
        {
            var entity = await _context.Categories.FindAsync(id);
            if (entity == null) return false;

            _context.Categories.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        private static CategoryDTO MapToDTO(Category entity)
        {
            return new CategoryDTO
            {
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description
            };
        }

        private static Category MapToEntity(CategoryDTO dto)
        {
            return new Category
            {
                Id = dto.Id == Guid.Empty ? Guid.NewGuid() : dto.Id,
                Name = dto.Name,
                Description = dto.Description
            };
        }
    }
}
