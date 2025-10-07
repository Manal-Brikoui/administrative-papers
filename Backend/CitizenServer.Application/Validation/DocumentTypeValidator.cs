using CitizenServer.Domain.Entities;
using FluentValidation;

namespace CitizenServer.Validation
{
    public class DocumentTypeValidator : AbstractValidator<DocumentType>
    {
        public DocumentTypeValidator()
        {
            RuleFor(d => d.Name)
                .NotEmpty().WithMessage("Le nom du type de document est obligatoire.")
                .MaximumLength(200).WithMessage("Le nom ne doit pas dépasser 200 caractères.");

            RuleFor(d => d.Category)
                .NotEmpty().WithMessage("La catégorie est obligatoire.")
                .MaximumLength(100).WithMessage("La catégorie ne doit pas dépasser 100 caractères.");

            RuleFor(d => d.CategoryId)
                .NotEmpty().WithMessage("La catégorie associée est obligatoire.");

            RuleFor(d => d.TypeDossierId)
                .NotEmpty().WithMessage("Le type de dossier associé est obligatoire.");
        }
    }
}