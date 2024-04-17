//To Check all DB’s Size → Login with Super Admin and run below command

db.collection.storageSize()

 

//TO check database specific Collection sizes

var collectionNames = db.getCollectionNames(),
  stats = [];
collectionNames.forEach(function (n) {
  stats.push(db[n].stats());
});
for (var c in stats) {
  // skip views
  if (!stats[c]["ns"]) continue;
  print(stats[c]["ns"] + ": " + stats[c]["size"] + "\t ======================     (" + (stats[c]["storageSize"] / 1073741824).toFixed(3) + "GB)");
};