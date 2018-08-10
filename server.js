'use strict';

var port = process.env.PORT || 8081;
var express = require('express');
var app = express();
var request = require('request');

const yelp = require('yelp-fusion');
const client = yelp.client('VX8TupFV-Cp1zsjl4VIP36I46aG1DxelTvE-f2gd_1JuzW3S8M6aZmLxozEV4awyhjEYZEhGWZHN-voadDUd2m_lSJFsFnl2gR3M9q_A9rY8bNU1WRO5AqM6s9nKWnYx');
const apikey='VX8TupFV-Cp1zsjl4VIP36I46aG1DxelTvE-f2gd_1JuzW3S8M6aZmLxozEV4awyhjEYZEhGWZHN-voadDUd2m_lSJFsFnl2gR3M9q_A9rY8bNU1WRO5AqM6s9nKWnYx';

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {

    var address = req.query.address;
    var miles= req.query.miles;
    var keyword=req.query.keyword;
    var category = req.query.category;
    

    if(miles===''){
        miles = 16090;
    }
    else{
        miles=1609*miles;
    }
    
   var latitude;
   var longitude;
    
   if(address !== '' && address!==undefined){
       
    var url_address = address.split(" ");
    var url_str = url_address.join('+');   
    console.log("encoded address : " +url_str);
       
    var apikey = 'AIzaSyCwdNGyF7-wq5BVjw6UpwOmb4xq1YvqFog';   
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+url_str+"&key="+apikey ;
       
    request(url, function (error, response, body) {
    latitude = JSON.parse(body).results[0].geometry.location.lat ;
    longitude = JSON.parse(body).results[0].geometry.location.lng;  
       
    apikey='AIzaSyBfZyQDUIVf9HYAexEbP6AC4N0sQHAPWHU';
    
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+ latitude+","+ longitude +"&radius="+ miles+"&type="+category+"&keyword="+keyword+"&key="+apikey;
    
      //  console.log(url);
    request(url, function (error, response, body) {
        //console.log(body);
        res.send(JSON.parse(body));
    });
    
    });
       
    } 
    else{
    latitude= req.query.lat;
    longitude= req.query.lon;
        
    var apikey='AIzaSyBfZyQDUIVf9HYAexEbP6AC4N0sQHAPWHU';
    
    var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+ latitude+","+ longitude +"&radius="+ miles+"&type="+category+"&keyword="+keyword+"&key="+apikey;
    
    request(url, function (error, response, body) {
        res.send(JSON.parse(body));
    });
        
    }

})

app.get('/coordinates',function(req,res){
    
    var address = req.query.addr;
    
    if(address !== '' && address!==undefined){
    var url_address = address.split(" ");
    var url_str = url_address.join('+');   
    console.log("encoded address : " +url_str);
       
    var apikey = 'AIzaSyCwdNGyF7-wq5BVjw6UpwOmb4xq1YvqFog';   
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+url_str+"&key="+apikey ;
       
    request(url, function (error, response, body) { 
        console.log(JSON.parse(body));
       res.send(JSON.parse(body));
    });
    }
});
    
app.get('/nextpage', function (req, res) {

    var token = req.query.token;
    var apikey='AIzaSyBfZyQDUIVf9HYAexEbP6AC4N0sQHAPWHU';

    var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken="+ token +"&key="+apikey;
    
    request(url, function (error, response, body) {
        console.log(body);
        res.send(JSON.parse(body));
    });
    
});

 app.get('/yelpreviews', function (req, res) {
   var url ='https://api.yelp.com/v3/businesses/matches/best?name='+encodeURIComponent(req.query.name)+'&city='+encodeURIComponent(req.query.city)+'&state='+encodeURIComponent(req.query.state)+'&country='+encodeURIComponent(req.query.country);

   console.log(url);    

client.businessMatch('best', {

name: req.query.name,
state: req.query.state,
city: req.query.city,
country: 'US',
address1:req.query.addr1,
latitude:req.query.lat,
longitude:req.query.lon
    
}).then(response => {

if(req.query.name==response.jsonBody.businesses[0].name) {

client.reviews(response.jsonBody.businesses[0].id).then(response => {
    console.log(response.jsonBody);
    res.send(response.jsonBody);

}).catch(e => {
  console.log(e);
  res.send({});
});
}      

}).catch(e => {
  console.log(e);
  res.send({});
});
         
});


var server = app.listen(port,function(){
    console.log("Server running on port 8081.....");
});
