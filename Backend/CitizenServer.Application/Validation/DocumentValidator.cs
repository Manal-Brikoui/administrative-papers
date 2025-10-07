using CitizenServer.Domain.Entities;
using FluentValidation;

namespace CitizenServer.Validation
{
    public class DocumentValidator : AbstractValidator<Document>
    {
        public DocumentValidator()
        {
            // Vérification du Type
            RuleFor(doc => doc.Type)
                .NotEmpty().WithMessage("Le type du document est obligatoire.")
                .MaximumLength(150).WithMessage("Le type du document ne doit pas dépasser 150 caractères.");

            // Vérification du chemin du fichier
            RuleFor(doc => doc.FilePath)
                .NotEmpty().WithMessage("Le chemin du fichier est obligatoire.")
                .Must(path => path.EndsWith(".pdf") || path.EndsWith(".jpg") || path.EndsWith(".png"))
                .WithMessage("Seuls les fichiers PDF, JPG et PNG sont autorisés.");

            // Vérification de la date de dépôt
            RuleFor(doc => doc.UploadDate)
                .LessThanOrEqualTo(DateTime.UtcNow)
                .WithMessage("La date de soumission ne peut pas être dans le futur.");

            // Vérification de l'utilisateur
            RuleFor(doc => doc.UserId)
                .NotEmpty().WithMessage("L'identifiant utilisateur est obligatoire.");

            // Vérification du dossier administratif lié
            RuleFor(doc => doc.DossierAdministratifId)
                .NotEmpty().WithMessage("Le dossier administratif associé est obligatoire.");
        }
    }
}