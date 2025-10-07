using Xunit;
using CitizenServer.Tests.TestHelpers;
using CitizenServer.Domain.Entities;
using CitizenServer.Domain.Aggregates;
using CitizenServer.Domain.DomainServices;
using System;
using Assert = Xunit.Assert;
using TestContext = CitizenServer.Tests.TestHelpers.TestContext;

namespace CitizenService.Tests.UnitTests
{
    public class DossierServiceTests
    {
        [Fact]
        public void ValiderDossier_Complet_RetourneEvenement()
        {
            var context = TestContext.GetInMemoryDbContext("DossierDbTest");

            var dossier = new DossierAdministratif
            {
                Id = Guid.NewGuid(),
                Status = "En cours",
                IsCompleted = true
            };

            var dossierAggregate = new DossierAggregate(dossier);
            var service = new DossierService();
            var userId = Guid.NewGuid();

            var evt = service.ValiderDossier(dossierAggregate, userId);

            Assert.NotNull(evt);
            Assert.Equal(dossier.Id, evt.DossierId);
        }
    }
}