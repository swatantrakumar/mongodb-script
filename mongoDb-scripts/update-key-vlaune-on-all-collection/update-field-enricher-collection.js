const databaseNamesList = db
  .getMongo()
  .getDBs()
  .databases.map((db) => db.name);

  databaseNamesList.forEach((dbname) => {
    if (dbname == "central-elabs-prod") {
      const currentDbRef = db.getSiblingDB(dbname); //it will give thdbamee reference of the current database
      const collNamelist = currentDbRef.getCollectionNames();
      collNamelist.forEach((collName) => {
        if(collName == "field_enricher_properties"){
            if (currentDbRef.getCollection(collName).findOne() !== null) {  
                const targetCollection = currentDbRef.getCollection(collName);
                const data =  targetCollection.find({}).toArray();
                if(data && data.length > 0){
                    data.forEach((obj,i) => {
                        // obj.key = (obj.key).split("_").map((obj1,j,array) =>  Math.round(array.length / 2) == j  ? Array.from(obj1).reverse().join("") : obj1).join("_");
                        obj.classNameWithPath = (obj.classNameWithPath).split(".").map((obj1,j,array) => (array.length - 1) == j ? obj1.slice(0, -1):obj1).join(".");       
                        var filter = {};
                        filter['_id'] = obj._id;
                        var object ={}
                        object['$set'] = obj
                        // targetCollection.updateOne(filter,object);
                        print(dbname + "-Modification Done " + obj.key +"- Collection Name  " + "path name =:-  "+obj.classNameWithPath);
                    })
                }
            
            }
        }
      });
    }
  });