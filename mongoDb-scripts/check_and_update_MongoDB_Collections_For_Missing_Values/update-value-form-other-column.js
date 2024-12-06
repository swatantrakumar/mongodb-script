var collName = "app_pojo_master";
var fieldName="level";

const databaseNamesList = db.getMongo().getDBs().databases.map(db => db.name);
databaseNamesList.forEach(dbName => {
    if (dbName !== "admin" && dbName !== "local" && dbName !== "config"){
        print("Database Name. " + dbName);
        const currentDbRef = db.getSiblingDB(dbName);
        const currentColl = currentDbRef.getCollection(collName);
        var data = currentDbRef.getCollection(collName).find({
                        'level': { 
                            $exists: true, 
                            $ne: null, 
                            $ne: '' 
                        }
                    }).toArray();
        if(data && data.length > 0){
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                var id = element._id;
                var value = element[fieldName];                             
                var enrichList = getListByKeyName(element,'enrich_query_with',value);
                var valueForPrimarykeys = value;
                if(valueForPrimarykeys && valueForPrimarykeys.toLowerCase() == 'appid'){
                    valueForPrimarykeys = "appId";
                }else if(valueForPrimarykeys && valueForPrimarykeys.toLowerCase() == 'refcode'){
                    valueForPrimarykeys = "refCode";
                }
                var primaryKeysList = getListByKeyName(element,'primaryKeys',valueForPrimarykeys);
                // var filter = {};
                // filter['_id'] = id;
                // var object ={};
                // var setValue ={};
                // setValue['enrich_query_with'] = enrichList
                // setValue['primaryKeys'] = primaryKeysList
                // object['$set'] = setValue  
                print("Id = "+id +" "+fieldName+" = "+ value);
                print("Modified Enriched Value");
                printjson(enrichList);
                print("Modified Primary Key List Value");
                printjson(primaryKeysList);              
                // currentColl.updateOne(filter,object);
            }
        }
    }
})
function getListByKeyName(obj,key,value) {
    var list = [];
    if(obj && obj[key]){
        if(Array.isArray(obj[key])){
            list = obj[key];
            if(list && list.length > 0){
                var check = false;
                for (let j = 0; j < list.length; j++) {
                    if(list[j].toLowerCase() == value.toLowerCase()){
                      check = true;  
                    }
                }
                if(!check){
                    list.push(value);
                }
            }else{
                list.push(value); 
            }                                               
        }else{
            list.push(value);
        }
    }else{
        list.push(value);
    }
    return list;
}