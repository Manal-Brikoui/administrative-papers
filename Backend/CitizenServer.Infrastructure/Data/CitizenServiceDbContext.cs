using Microsoft.EntityFrameworkCore;
using CitizenServer.Domain.Entities;
using System;

namespace CitizenServer.Infrastructure.Data
{
    public class CitizenServiceDbContext : DbContext
    {
        public CitizenServiceDbContext(DbContextOptions<CitizenServiceDbContext> options) : base(options) { }

        // DbSets
        public DbSet<Category> Categories { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Rendezvous> Rendezvous { get; set; }
        public DbSet<DossierAdministratif> Dossiers { get; set; }
        public DbSet<TypeDossier> TypeDossiers { get; set; }
        public DbSet<DocumentType> DocumentTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ===== RELATIONS =====

            // DossierAdministratif ↔ TypeDossier (1 - n)
            modelBuilder.Entity<DossierAdministratif>()
                .HasOne(d => d.TypeDossier)
                .WithMany(t => t.Dossiers)
                .HasForeignKey(d => d.TypeDossierId)
                .OnDelete(DeleteBehavior.Restrict);

            // Document ↔ DossierAdministratif (1 - n)
            modelBuilder.Entity<Document>()
                .HasOne(d => d.DossierAdministratif)
                .WithMany(d => d.Documents)
                .HasForeignKey(d => d.DossierAdministratifId)
                .OnDelete(DeleteBehavior.Cascade);

            // DocumentType ↔ Category (1 - n)
            modelBuilder.Entity<DocumentType>()
                .HasOne(dt => dt.CategoryEntity)
                .WithMany(c => c.DocumentTypes)
                .HasForeignKey(dt => dt.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // DocumentType ↔ TypeDossier (1 - n)
            modelBuilder.Entity<DocumentType>()
                .HasOne(dt => dt.TypeDossierEntity)
                .WithMany(td => td.DocumentTypes)
                .HasForeignKey(dt => dt.TypeDossierId)
                .OnDelete(DeleteBehavior.Restrict);

            // ===== CONTRAINTES =====

            // Category.Name obligatoire
            modelBuilder.Entity<Category>()
                .Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(100);

            // Index sur UserId dans DossierAdministratif (recherche rapide par utilisateur)
            modelBuilder.Entity<DossierAdministratif>()
                .HasIndex(d => d.UserId);

            // ===== SEEDING =====
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "General" },
                new Category { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Legal" }
            );

            modelBuilder.Entity<TypeDossier>().HasData(
                new TypeDossier { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Passeport" },
                new TypeDossier { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Name = "Carte Nationale" }
            );
        }
    }
}
