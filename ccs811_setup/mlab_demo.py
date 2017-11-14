
#info https://github.com/mongolab/mongodb-driver-examples/blob/master/python/pymongo_simple_example.py

import pymongo
import time
from datetime import datetime
import schedule


# set connection uri
uri = 'mongodb://sensor:sensor@ds259305.mlab.com:59305/ccs811'
client = pymongo.MongoClient(uri)

db = client.get_default_database()
coll = db['data']

def save_data():
    date_object = datetime.now()
    coll.insert_one({
        "eCO2":'400ppm',
        "TVOC":'69ppb',
        "time":date_object
    })


schedule.every(10).seconds.do(save_data)

while(True):
    schedule.run_pending()
# result = coll.insert_one({
# "eco2":'asfd'
# })
# get default database
# todos = db['todos']
# cursor = todos.find()
# for doc in cursor:
#     print(doc['todo_body'])
