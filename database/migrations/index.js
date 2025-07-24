async function runMigrations() {
    try {
        const migrateUsers = require("./1-create-users");
        const migrateBanners = require("./2-create-banners");
        const migrateServices = require("./3-create-services");
        const migrateTransactions = require("./4-create-transactions");

        await migrateUsers();
        await migrateBanners();
        await migrateServices();
        await migrateTransactions();

        console.log("All migrations completed!");
        process.exit()
    } catch (error) {
        console.error("Migration failed:", error)
        process.exit(1)
    }
}

runMigrations()