import pymongo
import time
from datetime import datetime
import schedule

#database setup
try:
    # set connection uri
    uri = 'mongodb://sensor:sensor@ds259305.mlab.com:59305/ccs811'
    client = pymongo.MongoClient(uri)
    print('Connection successful to mLab')

    #get db and collection
    db = client.get_default_database()
    collection = db['data']
except pymongo.errors.ConnectionFailure:
    print ("Could not connect to MongoDB")

date_object = datetime.now()
collection.insert_one({
    "eCO2":'asfd',
    "TVOC":'asfd',
    "time":date_object
})
