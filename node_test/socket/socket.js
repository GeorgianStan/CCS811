exports = module.exports = function(io,sensor){

  io.sockets.on('connection', function (socket) {
    console.log('Socket connection is up');
    socket.on('disconnect',function(){
        console.log('Socket disconnected')
      });

      // function send_data(){
      //   sensor.read_data().then(function(data_buff){
      //     // sensor.console_print_data() //print data in console
      //     let eCO2 = sensor.get_eCO2()
      //     socket.emit('sensor_data',eCO2)
      //     send_data()
      //   })
      // }
      // send_data()
      // setInterval(function(){ //each 1000ms or 10000ms(1 or 10 seconds as set at driver mode) read data
      //       sensor.read_data().then(function(data_buff){
      //         sensor.console_print_data() //print data in console
      //         let eCO2 = sensor.get_eCO2()
      //         socket.emit('sensor_data',eCO2)
      //       })
      //     },1000)

        })
}
