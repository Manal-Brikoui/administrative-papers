using System;
using Xunit;
using CitizenServer.Domain.DomainServices;
using CitizenServer.Domain.Entities;
using Assert = Xunit.Assert;

namespace CitizenServer.Tests.UnitTests
{
    public class RendezvousServiceTests
    {
        [Fact]
        public void CreerRendezvous_DateFuture_Success()
        {
            var service = new RendezvousService();
            var userId = Guid.NewGuid();
            var typeDossierId = Guid.NewGuid();
            var date = DateTime.UtcNow.AddDays(3);

            var rdv = service.CreerRendezvous(userId, typeDossierId, date);

            Assert.NotNull(rdv);
            Assert.Equal(userId, rdv.UserId);
            Assert.Equal(typeDossierId, rdv.TypeDossierId);
            Assert.Equal("Planifié", rdv.Status);
        }

        [Fact]
        public void CreerRendezvous_DatePasse_ThrowException()
        {
            var service = new RendezvousService();

            Assert.Throws<InvalidOperationException>(() =>
                service.CreerRendezvous(Guid.NewGuid(), Guid.NewGuid(), DateTime.UtcNow.AddDays(-1))
            );
        }

        [Fact]
        public void AnnulerRendezvous_ChangeStatus()
        {
            var service = new RendezvousService();
            var rdv = service.CreerRendezvous(Guid.NewGuid(), Guid.NewGuid(), DateTime.UtcNow.AddDays(2));

            service.AnnulerRendezvous(rdv);

            Assert.Equal("Annulé", rdv.Status);
        }

        [Fact]
        public void ConfirmerPresence_ChangeStatus()
        {
            var service = new RendezvousService();
            var rdv = service.CreerRendezvous(Guid.NewGuid(), Guid.NewGuid(), DateTime.UtcNow.AddDays(2));

            service.ConfirmerPresence(rdv);

            Assert.Equal("Confirmé", rdv.Status);
        }
    }
}