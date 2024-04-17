//Count query for all conditions:------------>
db.el_object_entry_form.find(
    { $and: [
     {tableFields: { $exists: true }},
    {fields: { $exists: true }}
     ]}
 ).count();

 db.el_object_entry_form.find(
     { $and: [
     
      {tableFields: { $exists: true }},
     {fields: { $exists: false }}
      ]}
  ).count();

  db.el_object_entry_form.find(
     { $and: [
     
     {tab_list_buttons: { $exists: true }},
     {buttons: { $exists: true }}
      ]}
  ).count();

  db.el_object_entry_form.find(
     { $and: [
     
      {tab_list_buttons: { $exists: true }},
     {buttons: { $exists: false }}
      ]}
  ).count();
