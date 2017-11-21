import smbus
import time
import sys
from datetime import datetime
import schedule
import pymongo

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
    sys.exit()

# set i2c address as 1
bus = smbus.SMBus(1)
# slave address
address = 0x5b

#file where the results will be printed
file = open('data_log.txt','a')

def get_status():
    bus.write_byte(address,0x00)
    return bus.read_byte(address)

def get_hw_id():
    bus.write_byte(address,0x20)
    return bus.read_byte(address)

def reset_sensor():
    reset_vals = [0x11,0xE5,0x72,0x8A]
    bus.write_i2c_block_data(address,0XFF,reset_vals)

#combine hex
#/////////////////
def combine_hex(byte_1,byte_2):
    combined = byte_1 << 8 | byte_2
    return combined

#get eCO2
#/////////////////
def get_eCO2(eCO2_high_byte,eCO2_low_byte):
    eCO2 = combine_hex(eCO2_high_byte,eCO2_low_byte)
    return eCO2

#get TVOC
#/////////////////
def get_TVOC(TVOC_high_byte,TVOC_low_byte):
    TVOC = combine_hex(TVOC_high_byte,TVOC_low_byte)
    return TVOC

#Pretty prin the data in a file
#/////////////////
def print_data(eCO2,TVOC,status):
    date_str = str("Sample data on " + str(time.strftime("%Y-%m-%d %H:%M:%S")))
    line_separator = "------------------------------------------"
    data_array = [[line_separator,"",""],[date_str,'',""],["eC02","TVOC","status"],[str(eCO2) + 'ppm' ,str(TVOC) + 'ppb',str(status)]]
    for row in data_array:
        file.write("{: >10} {: >10} {: >10}\n".format(*row))
	print("{: >10} {: >10} {: >10}\n".format(*row))

def save_data(eCO2,TVOC):
    #post data in the collection
    date_object = datetime.now()
    collection.insert_one({
        "eCO2":eCO2,
        "TVOC":TVOC,
        "time":date_object
    })
# Read data
#/////////////////
def read_routine():
    data_status = get_status()
    if(data_status is not int('0x98',16)):
        print('failed to set a new data sample in ALG_RESULT_DATA status is',hex(data_status))
        # sys.exit()
    else:
        print('a new data sample is ready in ALG_RESULT_DATA')
        bus.write_byte(address,0x02)
        block_data_eCO2_TVOC = bus.read_i2c_block_data(address,0x02,8)

        eCO2 = get_eCO2(block_data_eCO2_TVOC[0],block_data_eCO2_TVOC[1])
        TVOC = get_TVOC(block_data_eCO2_TVOC[2],block_data_eCO2_TVOC[3])
        status = hex(block_data_eCO2_TVOC[4])
        print_data(eCO2,TVOC,status)
        save_data(eCO2,TVOC)

#main
#/////////////////
def run():
    #read id and compare it to 0x81(1000 0001)
    hw_id = get_hw_id()
    if(hw_id is not int('0x81',16)):
        print('hw id invalid')
        sys.exit()
    else:
        print('hw id is OK, 0x81')

    # Read status to check if app is valid
    status_app_valid = get_status()
    if(status_app_valid is not int('0x10',16)):
        print('app not valid')
        sys.exit()
    else:
        print('status is OK, 0x10')

    # Switch from boot mode to application mode
    bus.write_byte(address,0xF4)
    status_fw_mode = get_status()
    if(status_fw_mode is not int('0x90',16)):
        print('failed to set in application mode, current status is',hex(status_fw_mode))
        sys.exit()
    else:
        print('status is OK(application mode), 0x90')

    # Set drive mode to x10 = measurements every second
    bus.write_byte_data(address, 0x01, 0x10)
    print('Sensor is reading data')
    time.sleep(1)

    schedule.every(1).seconds.do(read_routine)

    while(True):
        try:
            schedule.run_pending()
        except (KeyboardInterrupt,SystemExit):
            print('KeyboardInterrupt')
            file.close()
            reset_sensor()
            bus.close()

if(__name__ == "__main__"):
    run()
