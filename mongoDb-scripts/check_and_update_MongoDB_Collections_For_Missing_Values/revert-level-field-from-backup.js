var collName = "app_pojo_master";
var fieldName="level";
var backupDbName = "backup-tkt-522-29-04-2024";

const databaseNamesList = db.getMongo().getDBs().databases.map(db => db.name);
databaseNamesList.forEach(dbName => {
    if(dbName !== "admin" && dbName !== "config" && dbName !== "local" && dbName !== "REDUCE-RESPONSE-SIZE-TKT-1012-02-02-2024" && dbName !== "TKT-655" && dbName !== "backup-tkt-522-29-04-2024" &&  dbName !== "chart-prod-db" &&  dbName !== "multani-sit"){
        var modifidedCollection = dbName + "-" + collName + "29-04-24";
        const currentDbRef = db.getSiblingDB(dbName);
        const backupDbRef = db.getSiblingDB(backupDbName);
        var backupData = backupDbRef.getCollection(modifidedCollection).find({
            'level': { 
                $exists: true, 
                $ne: null, 
                $ne: '' 
            }
        }).toArray();
        var curData = currentDbRef.getCollection(collName).find({}).toArray();
        // const currentColl = currentDbRef.getCollection(collName);
        if(backupData && backupData.length > 0){
            print("Database Name = " + dbName);
            print("Backup Db collection Length = " + backupData.length);
            print("Current Db collection Length = " + curData.length);
            for (let index = 0; index < backupData.length; index++) {
                const element = backupData[index];
                var id = element._id;
                var backupDataLevel = element[fieldName]
                print("Backup db id or collection Name or level  = " + id +" , "+element.name + " , "+ backupDataLevel);
                var currentObject = currentDbRef.getCollection(collName).findOne({"_id":id});
                print("Current db id or collection Name or level  = " + currentObject._id +" , "+currentObject.name +" , "+ currentObject?.level);
                if(currentObject && currentObject._id){
                    var filter = {};
                    filter['_id'] = id;
                    var object ={};
                    var setValue ={};
                    setValue[fieldName] = backupDataLevel;
                    object['$set'] = setValue  
                    printjson(object);              
                    // currentColl.updateOne(filter,object);
                    var afterUpdateObject = currentDbRef.getCollection(collName).findOne({"_id":id});
                    print("After Update db id or collection Name or level = " + afterUpdateObject._id +" , "+afterUpdateObject.name +" , "+ afterUpdateObject?.level);
                }
            }            
        }
        
    }
})



