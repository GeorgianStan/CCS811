import pymongo
uri = None
def do_connection():
    try:
        # set connection uri
        uri = 'mongodb://interface:interface@ds259305.mlab.com:59305/ccs811'
        client = pymongo.MongoClient(uri)
        print('Connection successful to mLab')

        #get db and collection
        db = client.get_default_database()
        # coll = db['data']
    except pymongo.errors.ConnectionFailure:
        print ("Could not connect to MongoDB")

print(uri)
if(__name__ == "__main__"):
    do_connection()
