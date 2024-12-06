var collName = "app_pojo_master";
var fieldName="level";

const databaseNamesList = db.getMongo().getDBs().databases.map(db => db.name);
databaseNamesList.forEach(dbName => {
    if (dbName !== "admin" && dbName !== "local" && dbName !== "config"){
        const currentDbRef = db.getSiblingDB(dbName);        
        currentDbRef.getCollection(collName).updateMany(
            {},
            { $unset: { level: "" } }
            );
    }
})