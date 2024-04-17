//Multiple DBs Coll

var collName = "app_user";
var fieldList = [
    {columnName : "accountStatus",value:"Active","type":"text","update":"all"},
    {columnName : "lastPasswordResetDate",value:"2023-07-01T03:38:33.000+0000",type:"date","update":"criteria",
        criteria:
            {
                1:"2023-07-11T03:38:33.000+0000",
                2:"2023-07-15T03:38:33.000+0000",
                3:"2023-07-22T03:38:33.000+0000",
                4:"2023-07-29T03:38:33.000+0000",
                5:"2023-08-05T03:38:33.000+0000",
                6:"2023-08-12T03:38:33.000+0000",
                7:"2023-08-19T03:38:33.000+0000",
                8:"2023-08-26T03:38:33.000+0000",
                9:"2023-09-03T03:38:33.000+0000",
                10:"2023-09-10T03:38:33.000+0000",
                11:"2023-09-17T03:38:33.000+0000",
                12:"2023-09-24T03:38:33.000+0000",
                13:"2023-09-30T03:38:33.000+0000"
            }
        
    }
]
const databaseNamesList = db.getMongo().getDBs().databases.map(db => db.name);

databaseNamesList.forEach(dbame => {
    if (dbame !== "admin" && dbame !== "local" && dbame !== "config") {
        const currentDbRef = db.getSiblingDB(dbame);
        const collNamelist = currentDbRef.getCollectionNames();
        
        if (collNamelist.includes(collName)) {
            const currentColl = currentDbRef.getCollection(collName);
            fieldList.forEach(colInfo => {
                var cName = colInfo.columnName;
                var cValue = colInfo.value;
                switch (colInfo.type) {
                    case 'text':
                        if(colInfo.update == "all"){
                            cValue = colInfo.value;
                            currentColl.updateMany({}, { $set: { [cName]: cValue } });
                            print("Updated this Column all record: " + cName);
                        }
                        break;
                    case 'date':
                        if(colInfo.update == "all"){
                            currentColl.updateMany({}, { $set: { [cName]: ISODate(cValue) } });
                            print("Updated this Column all record: " + cName);
                        }else{
                            var data  = currentDbRef.getCollection(collName).find().toArray();
                            var criteria = colInfo.criteria;
                            var noItem = 50;
                            var page = parseInt(data.length / noItem) + 1;
                            print("Data no. " + data.length);
                            if(data.length > 0){
                                for (let i = 1; i <= page; i++) {
                                    var startIndex;
                                    var noitems;
                                    if(i == 1){
                                        startIndex = 0;
                                        noitems = noItem;
                                    }else {
                                        startIndex = noItem * (i -1);
                                        noitems = noItem * i
                                    } 
                                    print("page no. " + i);
                                    for (let index = startIndex; index < noitems; index++) {                                        
                                        if(index < data.length){
                                            const element = data[index];
                                            var id = element._id;
                                            cValue = criteria[i];
                                            var filter = {};
                                            filter['_id'] = id;
                                            var object ={};
                                            var setValue ={};
                                            setValue[cName] = ISODate(cValue)
                                            object['$set'] = setValue
                                            printjson(filter);
                                            printjson(object);
                                            currentColl.updateOne(filter,object);
                                            print("Item index. " + index + " _id " + id + " ColumnName :- " + cName + " value :- " + cValue); 
                                        }
                                    }
                                }
                            }
                        }
                        break;                
                    default:
                        break;
                }
            })
            print("Updated in database: " + dbame);
        }
    }
});


//Single Db Code

db = db.getSiblingDB("central-non-prod");
const currentColl = db.getCollection("app_user");;
currentColl.updateMany({}, { $set: { ['lastPasswordResetDate']: ISODate("2023-06-01T03:38:33.000+0000") } });