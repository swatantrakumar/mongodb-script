//Creating Duplicate Database Within same Collection With Date & Database Name

var colList = ["el_object_entry_form", "el_object_grid_view"];
var collectionVarification = "tkt_655_counts";
const backupDbRefer = db.getSiblingDB("TKT-655");
var tkt_655_counts = backupDbRefer.getCollection(collectionVarification);
const databaseNamesList = db
  .getMongo()
  .getDBs()
  .databases.map((db) => db.name);
databaseNamesList.forEach((dbame) => {
  if (dbame !== "admin" && dbame !== "local" && dbame !== "config") {
    const currentDbRef = db.getSiblingDB(dbame); //it will give the reference of the current database
    colList.forEach((collName) => {
      var newRefName = dbame + "-" + collName + "31-08-23";
      backupDbRefer.createCollection(newRefName);
      var data = currentDbRef.getCollection(collName).find().toArray();
      if (data != null && data.length > 0) {
        backupDbRefer[newRefName].insertMany(data);
        var newCol = backupDbRefer[newRefName];
        tkt_655_counts.insertOne({
          currentCount: currentDbRef.getCollection(collName).count(),
          newCount: newCol.countDocuments(),
          databaseName: dbame,
          tableName: collName,
        });
      }
      print("copied Sucessfully");
    });
  }
});
