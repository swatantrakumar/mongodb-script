const sourceDbName = "itclabs-prod";

const collectionData = [
    {
        collectionName: "el_object_entry_form",
        colName: "_id",
        sourceData:[],
        idList: ["65098fe1d488ba702b61df08"]
    },
    {
        collectionName: "el_object_grid_view",
        colName: "_id",
        sourceData:[],
        idList: ["650990b181193c1e87f1d8f6", "650ad90d3630f85fc3f8a8a1"]
    },
    {
        collectionName: "app_form_template",
        colName: "_id",
        sourceData:[],
        idList: ["65099169d488ba702b6287b6", "650addbc3630f85fc3fa9794"]
    },
    {
        collectionName: "app_template_tab",
        colName: "_id",
        sourceData:[],
        idList: ["6509915ad488ba702b62871d", "650adab7de25ff08195d662e"]
    },
    {
        collectionName: "app_ad_masters",
        colName: "_id",
        sourceData:[],
        idList: ["650c2f7616f5b76ac37bc063", "650c2f6c248aac757ec9b596"]
    },
    {
        collectionName: "el_menu",
        colName: "name",
        idList: ["user"],
        needCopiedidList: {colName : "submenu", idList:["65098d28d488ba702b611296", "650ac6afde25ff081951e8b9"]},
        sourceData:[]
    },
    {
        collectionName: "app_pojo_master",
        colName: "name",
        idList: ["app_user"],
        needCopiedidList: {colName : "aliasNames", idList:[]},
        sourceData:["forgot_password", "user_status"]
    }
];

const sourceDbRef = db.getSiblingDB(sourceDbName);

// Step 1: Retrieve data from the source database
collectionData.forEach(collectionInfo => {
    const collectionName = collectionInfo.collectionName;
    const collName = collectionInfo.colName;
    const idList = collectionInfo.idList;
    const collectionExists = sourceDbRef.getCollectionNames().indexOf(collectionName) !== -1;
    
    if (collectionInfo.sourceData.length === 0 && collectionExists) {
        var query = {};
        query[collName] = {$in: idList};
        collectionInfo.sourceData = sourceDbRef.getCollection(collectionName).find(query).toArray();
    }


    
    if (collectionInfo && collectionInfo.needCopiedidList) {
        const needCopieedList = collectionInfo.needCopiedidList;
        const needCopiedCallName = needCopieedList.colName;
        const needCopiedIdList = needCopieedList.idList;
        var source;
        if(needCopiedIdList && needCopiedIdList.length > 0){
            const object = collectionInfo.sourceData[0];
            source = object[needCopiedCallName];
        } else {
            source = collectionInfo.sourceData;
        };

        const storedData = [];

        if (source && source.length > 0) {
            source.forEach( s => {
                if (needCopiedIdList && needCopiedIdList.length > 0){
                    needCopiedIdList.forEach (id => {
                        if (s && s._id === id) {
                            storedData.push(s);
                        }
                    })
                } else {
                    storedData.push(s);
                }
            })
        }
        if (storedData && storedData.length > 0) {
            collectionInfo.sourceData = storedData;
        }
    }
});


// Step 2: Copy data to target databases
const databaseNamesList = db.getMongo().getDBs().databases.map(db => db.name);
databaseNamesList.forEach(dbName => {
    if (dbName !== "admin" && dbName !== "local" && dbName !== "config" && dbName !== sourceDbName) {
        const currentDbRef = db.getSiblingDB(dbName);
        collectionData.forEach(collectionInfo => {
            const collectionName = collectionInfo.collectionName;
            if (collectionInfo.sourceData && collectionInfo.sourceData.length > 0) {
                // print("step2 ->");
                // printjson(collectionInfo.sourceData);
                const targetCollectionExists = currentDbRef.getCollectionNames().indexOf(collectionName) !== -1;
                if (targetCollectionExists) {
                    const targetCollection = currentDbRef.getCollection(collectionName);
        
                    var firstRecordInTarget;
                    if (collectionInfo && collectionInfo.needCopiedidList && collectionInfo.needCopiedidList.colName) {
                        const collName = collectionInfo.colName;
                        const value = collectionInfo.idList[0];
                        var query = {};
                        query[collName] = value;
                        firstRecordInTarget = targetCollection.findOne(query);
                    } else{
                        firstRecordInTarget = targetCollection.findOne();
                    }
                    //print(collectionInfo.collectionName+"-->"+firstRecordInTarget);
                
                
                    if (firstRecordInTarget) {
                        var modifiedData;

                        if (collectionInfo.needCopiedidList) {
                            modifiedData = collectionInfo.sourceData;
                        } else {
                            const { appId, refCode } = firstRecordInTarget;
                            //print(appId +"-"+refCode);
                            modifiedData = collectionInfo.sourceData.map(doc => {
                                doc.appId = appId;
                                doc.refCode = refCode;
                                return doc;
                            });
                        }
                
                        //print(collectionInfo.collectionName+" , modifiedData ->" +modifiedData);
                        try {
                            if (modifiedData && modifiedData.length > 0) {
                                if (collectionInfo && collectionInfo.needCopiedidList && collectionInfo.needCopiedidList.colName) {
                                    var colName = collectionInfo.needCopiedidList.colName;
                                    var targetValue;
                                    if(firstRecordInTarget && firstRecordInTarget[colName]){
                                        targetValue = firstRecordInTarget[colName];
                                    }                                    
                                    var mergedSubmenus;
                                    if( targetValue && targetValue.length > 0) {                                        
                                        modifiedData.forEach(data =>{                                            
                                            targetValue.push(data);
                                        })
                                        mergedSubmenus = targetValue;
                                    } else {
                                        mergedSubmenus = modifiedData;
                                    }

                                    firstRecordInTarget[colName] = mergedSubmenus;
                                    var filter = {};
                                    filter['_id'] = firstRecordInTarget['_id'];
                                    var object ={}
                                    object['$set'] = firstRecordInTarget
                                    targetCollection.updateOne(filter,object);
                                    print(dbName + "-" + collectionName + " records copied successfully from " + sourceDbName);
                                    //printjson(firstRecordInTarget);
                                } else {
                                    var insertedData =[];
                                    modifiedData.forEach(data =>{
                                        var query = {};
                                        query['_id'] = data._id;
                                        var record = firstRecordInTarget = targetCollection.findOne(query);                                        
                                        if(!record){
                                            insertedData.push(data);
                                        }else{
                                            print(dbName + "-" + collectionName + " This id "+record._id+ " already exist!!!");
                                        }                                        
                                    })
                                    if(insertedData && insertedData.length > 0){
                                        targetCollection.insertMany(insertedData);
                                        print(dbName + "-" + collectionName + " records copied successfully from " + sourceDbName);
                                    }
                                    //printjson(modifiedData);
                                }                                
                            } else {
                                print(`No records inserted in ${collectionName} collection in the target database.`);
                            }
                        } catch (error) {
                            print(`Error inserting data into ${collectionName} collection in the target database: ${error}`);
                        }
                    }
                }
            }
        });
    }
});
