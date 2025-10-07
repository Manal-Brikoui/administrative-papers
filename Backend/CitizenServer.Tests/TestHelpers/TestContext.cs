using CitizenServer.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CitizenService.Tests.TestHelpers
{
    public static class TestContext
    {
        public static CitizenServiceDbContext CreateContext()
        {
            var options = new DbContextOptionsBuilder<CitizenServiceDbContext>()
                .UseInMemoryDatabase(databaseName: $"TestDb_{Guid.NewGuid()}")
                .Options;

            return new CitizenServiceDbContext(options);
        }
    }
}
