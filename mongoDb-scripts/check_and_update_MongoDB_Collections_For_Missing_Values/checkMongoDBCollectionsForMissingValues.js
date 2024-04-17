var collName = "el_email_template";
var fieldName="type";
const reqValue = ["USER_NEW_ACCOUNT_TEMPLATE_JWT", "USER_NEW_ACCOUNT_TEMPLATE"];

const databaseNamesList = db.getMongo().getDBs().databases.map(db => db.name);
databaseNamesList.forEach(dbName => {
    if (dbName !== "admin" && dbName !== "local" && dbName !== "config"){
        const currentDbRef = db.getSiblingDB(dbName);
        const collNamelist = currentDbRef.getCollectionNames();
        if (collNamelist.includes(collName)){
            const currentColl = currentDbRef.getCollection(collName);
            if(currentColl.find({fieldName:{ $exists: true}})){
                
                //fieldValue is a list and we have to print wheather it matches one or all or nothing value is not mathed with reqValue and print it
                const fieldValue = currentColl.fieldName;
                for(let val of reqValue){
                    if(currentDbRef.collName.find({val :{$nin : fieldValue}})){
                        print(dbName + " and "+collName +" and " + fieldName +"  Not Having "  +val + " in field");
                    }
                }
            }else{
                print(dbName + " and "+collName + "  Not Having "  +fieldName + " field");
            }
            
        }else{
            print(dbName + "  Not Having  " +collName +" collection");
        }
    }
})