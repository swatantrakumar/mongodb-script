from pymongo.mongo_client import MongoClient
import certifi
uri = "mongodb+srv://non-prod-db-user:39K46N8bD0AGLyIu@nonproductionshared2.qyu1gi1.mongodb.net/?retryWrites=true&w=majority"
# Create a new client and connect to the server
client = MongoClient(uri, tlsCAFile=certifi.where())
# Send a ping to confirm a successful connection
try:
    db = client['central-non-prod']
    # Get the 'users' collection
    matViewCollection = db['config_materialized_views']
    for document in matViewCollection.find():
        #print(document) # iterate the cursor 
        queries = document['dataQueries']
        for i in range(len(queries)):
            print(queries[i]['pipeline'])
            sourceDb = client[queries[i]['sourceDb']]
            sourceCollection = sourceDb['sourceCollection']
            #targetCollection = sourceDb["targetCollection"]
            #print(''.join(queries[i]['pipeline']))
            print(' '.join([str(elem) for elem in queries[i]['pipeline']]))
            sourceCollection.aggregate(queries[i]['pipeline'])
            #print("aggregation successful for - " + queries[i]['pipeline'])


    #client.admin.command('ping')
    #print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


