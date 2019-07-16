let express = require('express');
let app = express();
let cors = require('cors')
let envConfig = require('./devconfig')
app.use(cors());
let ithours = require('ithours')
var config = {
    environment: 'environment.json'
}
var process = require('process');
process.on('uncaughtException', function(err) {
    console.log("uncaughtException occured" + JSON.stringify(err));
})
var itHoursModule = ithours.bootstrap(app, config);

app.get('/sendotp/:mobile',function(req,res){

  var code = Math.floor(1000 + Math.random() * 9000);
    var otp = "Your otp is - "+code;
    var authkey = "256789AD7mJOR75d2c44d7";
    var moobileno = req.params.mobile;

    var url = "https://api.msg91.com/api/sendhttp.php?campaign=&response=&afterminutes=&flash=&unicode=&mobiles="+moobileno+"&authkey="+authkey+"&route=4&sender=TESTIN&message="+otp+"&country=91";
    console.log(url);
    

    var request = require('request');
 
var options = {
  url: url,
  headers: {
    'User-Agent': 'request'
  }
};
 

 
request(options, function callback(error, response, body) {
   
    if (!error && response.statusCode == 200) {
      //var info = JSON.parse(body);
      //console.log(info);
      //res.send({otp:code});
      res.send({ issuccess : true, otp : code});
    }else{
      res.send({ issuccess : false});
    }
  });
   

});

app.listen(1100)