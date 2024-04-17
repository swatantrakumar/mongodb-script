const collName = "e_labs_training_employee";

const field = "emp_reporting_manager.name";

const pipeline = [
  { $match: { name: "Shivam" } },

  {
    $graphLookup: {
      from: collName,
        
      startWith: "$" + field,

      connectFromField: field,

      connectToField: "name",

      as: "reportingHierarchy",
    },
  },

  {
    $project: {
      reportingHierarchy: 1,

      name: 1,
    },
  },
];

db.getCollection("e_labs_training_employee").aggregate(pipeline);
