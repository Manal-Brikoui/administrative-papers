using CitizenServer.Domain.Entities;
using FluentValidation;

namespace CitizenServer.Validation
{
    public class DossierValidator : AbstractValidator<DossierAdministratif>
    {
        public DossierValidator()
        {
            RuleFor(d => d.UserId)
                .NotEmpty().WithMessage("L'identifiant utilisateur est obligatoire.");

            RuleFor(d => d.TypeDossierId)
                .NotEmpty().WithMessage("Le type de dossier est obligatoire.");

            RuleFor(d => d.Status)
                .NotEmpty().WithMessage("Le statut est obligatoire.")
                .Must(s => s == "en cours" || s == "validé" || s == "rejeté")
                .WithMessage("Le statut doit être 'en cours', 'validé' ou 'rejeté'.");

            RuleFor(d => d.SubmissionDate)
                .LessThanOrEqualTo(DateTime.UtcNow)
                .WithMessage("La date de soumission ne peut pas être dans le futur.");
        }
    }
}