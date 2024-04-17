var collName="el_object_entry_form";
var fieldFirst="tableFields";
var fieldSecond="fields";
//To get All Documents where fieldFirst & fieldSecond are present
db.collName.find(
               { $and: [
                {fieldFirst: { $exists: true }},
               {fieldSecond: { $exists: true }}
                ]}
            );

//To get All Documents where fieldFirst is present but fieldSecond is not present 
            db.collName.find(
                { $and: [
                 {fieldSecond: { $exists: true }},
                {fieldSecond: { $exists: false }}
                 ]}
             );
//Again fieldFirst & fieldSecond value set for next Task
             var fieldFirst="tab_list_buttons";
             var fieldSecond="buttons";

//To get All Documents where fieldFirst & fieldSecond are present
             db.collName.find(
                { $and: [
                {fieldFirst: { $exists: true }},
                {fieldSecond: { $exists: true }}
                 ]}
             );

//To get All Documents where fieldFirst is present but fieldSecond is not present
             db.collName.find(
                { $and: [
                 {fieldFirst: { $exists: true }},
                {fieldSecond: { $exists: false }}
                 ]}
             );