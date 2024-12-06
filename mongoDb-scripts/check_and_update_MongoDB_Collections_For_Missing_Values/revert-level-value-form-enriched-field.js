var collName = "app_pojo_master";
var fieldName="level";

function getListByKeyName(obj,key,value){
    var mlist = [];
    if(obj && obj[key]){
        if(Array.isArray(obj[key])){
            var list = obj[key];
            if(list && list.length > 0){
                var check = false;
                for (let j = 0; j < list.length; j++) {
                    if(list[j].toLowerCase() !== value.toLowerCase()){
                        mlist.push(list[j]);
                    }
                }
            }                                              
        }
    }
    return mlist;
}

const databaseNamesList = db.getMongo().getDBs().databases.map(db => db.name);
databaseNamesList.forEach(dbName => {
    if(dbName !== "admin" && dbName !== "config" && dbName !== "local" && dbName !== "REDUCE-RESPONSE-SIZE-TKT-1012-02-02-2024" && dbName !== "TKT-655" && dbName !== "backup-tkt-522-29-04-2024" &&  dbName !== "chart-prod-db" &&  dbName !== "multani-sit"){
        
        const currentDbRef = db.getSiblingDB(dbName);
        var currentData = currentDbRef.getCollection(collName).find({
            'level': { 
                $exists: true, 
                $ne: null, 
                $ne: '' 
            }
        }).toArray();
        const currentColl = currentDbRef.getCollection(collName);
        if(currentData && currentData.length > 0){
            for (let index = 0; index < currentData.length; index++) {
                const element = currentData[index];
                var id = element._id;
                var value = element[fieldName];
                var curEnrichList = element['enrich_query_with'];
                print("Current Enriched List = " + curEnrichList);
                var enrichList = getListByKeyName(element,'enrich_query_with',value);
                print("Reverted Enriched List = " + enrichList);
                
                var filter = {};
                filter['_id'] = id;
                var object ={};
                var setValue ={};
                setValue['enrich_query_with'] = enrichList;
                object['$set'] = setValue               
                currentColl.updateOne(filter,object);
            }            
        }
        
    }
})




