CCS811 Setup and Code for Raspberry Pi 3 Model B
------------------------------------------------
This project use a CCS811(air quality sensor from sparkfun) for measuring the:
  *eCO2(equivalent CO2)
  *TVOC(Total Volatile Organic Compound)

The sensor is connected to a Raspberry Pi 3 Model B using I2C peripheral

Setup
-----------------
CCS811:
  Four of this sensor's pins were used(GND,3.3V,SDA,SCL) and they were connected to Raspberry as follow:
    GND - to Raspberry's Ground (Pin 6)
    3.3v - to Raspberry's 3.3V DC Power (Pin 1)
    SDA - to Raspberry's SDA1,I2C GPIO02 (Pin 3)
    SCL - to Raspberry's SCL1,I2C GPIO03 (Pin 5)

Raspberry:
  1.Enable I2C
    The I2C peripheral is not turned on by default and it was used the 'raspi-config' command to enable
    it as shown in on ('https://learn.sparkfun.com/tutorials/raspberry-pi-spi-and-i2c-tutorial') example.
  2.Change baud rate
    CCS811 require different baud rate rather the default one.
    Baud rate was set to 10000 by adding to '/boot/config.txt' - 'dtparam=i2c_baudrate=10000'.

Code
-----------------
  This repository contains two different versions of code in order to display the CCS811 eCO2 and TVOC.

  I.CCS811_only_node
  ------------------
   This alternative runs only on Raspberry. It reads data from CCS811 and creates and interface with
   a chart on port 8080.
   A driver mode is set to take measurements every second and to send them via websocket to interface.
   Four main modules are used in this application:
    *i2c-bus -  for communicating with the slave device
    *express - for seting up the node server
    *express - handlebars - as template engine
    *socket.io - for sending data to interface

   For using this version on code copy this folder on Raspberry, after you enabled the i2c and set
   the baud rate to 10000, run 'npm install' in order to install the modules and then run 'node app.js'.
   After this you can see the eCO2 and TVOC being printed in the console and you can connect to your
   Raspberry Pi ip address and then to port 8080.

  I.CCS811_python_node
  ------------------
  This alternative runs on Raspberry and a different machine.

  Python Code:
  ---------
    The Python code runs on Raspberry in order to read data from CCS811 and then to post it
    in a hosted database(mLab).
    This code requires two modules to be installed on the Raspberry:
      *smbus - for communicating with the slave device
      *pymongo - for database communication
    A simmilar driver mode is used this time in order to send data every second to mLab.

  Node Code:
  ---------
    The Nodejs code runs on a different machine and creates a server which query the database
    every seconds and sends the data via websocket to interface.
    Same modules are used in this application plus 'mongodb' which is used for db communication.

  For using this alternative, copy 'ccs811_setup' folder on Raspberry, do the same settings,
  install the modules and run 'python ccs811.py' after copy the 'front-end' folder on the other machine
  run 'npm install' and then 'node app.js'.The last command will create the interface at port
  8080 on your machine.
