exports = module.exports = function(io,db){

  io.sockets.on('connection', function (socket) {
    console.log('Socket connection is up');
    socket.on('disconnect',function(){
        console.log('Socket disconnected')
      });

    socket.on('get_sensor_data',function(){
      let last_update = new Date();
      setInterval(function(){
        console.log(new Date().getSeconds())
        db.collection('data').findOne({}, {sort:{$natural:-1}}).then(function(sensor_data){

          if(last_update.getTime() ==  new Date(sensor_data.time).getTime()){
            console.log('they are equal',last_update,new Date(sensor_data.time))
            socket.emit('no_measurement')
          } else{
            socket.emit('sensor_data',sensor_data)
            console.log(sensor_data)
            last_update = new Date(sensor_data.time);
          }

        })
      },1000)

    });
  })

}
