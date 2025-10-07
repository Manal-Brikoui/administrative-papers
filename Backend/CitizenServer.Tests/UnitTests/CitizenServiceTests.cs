using Microsoft.EntityFrameworkCore;
using CitizenServer.Infrastructure.Data;

namespace CitizenServer.Tests.TestHelpers
{
    public static class TestContext
    {
        public static CitizenServiceDbContext GetInMemoryDbContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<CitizenServiceDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;

            var context = new CitizenServiceDbContext(options);

            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            return context;
        }
    }
}