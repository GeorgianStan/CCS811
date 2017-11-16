exports = module.exports = function(io){
  io.sockets.on('connection', function (socket) {
    console.log('Socket connection is up');
    socket.on('disconnect',function(){
        console.log('Socket disconnected')
      });

    socket.on('get_sensor_data',function(){
      console.log(db)
    })
  });
}
