const databaseNamesList = db
  .getMongo()
  .getDBs()
  .databases.map((db) => db.name);

  databaseNamesList.forEach((dbname) => {
    if (dbname == "central-elabs-prod") {
      const currentDbRef = db.getSiblingDB(dbname); //it will give thdbamee reference of the current database
      const collNamelist = currentDbRef.getCollectionNames();
      collNamelist.forEach((collName) => {
        if(collName == "app_template_tab" || collName == "el_object_entry_form" || collName == "el_object_grid_view"){
            if (currentDbRef.getCollection(collName).findOne() !== null) {  
                const targetCollection = currentDbRef.getCollection(collName);
                const data =  targetCollection.find({}).toArray();
                if(data && data.length > 0){
                    let multiplyCount = 1;
                    let val = 5;
                    let index = val;
                    data.forEach((obj,i) => {
                        if(i == index){                                                        
                            var filter = {};
                            filter['_id'] = obj._id;
                            print("col Name = "+collName+"cont record =" + index);
                            // targetCollection.deleteOne(filter);
                            multiplyCount++;
                            index = val * multiplyCount;
                        }
                        
                    })
                }
            
            }
        }
      });
    }
  });