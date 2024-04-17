var collName="el_object_entry_form";
var fieldFirst="tableFields";
var fieldSecond="fields";
//Update All Documents where fieldFirst & fieldSecond are present( tableFields will be deleted)
db.collName.updateMany(
    { $and: [
     {fieldFirst: { $exists: true }},
    {fieldSecond: { $exists: true }}
     ]},
     {
         $set: { dbMigrationRemarks: "tableFields deleted, TKT-655", updatedByName: "SYSTEM", updateDate: new Date() },
         $unset: { fieldFirst: 1 }
     }
 );
//Update All Documents where fieldFirst is present but fieldSecond is not present( tableFields will be rename by fields)
 db.collName.updateMany(
     { $and: [
      {fieldFirst: { $exists: true }},
     {fieldSecond: { $exists: false }}
      ]},
      {
          $set: { dbMigrationRemarks: "Rename tableFields to fields, TKT-655", updatedByName: "SYSTEM", updateDate: new Date() },
          $rename: { fieldFirst : fieldSecond }
      }
  );
//Again fieldFirst & fieldSecond value set for next Task
    fieldFirst="tab_list_buttons";
    fieldSecond="buttons";
//Update All Documents where fieldFirst & fieldSecond are present( tab_list_buttons will be deleted)
  db.collName.updateMany(
     { $and: [
     {fieldFirst: { $exists: true }},
     {fieldSecond: { $exists: true }}
      ]},
      {
          $set: { dbMigrationRemarks: "tab_list_buttons deleted, TKT-655", updatedByName: "SYSTEM", updateDate: new Date() },
          $unset: { fieldFirst: 1 }
      }
  );
//Update All Documents where fieldFirst is present but fieldSecond is not present( tab_list_buttons will be rename by buttons)
  db.collName.updateMany(
     { $and: [ 
      {fieldFirst: { $exists: true }},
     {fieldSecond: { $exists: false }}
      ]},
      {
          $set: { dbMigrationRemarks: "Rename tab_list_buttons to buttons, TKT-655", updatedByName: "SYSTEM", updateDate: new Date() },
          $rename: { fieldFirst : fieldSecond }
      }
  );