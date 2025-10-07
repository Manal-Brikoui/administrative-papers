using CitizenServer.Application.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync();
        Task<CategoryDTO> GetCategoryByIdAsync(Guid id);
        Task<CategoryDTO> CreateCategoryAsync(CategoryDTO category);
        Task<CategoryDTO> UpdateCategoryAsync(CategoryDTO category);
        Task<bool> DeleteCategoryAsync(Guid id);
    }
}
