var colList = ["app_template_tab", "app_form_template"];
const fieldsToCheckForTab = [
    "permission", "type", "defaultTemplateTab", "button_field_reference",
    "grid_list_reference", "chart_list_reference", "chart_list",
    "form_view", "grid_view", "multi_grid", "details", "buttons", "form",
    "grid_list", "form_only", "forms", "grid"
];

const fieldsToCheckForTemplate = [
    "templateTabs", "filterTab"
];

const databaseNamesList = db.getMongo().getDBs().databases.map(db => db.name);
databaseNamesList.forEach(dbName => {
    if (dbName !== "admin" && dbName !== "local" && dbName !== "config") {
        const currentDbRef = db.getSiblingDB(dbName);
        colList.forEach(collName => {
            if (currentDbRef.getCollection(collName).findOne() !== null) {
                print("------------------------------------------------------------");
                print("Database: " + dbName);
                print("Collection: " + collName);

                if (collName === "app_template_tab") {
                    const totalCount = currentDbRef.app_template_tab.count();
                    const fieldCounts = {};
                    fieldsToCheckForTab.forEach(field => {
                        fieldCounts[field] = currentDbRef.app_template_tab.count({ [field]: { $exists: true } });
                    });

                    print("Total Documents: " + totalCount);

                    for (const field in fieldCounts) {
                        if (fieldCounts[field] > 0) {
                            print(field + ": " + fieldCounts[field]);
                        }
                    }
                }

                if (collName === "app_form_template") {
                    const totalCount = currentDbRef.app_form_template.count();
                    const fieldCounts = {};
                    fieldsToCheckForTemplate.forEach(field => {
                        fieldCounts[field] = currentDbRef.app_form_template.count({ [field]: { $exists: true } });
                    });

                    print("Total Documents: " + totalCount);

                    for (const field in fieldCounts) {
                        if (fieldCounts[field] > 0) {
                            print(field + ": " + fieldCounts[field]);
                        }
                    }
                }
            }
        });
    }
});
