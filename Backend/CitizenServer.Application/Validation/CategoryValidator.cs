using CitizenServer.Domain.Entities;
using FluentValidation;

namespace CitizenServer.Validation
{
    public class CategoryValidator : AbstractValidator<Category>
    {
        public CategoryValidator()
        {
            // Vérification du nom (obligatoire et longueur max)
            RuleFor(c => c.Name)
                .NotEmpty().WithMessage("Le nom de la catégorie est obligatoire.")
                .MaximumLength(100).WithMessage("Le nom de la catégorie ne doit pas dépasser 100 caractères.");

            // Vérification de la description (facultative, mais longueur max si remplie)
            RuleFor(c => c.Description)
                .MaximumLength(500).WithMessage("La description ne doit pas dépasser 500 caractères.");

            // Vérifier qu'il y a au moins un type de document associé si nécessaire
            // RuleFor(c => c.DocumentTypes)
            //     .NotEmpty().WithMessage("La catégorie doit contenir au moins un type de document.");
        }
    }
}