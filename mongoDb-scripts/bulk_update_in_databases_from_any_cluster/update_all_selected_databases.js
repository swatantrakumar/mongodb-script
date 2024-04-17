var colList = ["el_object_entry_form", "el_object_grid_view"];
const databaseNamesList = db
  .getMongo()
  .getDBs()
  .databases.map((db) => db.name);

//If in a cluster's Databases having colList then update as per requirment

databaseNamesList.forEach((dbame) => {
  if (dbame !== "admin" && dbame !== "local" && dbame !== "config") {
    const currentDbRef = db.getSiblingDB(dbame); //it will give the reference of the current database
    colList.forEach((collName) => {
      if (currentDbRef.getCollection(collName).findOne() !== null) {
        if (collName === "el_object_entry_form") {
          currentDbRef.el_object_entry_form.updateMany(
            {
              $and: [
                { tableFields: { $exists: true } },
                { fields: { $exists: true } },
              ],
            },
            {
              $set: {
                dbMigrationRemarks: "tableFields deleted, TKT-655",
                updatedByName: "SYSTEM",
                updateDate: new Date(),
              },
              $unset: { tableFields: 1 },
            }
          );
          currentDbRef.el_object_entry_form.updateMany(
            {
              $and: [
                { tableFields: { $exists: true } },
                { fields: { $exists: false } },
              ],
            },
            {
              $set: {
                dbMigrationRemarks: "Rename tableFields to fields, TKT-655",
                updatedByName: "SYSTEM",
                updateDate: new Date(),
              },
              $rename: { tableFields: "fields" },
            }
          );
          currentDbRef.el_object_entry_form.updateMany(
            {
              $and: [
                { tab_list_buttons: { $exists: true } },
                { buttons: { $exists: true } },
              ],
            },
            {
              $set: {
                dbMigrationRemarks: "tab_list_buttons deleted, TKT-655",
                updatedByName: "SYSTEM",
                updateDate: new Date(),
              },
              $unset: { tab_list_buttons: 1 },
            }
          );
          currentDbRef.el_object_entry_form.updateMany(
            {
              $and: [
                { tab_list_buttons: { $exists: true } },
                { buttons: { $exists: false } },
              ],
            },
            {
              $set: {
                dbMigrationRemarks:
                  "Rename tab_list_buttons to buttons, TKT-655",
                updatedByName: "SYSTEM",
                updateDate: new Date(),
              },
              $rename: { tab_list_buttons: "buttons" },
            }
          );
          print(dbame + "-Modification Done");
        } else {
          currentDbRef.el_object_grid_view.updateMany(
            {
              $and: [
                { action_buttons: { $exists: true } },
                { buttons: { $exists: true } },
              ],
            },
            {
              $set: {
                dbMigrationRemarks: "action_buttons deleted, TKT-655",
                updatedByName: "SYSTEM",
                updateDate: new Date(),
              },
              $unset: { action_buttons: 1 },
            }
          );
          currentDbRef.el_object_grid_view.updateMany(
            {
              $and: [
                { action_buttons: { $exists: true } },
                { buttons: { $exists: false } },
              ],
            },
            {
              $set: {
                dbMigrationRemarks: "Rename action_buttons to buttons, TKT-655",
                updatedByName: "SYSTEM",
                updateDate: new Date(),
              },
              $rename: { action_buttons: "buttons" },
            }
          );
          currentDbRef.el_object_grid_view.updateMany(
            {
              $and: [
                { gridColumns: { $exists: true } },
                { fields: { $exists: true } },
              ],
            },
            {
              $set: {
                dbMigrationRemarks: "gridColumns deleted, TKT-655",
                updatedByName: "SYSTEM",
                updateDate: new Date(),
              },
              $unset: { gridColumns: 1 },
            }
          );
          currentDbRef.el_object_grid_view.updateMany(
            {
              $and: [
                { gridColumns: { $exists: true } },
                { fields: { $exists: false } },
              ],
            },
            {
              $set: {
                dbMigrationRemarks: "Rename gridColumns to fields, TKT-655",
                updatedByName: "SYSTEM",
                updateDate: new Date(),
              },
              $rename: { gridColumns: "fields" },
            }
          );
          print(dbame + "-Modification Done");
        }
      }
    });
  }
});
