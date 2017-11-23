const express =require('express');
const router = express.Router();




router.get('/',function(req,res){
  console.log('req to main')
  let scripts = [{script:'/javascript/indexController.js'}];

  res.render('index',{title:'Sensor chart', scripts:scripts})
})


module.exports = router;
