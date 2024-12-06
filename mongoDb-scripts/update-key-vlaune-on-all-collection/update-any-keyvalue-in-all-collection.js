const databaseNamesList = db
  .getMongo()
  .getDBs()
  .databases.map((db) => db.name);

  databaseNamesList.forEach((dbname) => {
    if (dbname == "demo-practice-management") {
      const currentDbRef = db.getSiblingDB(dbname); //it will give thdbamee reference of the current database
      const collNamelist = currentDbRef.getCollectionNames();
      collNamelist.forEach((collName) => {
        if (currentDbRef.getCollection(collName).findOne() !== null) {          
             currentDbRef.getCollection(collName).updateMany(
               {
                 $or: [
                   { appId: { $exists: true } },
                   { refCode: { $exists: true } },
                 ],
               },
               {
                 $set: {
                   dbMigrationRemarks: "update appId or refCode DEPM or DEPM01",
                   updatedByName: "SYSTEM",
                   updateDate: new Date(),
                   appId:"DEPM",
                   refCode:"DEPM01"
                 }
               }
             );
            print(dbname + "-Modification Done " + collName +"- Collection Name");
          
        }
      });
    }
  });