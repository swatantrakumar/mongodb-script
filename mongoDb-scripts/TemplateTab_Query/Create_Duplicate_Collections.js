var colList = ["app_template_tab", "app_form_template"];
const backupDbRefer = db.getSiblingDB("TKT-731");
const databaseNamesList = db.getMongo().getDBs().databases.map(db => db.name);
databaseNamesList.forEach(dbame => {
    if (dbame !== "admin" && dbame !== "local" && dbame !== "config") {
        const currentDbRef = db.getSiblingDB(dbame);
        colList.forEach(collName => {
            var collectionExists = currentDbRef.getCollectionNames().indexOf(collName) !== -1;
            if(collectionExists){
                var newRefName = dbame + "-" + collName + "-19-09-23";
                backupDbRefer.createCollection(newRefName);
                var data = currentDbRef.getCollection(collName).find().toArray();
                if (data != null && data.length > 0) {
                    backupDbRefer[newRefName].insertMany(data);
                }
                print(dbame + "-" + collName +"-copied Sucessfully");
            }
        })
    }
})