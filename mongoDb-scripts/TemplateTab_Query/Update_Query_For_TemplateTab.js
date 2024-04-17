var colList = ["app_template_tab", "app_form_template"];
const fieldsToRemoveForTab = {
    permission: 1,
    type: 1,
    defaultTemplateTab: 1,
    button_field_reference: 1,
    grid_list_reference: 1,
    chart_list_reference: 1,
    chart_list: 1,
    form_view: 1,
    grid_view: 1,
    multi_grid: 1,
    details: 1,
    buttons: 1,
    form: 1,
    grid_list: 1,
    form_only: 1,
    forms: 1,
    grid: 1,
};

const fieldsToRemoveForTemplate = {
    templateTabs: 1,
    filterTab: 1
};


colList.forEach(colName => {
    if (colName === "app_template_tab") {
        removeFieldsFromCollection(colName, fieldsToRemoveForTab);
    } else if (colName === "app_form_template") {
        removeFieldsFromCollection(colName, fieldsToRemoveForTemplate);
    }
});


function removeFieldsFromCollection(collectionName, fieldsToRemove) {
    const databaseNamesList = db.getMongo().getDBs().databases.map(db => db.name);
    databaseNamesList.forEach(dbName => {
        if (dbName !== "admin" && dbName !== "local" && dbName !== "config") {
            const currentDb = db.getSiblingDB(dbName);
            const collection = currentDb.getCollection(collectionName);
            
            if (collection.findOne() !== null) {
                collection.updateMany({}, { $unset: fieldsToRemove });
                print(dbName + "-" + collectionName + " - Modification Done");
            }
        }
    });
}