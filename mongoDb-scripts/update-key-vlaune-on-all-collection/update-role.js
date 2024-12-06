const databaseNamesList = db
  .getMongo()
  .getDBs()
  .databases.map((db) => db.name);

  databaseNamesList.forEach((dbname) => {
    if (dbname == "central-elabs-prod") {
      const currentDbRef = db.getSiblingDB(dbname); //it will give thdbamee reference of the current database
      const collNamelist = currentDbRef.getCollectionNames();
      collNamelist.forEach((collName) => {
        if(collName == "app_role"){
            if (currentDbRef.getCollection(collName).findOne() !== null) {  
                const targetCollection = currentDbRef.getCollection(collName);
                const data =  targetCollection.find({}).toArray();
                if(data && data.length > 0){
                    data.forEach((obj,i) => {
                    let appResourceList = obj.appResourceList;
                        for (const key in appResourceList) {
                            if (Object.prototype.hasOwnProperty.call(appResourceList, key)) {
                                const menusObj = appResourceList[key];
                                let menus = menusObj.menus;
                                for (const key in menus) {
                                    if (Object.prototype.hasOwnProperty.call(menus, key)) {
                                        const menu = menus[key];
                                        if(menu && menu.submenus){
                                            for (const key in menu.submenus) {
                                                if (Object.prototype.hasOwnProperty.call(menu.submenus, key)) {
                                                    const submenu = menu.submenus[key];
                                                    let templateTabs = submenu.templateTabs;
                                                    submenu.templatTabs = templateTabs;
                                                    delete submenu.templateTabs;
                                                }
                                            }
                                        }else{
                                        let templateTabs = menu.templateTabs;
                                        menu.templatTabs = templateTabs;
                                        delete menu.templateTabs;
                                        }
                                        
                                    }
                                }
                            }
                        }
                        
                        
                        var filter = {};
                        filter['_id'] = obj._id;
                        var object ={}
                        object['$set'] = obj
                        // targetCollection.updateOne(filter,object);
                        
                    })
                }
            
            }
        }
      });
    }
  });