exports = module.exports = function(io,sensor){

  io.sockets.on('connection', function (socket) {
    console.log('Socket connection is up');
    socket.on('disconnect',function(){
      console.log('Socket disconnected')
      });

    //read data each second(as the driver mode programmed)
    setInterval(function(){
      sensor.read_data();
      //print data in console(true) and a log file(sensor_log.txt)
      sensor.print_data(true,'sensor_log.txt');
      let sensor_data = sensor.get_data();
      socket.emit('sensor_data',sensor_data)
    },1000)

  })
}
