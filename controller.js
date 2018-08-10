
 
    var latitude;
    var longitude;
    var latitude2;
    var longitude2;
    var previousdata= new Array() ;
    var pagecount;

var place_results ;
//    var maxcount;

var googlereviews;
var googlereviews_default;
var yelpreviews;
var yelpreviews_default;

var token;
var favresults;

//localStorage.setItem('favresults',favresults);

    $(document).ready(function(){
    
    $.ajax({
    url: 'http://ip-api.com/json',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    async : false,
    crossDomain: true,
    dataType: 'jsonp',
    success: function(data) {
    latitude = data.lat;
    longitude = data.lon;
     //alert(lat+" " + lon);   
   //if(document.getElementById('keyword').value !== '')
    document.getElementById('submit').disabled=false; 
        
    }
    });
        
    });
    
    function removeErr1(){
        document.getElementById('keyword').style.border='1px solid gray';
        document.getElementById('error1').innerHTML = '';  
    }
    function removeErr2(){
        document.getElementById('locationtext').style.border='1px solid gray';
        document.getElementById('error2').innerHTML = '';  
    }

    function validate(){

        
    if(document.getElementById('keyword').value === '' || !document.getElementById('keyword').value.replace(/\s/g, '').length){
       document.getElementById('keyword').style.border="2px solid red";
       document.getElementById('error1').innerHTML="Please enter a keyword.";
        return false;
    }
    if(document.getElementById('location2').checked === true && (document.getElementById('locationtext').value === '' || !document.getElementById('locationtext').value.replace(/\s/g, '').length)){
       document.getElementById('locationtext').style.border="2px solid red";
       document.getElementById('error2').innerHTML="Please enter a location.";
        return false;
    }
        else{
            callServer();
        }
    }
    
    function clearForm(){
     document.getElementById('keyword').value='';
     document.getElementById('keyword').style.border="default";
     document.getElementById('error1').innerHTML="";
     document.getElementById('default').selected = true;
     document.getElementById('distance').value='';
     document.getElementById('locationtext').value='';
     document.getElementById('location1').checked=true;
     disableLocation();
    }

    function enableLocation(){
        document.getElementById('locationtext').disabled=false; 
    }
    
    function disableLocation(){
        document.getElementById('locationtext').disabled=true; 
    }

    function callServer(){
          
    var lati = latitude;
    var long =longitude;    
    var address='';
    var keyword = document.getElementById('keyword').value;
    var category = document.getElementById('category').value;
    var miles = document.getElementById('distance').value;

    if(document.getElementById('location2').checked)
    address = document.getElementById('locationtext').value;
        
    var jsondata = {lat:lati , lon:long, address:address, miles:miles, category:category, keyword:keyword} ;

    pagecount=0;
    //maxcount=0;
    token ='';
    previousdata = [];
        
    
    $.ajax({
    url: 'http://myapp2018-env.us-east-2.elasticbeanstalk.com',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: jsondata,
    async: false,
    success: function(data) {
    
    renderTable(data.results);
    previousdata[++pagecount]=data.results;
    if(data.next_page_token !== undefined){
      if(document.getElementById('nextpagebutton')!==null)
        document.getElementById('nextpagebutton').style.visibility ='visible';
        token = data.next_page_token;
        
    }
        
    }
    });
      
    }

  function getResults(){
document.getElementById('btn1').innerHTML='<button type="button" class="btn btn-primary" onclick="getResults()">Results</button><button type="button" class="btn btn-link" onclick="getFavs()">Favourites</button>';
       // var results = localStorage.getItem('pageresults');
        var lati = latitude;
    var long =longitude;    
    var address='';
    var keyword = document.getElementById('keyword').value;
    var category = document.getElementById('category').value;
    var miles = document.getElementById('distance').value;

    if(document.getElementById('location2').checked)
    address = document.getElementById('locationtext').value;
        
    var jsondata = {lat:lati , lon:long, address:address, miles:miles, category:category, keyword:keyword} ;
        token='';
    $.ajax({
    url: 'http://myapp2018-env.us-east-2.elasticbeanstalk.com',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: jsondata,
    async: false,
    success: function(data) {
    
    renderTable(data.results);     
    if(data.next_page_token !== undefined){
      if(document.getElementById('nextpagebutton')!==null)
        document.getElementById('nextpagebutton').style.visibility ='visible';
        token = data.next_page_token;
    }
        
    }
    });
        
        document.getElementById('resultArea').style.visibility='visible';
        document.getElementById('nextpage').style.visibility='visible';
    }

  function getFavs(){
      document.getElementById('btn1').innerHTML=    
  '<button type="button" class="btn btn-link" onclick="getResults()">Results</button><button type="button" class="btn btn-primary" onclick="getFavs()">Favourites</button>';
      
      document.getElementById('resultArea').innerHTML ='';
      document.getElementById('nextpage').innerHTML ='';
      
      renderFavs();
      
  }
    maxcount=1;

    $(document).on('click','#nextpagebutton',function(e){
        
    $.ajax({
    url: 'http://myapp2018-env.us-east-2.elasticbeanstalk.com/nextpage',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: { token:token },
    async: false,
    success: function(data) {
    
    document.getElementById('previouspagebutton').style.visibility ='visible';
        
    if(previousdata[pagecount+1]!==undefined){
        renderTable(previousdata[++pagecount]);
    }
    else{    
    renderTable(data.results);  
    previousdata[++pagecount]=data.results;
    }
        
    if(data.next_page_token !== undefined){
        document.getElementById('nextpagebutton').style.visibility ='visible';
        token = data.next_page_token;
        maxcount++;
    }
    else{
       // if(pagecount===maxcount)
        document.getElementById('nextpagebutton').style.visibility ='hidden';
        }    
    }
        
    });
    
    });
       
    $(document).on('click','#previouspagebutton',function(e){
        
        if(pagecount>1){
        renderTable(previousdata[--pagecount]);
        document.getElementById('nextpagebutton').style.visibility ='visible';
        document.getElementById('previouspagebutton').style.visibility ='visible';
        
        }
        if(pagecount==1){
           renderTable(previousdata[1]);
           document.getElementById('nextpagebutton').style.visibility ='visible';
           document.getElementById('previouspagebutton').style.visibility ='hidden';
        }
    });
    
    function renderTable(results){
        var html_text;
        
        if(results.length === 0){
            html_text=' <br><div class="container"><br><br><div class="alert alert-danger">Failed to get search results</div></div>';
        }
        
   else{
       
       place_results = results;
       
    html_text='<br><div class="container"><table class="table"><thead><tr><th>#</th><th>Category</th><th>Name</th><th>Address</th><th>Favourites</th><th>Details</th></tr></thead><tbody>';
    
    for(var i = 0 ; i < results.length ; i++){
        html_text+='<tr>';
        html_text+='<td>'+(i+1)+'</td>';
        html_text+='<td><img src= " ' + results[i].icon + ' " alt="icon" '+i +' height="30" width="30"></td>';
        html_text+='<td><a href="#" onclick="renderReviews('+i+');return false;" >' + results[i].name +'</a></td>';
        html_text+='<td>'+ results[i].vicinity +'</td>';
        html_text+='<td><button type="button" class="btn btn-default btn-sm" id="fav" onclick="onfav('+i+')"><i class="fa fa-star"></i></button></td>';
        html_text+='<td><button type="button" onclick="renderDetails(\'' +results[i].place_id+ '\');return false;"  class="btn btn-default btn-sm" ><span class="glyphicon glyphicon-chevron-right"></span></button></td>';
        html_text+='</tr>'        
    }
     html_text+='</tbody></table></div>';
    }
    document.getElementById('details').style.visibility = 'hidden';
     document.getElementById('resultArea').innerHTML = html_text;
        
    }

function onfav(id){

    
    favresults = JSON.parse(localStorage.getItem('favresults')) || [];

    favresults.push(place_results[id]);

    localStorage.setItem('favresults', JSON.stringify(favresults));
    

 //localStorage.removeItem('favresults'); 
}

function removeFav(id){
    
    favresults = JSON.parse(localStorage.getItem('favresults'));
    if(favresults!==null)
    favresults.splice(id, 1);
    localStorage.setItem('favresults', JSON.stringify(favresults));
    renderFavs();
}

 function renderFavs(){
    results = JSON.parse(localStorage.getItem('favresults'));
     
     console.log(results);
    var html_text;
     
    if(results==null || results.length === 0){
            html_text=' <br><div class="container"><br><br><div class="alert alert-warning">No Favourites Found. </div></div>';
        }
        
   else{
       
    html_text='<br><div class="container"><table class="table"><thead><tr><th>#</th><th>Category</th><th>Name</th><th>Address</th><th>Favourites</th><th>Details</th></tr></thead><tbody>';
    
    for(var i = 0 ; i < results.length ; i++){
        html_text+='<tr>';
        html_text+='<td>'+(i+1)+'</td>';
        html_text+='<td><img src= " ' + results[i].icon + ' " alt="icon" '+i +' height="30" width="30"></td>';
        html_text+='<td><a href="#" onclick="renderReviews('+i+');return false;" >' + results[i].name +'</a></td>';
        html_text+='<td>'+ results[i].vicinity +'</td>';
        html_text+='<td><button type="button" onclick="removeFav('+i+')" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-trash"></span></button></td>';
        html_text+='<td><button type="button" onclick="renderDetails(\'' +results[i].place_id+ '\');return false;"  class="btn btn-default btn-sm" ><span class="glyphicon glyphicon-chevron-right"></span></button></td>';
        html_text+='</tr>'        
    }
     html_text+='</tbody></table></div>';
    }
     
    document.getElementById('details').style.visibility = 'hidden';
    document.getElementById('resultArea').innerHTML = html_text;
        
    }

var rates=0;
var rates2=0;
    
  function renderDetails(id){    
        
        
        document.getElementById('resultArea').innerHTML='';
        document.getElementById('nextpage').innerHTML='';
           
        
        document.getElementById('pbar').style.visibility = 'visible';
        document.getElementById('details').style.visibility = 'hidden';
      
        
        $('.nav-tabs a[href="#info"]').tab('show');

      
        var request  = {
          placeId: id
        };
      
        service = new google.maps.places.PlacesService(document.createElement('div'));
        service.getDetails(request, callback);
    
        
        function callback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
    
            
            
        html = '<div class="container">';
        html += '<table class="table table-striped"><tbody>';
            place_results = place;
     //   console.log(place);
            
       document.getElementById('placename').innerHTML = place.name;    
            
        if(place.formatted_address !== undefined)
        html += '<tr><td><b>Address</b></td><td> '+place.formatted_address+'</td></tr>';
        
        if(place.international_phone_number !== undefined)
        html += '<tr><td><b>Phone Number</b></td><td>'+place.international_phone_number+'</td></tr>';
            
        if(place.price_level !== undefined){
        var dollar = '$';
            for(var x=0;x<place.price_level;x++)
            dollar+='$';
            html += '<tr><td><b>Price Level</b></td><td>'+dollar+'</td></tr>';
        }
        if(place.rating !== undefined)
        {
        rates=place.rating;
        html += '<tr tyle="display:inline-block"><td><b>Rating</b></td><td>'+rates+'<span id="rateYo"></span></td></tr>';
        
        }
        
        
     $(function(){
        
        $("#rateYo").rateYo({
            
            rating: rates,
            readOnly:true,
            numStars: Math.ceil(rates),
            starWidth: "13px"       
          
        });     
       });

            
        if(place.url !== undefined)
        html += '<tr><td><b>Google Page</b></td><td><a target="_blank" href="'+place.url+'">'+place.url+'</a></td></tr>';
        
        if(place.website !== undefined)
        html += '<tr><td><b>Website</b></td><td><a target="_blank" href="'+place.website+'">'+place.website+'</a></td></tr>';
            
        if(place.opening_hours !== undefined){
        
            var time = moment().utcOffset(place.utc_offset).format("dddd");
        
           //alert(time);
            for(var i = 0; i<7;i++ ){
                var hours = (place.opening_hours.weekday_text[i]).split(":");
                if(time== hours[0]){
                    dayindex=i;
                    break;
                }
            }
            
            var hours = (place.opening_hours.weekday_text[dayindex]).split(":");
        
            
         //   alert(now);
        var timing ='';
        for(var i = 1; i<hours.length-1 ; i++){
            timing += hours[i] +':';
        }
            timing += hours[hours.length -1 ];
        if(place.opening_hours.open_now){
            html += '<tr><td><b>Hours</b></td><td>Open now:'+timing+"   ";
        }
        else{
        html += '<tr><td><b>Hours</b></td><td>Closed   ';    
        }
        
        var content='<table class="table"><tbody>';    
        var i = dayindex;
        do{ 
            var hours = (place.opening_hours.weekday_text[i]).split(":");
            
            if(i==dayindex)
            content+='<tr><td><b>'+hours[0]+'</b></td><td><b>'+timing+'</b></td></tr>';
            else
                content+='<tr><td>'+hours[0]+'</td><td>'+timing+'</td></tr>';
            i= (i+1)%7 ;
        }while( i !== dayindex );
            
        content+='</tbody></table>';
        
            document.getElementById('modal-body').innerHTML = content;
        
            html+='<a href="#" data-toggle="modal" data-target="#myModal" >Daily open hours</a></td><tr>'    
        
        }
        
        html+= '</tbody></table>' ;
        html+='</div>';
        //console.log(html);
            
            
        document.getElementById('info').innerHTML = html;    
            
            
       // html = '<br>';
        html='<div class="container">';
       
        if(place.photos!==undefined){
        html += '<div class="row">'; 
        
 html+='<div class="column">';  
        if(place.photos.length>0){
     
        for(var i = 0 ; i <(place.photos.length); i+=4){
        html+='<a target="_blank" href="'+place.photos[i].getUrl({'maxWidth':place.photos[i].width, 'maxHeight':place.photos[i].height})+'" > <img src="'+place.photos[i].getUrl({'maxWidth':200,'maxHeight':300})+'" style="width:100%"></a>';
        }     
        }
          
        html+='</div>' ; 
        html+='<div class="column" >';     
         if(place.photos.length>1){
       
        for(var i = 1 ; i <(place.photos.length); i+=4){
     html+='<a target="_blank" href="'+place.photos[i].getUrl({'maxWidth':place.photos[i].width, 'maxHeight':place.photos[i].height})+'" > <img src="'+place.photos[i].getUrl({'maxWidth':200,'maxHeight':300})+'" style="width:100%"></a>';
        }
         }
              html+='</div>' ;
            html+='<div class="column" >';
         if(place.photos.length>2){
        
        for(var i = 2 ; i <(place.photos.length); i+=4){
       html+='<a target="_blank" href="'+place.photos[i].getUrl({'maxWidth':place.photos[i].width, 'maxHeight':place.photos[i].height})+'" > <img src="'+place.photos[i].getUrl({'maxWidth':200,'maxHeight':300})+'" style="width:100%"></a>';
        }
         }
            
        html+='</div>';    
         html+='<div class="column" >';
        if(place.photos.length>3){
       
        for(var i = 3 ; i <(place.photos.length); i+=4){ 
        html+='<a target="_blank" href="'+place.photos[i].getUrl({'maxWidth':place.photos[i].width, 'maxHeight':place.photos[i].height})+'" > <img src="'+place.photos[i].getUrl({'maxWidth':200,'maxHeight':300})+'" style="width:100%"></a>';
        }    
        
        }
     html+='</div>';             
       
         html+='</div>'; 
        }
        
        else{
                
            html +=' <br><div class="alert alert-warning">No Photos Found. </div>';
        }
           
        html+='</div>';
            
        document.getElementById('photos').innerHTML = html;  
        
            
        document.getElementById('toloc').value= place.formatted_address;
     
            
        googlereviews = place.reviews;
        googlereviews_default = place.reviews;
        renderReviews(place.reviews,0,0);
         
        current = 'google';
            
        name = place.name;
        addr = (place.formatted_address).split(",");
        city = addr[1].trim();
        statepin= addr[2].trim();
        state =  statepin[0]+statepin[1];
        country = addr[3].trim(); 
        addr1 = place.vicinity.slice(0,63);
        lat = place.geometry.location.lat;
        lon =  place.geometry.location.lng;
         // alert(name + " "+city + " " + state+" "+ country + " "+addr1);   

    $.ajax({
    url: 'http://myapp2018-env.us-east-2.elasticbeanstalk.com/yelpreviews',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    async : false,
    crossDomain: true,
    dataType: 'json',
    data: {name:name, city:city,state:state,country:country, addr1:addr1 },
    success: function(data) {
    console.log(data.reviews);
    if(data.reviews !==undefined){
        yelpreviews = data.reviews;
      //  renderReviewsYelp(yelpreviews,0,0);
       yelpreviews_default = data.reviews;
    }
    }
    });
        
            
            latitude2 = place.geometry.location.lat();
            longitude2 = place.geometry.location.lng();
            
                initMap();
        
            
            
    //    document.getElementById('header').innerHTML = html;
            
        }//end of status ok
        }
      
      
      
       document.getElementById('details').style.visibility = 'visible';  
       document.getElementById('pbar').style.visibility = 'hidden';
       
    
    }

  function onyelp(){
    current = 'yelp';
      
    document.getElementById('dd1').innerHTML ='Yelp Reviews<span class="caret"></span>';
    renderReviewsYelp(yelpreviews,0,0);
  }

 function ongoogle(){
     current = 'google';

    document.getElementById('dd1').innerHTML ='Google Reviews<span class="caret"></span>';
     renderReviews(googlereviews,0,0);
 }

 function ondefault(){
    
    document.getElementById('dd2').innerHTML ='Default Order<span class="caret"></span>';
     
     if(current ==='google'){
         renderReviews(googlereviews,0,0);
     }
     if(current === 'yelp'){
         renderReviewsYelp(yelpreviews,0,0);
     }
 }

 function onmostrecent(){
    
    document.getElementById('dd2').innerHTML ='Most Recent<span class="caret"></span>';
    document.getElementById('dd2').innerHTML 
     
     if(current ==='google'){
         renderReviews(googlereviews,1,0);
     }
     if(current === 'yelp'){
         renderReviewsYelp(yelpreviews,1,0);
     }
 }

 function onleastrecent(){
 
        document.getElementById('dd2').innerHTML ='Least Recent<span class="caret"></span>';
     if(current ==='google'){
         renderReviews(googlereviews,2,0);
     }
     if(current ==='yelp'){
         renderReviewsYelp(yelpreviews,2,0);
     }
 }

 function onhighrating(){
     
     
    document.getElementById('dd2').innerHTML ='Highest Rating<span class="caret"></span>';
     
     if(current ==='google'){
         renderReviews(googlereviews,0,1);
     }
     if(current ==='yelp'){
         renderReviewsYelp(yelpreviews,0,1);
     }
 }

 function onlowrating(){
     
        document.getElementById('dd2').innerHTML ='Lowest Rating<span class="caret"></span>';
     if(current ==='google'){
         renderReviews(googlereviews,0,2);
     }
     if(current === 'yelp'){
         renderReviewsYelp(yelpreviews,0,2);
     }
 }

  
 function sortByKeyAsc(k) {
    return function(a, b) {
        var x = a[k]; var y = b[k];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
 }
 function sortByKeyDesc(k) {
    return function(a, b) {
        var x = a[k]; var y = b[k];
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    }
 }
 function renderReviews(reviews,recent,rating){      
if(reviews !== undefined ) {
    if(recent==0 && rating== 0){
        reviews = googlereviews_default;
    }
     if(recent==1){
        // alert(reviews.time);
           reviews.sort(sortByKeyDesc('time'));
     }
     
     if(recent ==2){
         reviews.sort(sortByKeyAsc('time'));
     }
     
     if(rating ==1){
      reviews.sort(sortByKeyDesc('rating'));
    }
     if(rating ==2){
           reviews.sort(sortByKeyAsc('rating'));   
     }
    
      console.log(reviews);  
    
        html ='<div class="container"><br><br>';
        //html+='<h2>google </h2>';
            
        for(var i = 0;  i< reviews.length; i++) {
            
        html+='<div class="well well-sm" style="background-color:none;">';
        html+='<div class="row">';
        html+='<div class="col-sm-1"><a target="_blank" href=" '+reviews[i].author_url+ ' "><img style="width : 50px;height:50px" ' +  'src="'+reviews[i].profile_photo_url+' "></a> </div>';
        html+='<div class="col-sm-11"><a target="_blank" href=" '+ reviews[i].author_url+' "> <b>'+reviews[i].author_name+'</b> </a>';
        rates2= reviews[i].rating ;
        html+='<span id="rateYo'+i+'"></span><p>'+rates2 +" "+ moment(reviews[i].time).format('YYYY-MM-DD HH:mm:ss') + '</p>';
        html+='<p>'+ reviews[i].text+'</p>';
        html+='</div></div></div>';
            
            
      //console.log(moment().unix(place.reviews[i].time).format("YYYY-MM-DD HH:mm:ss") );
                                    
        }
            
        document.getElementById('reviewshere').innerHTML=html;
            
        }
     
      else{
          document.getElementById('reviewshere').innerHTML= '<br><div class="alert alert-warning">No reviews found</div>';
      }
  }
 function renderReviewsYelp(reviews,recent,rating){      
if(reviews !== undefined ) {
            
       if(recent==0 && rating== 0){
        reviews = yelpreviews_default;
    }
     if(recent==1){
        // alert(reviews.time);
           reviews.sort(sortByKeyDesc('time_created'));
     }
     
     if(recent ==2){
         reviews.sort(sortByKeyAsc('time_created'));
     }
     
     if(rating ==1){
      reviews.sort(sortByKeyDesc('rating'));
    }
     if(rating ==2){
           reviews.sort(sortByKeyAsc('rating'));   
     }
    
            
        html ='<div class="container"><br><br>';
        //html+='<h2>yelp </h2>';
            
        for(var i = 0;  i< reviews.length; i++) {
            
        html+='<div class="well well-sm" style="background-color:none;">';
        html+='<div class="row">';
        html+='<div class="col-sm-1"><a target="_blank" href=" '+reviews[i].url+ ' "><img style="width : 50px;height:50px" ' +  'src="'+reviews[i].user.image_url+' "></a> </div>';
        html+='<div class="col-sm-11"><a target="_blank" href=" '+ reviews[i].url+' "> <b>'+reviews[i].user.name+'</b> </a>';
        rates2= reviews[i].rating ;
        html+='<span id="rateYo'+i+'"></span><p>'+ reviews[i].time_created + '</p>';
        html+='<p>'+ reviews[i].text+'</p>';
        html+='</div></div></div>';
        
      //console.log(moment().unix(place.reviews[i].time).format("YYYY-MM-DD HH:mm:ss") );
                                    
        }
            
        document.getElementById('reviewshere').innerHTML=html;
            
        }
     
                         else{
          document.getElementById('reviewshere').innerHTML= '<br><div class="alert alert-warning">No reviews found</div>';
            
            }
        

 }

function initMap() {
    
         
    document.getElementById('pegman').innerHTML ='<img src="http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png" style="width:25px;height: 25px">';
  
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var directionsService = new google.maps.DirectionsService;
        var map = new google.maps.Map(document.getElementById('maphere'), {
          zoom: 15,
          center: {lat: Number(latitude), lng: Number(longitude)}
        });
    
      //alert(latitude+" "+longitude+ " "+ latitude2 + " "+longitude2);
 
        directionsDisplay.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsDisplay,latitude,longitude,latitude2,longitude2);
        
    
    directionsDisplay.setPanel(document.getElementById('dirpanel'));
        
    
        document.getElementById('getdir').addEventListener('click', function() {
            
            var newloc = document.getElementById('fromloc').value;
            if(newloc==='' || newloc==='My location'){
                calculateAndDisplayRoute(directionsService, directionsDisplay,latitude,longitude,latitude2,longitude2);
            }
            else{
                    $.ajax({
                    url: 'http://myapp2018-env.us-east-2.elasticbeanstalk.com/coordinates',
                    type: 'GET',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    crossDomain:true,
                    async:false,
                    data: {addr:newloc},
                    success: function(data) {
                        console.log(data.results[0].geometry.location.lat + " " + data.results[0].geometry.location.lng);
                        
                    calculateAndDisplayRoute(directionsService, directionsDisplay,data.results[0].geometry.location.lat,data.results[0].geometry.location.lng,latitude2,longitude2);
                    }
                    
                    });

                
            } 
        });
    
       /*
     else{ 
         
          
    document.getElementById('pegman').innerHTML ='<img src="http://cs-server.usc.edu:45678/hw/hw8/images/Map.png" style="width:25px;height: 25px">';
  
         
         var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('maphere'), {
              position: fenway,
              pov: {
                heading: 34,
                pitch: 10
              }
            });
        map.setStreetView(panorama);
         }
    
      */
}


function calculateAndDisplayRoute(directionsService, directionsDisplay,lat1,lon1,lat2,lon2) {
        var selectedMode = document.getElementById('travelmode').value;
        directionsService.route({
          origin: {lat: Number(lat1), lng: Number(lon1)},  
          destination: {lat: Number(lat2), lng: Number(lon2)},
          travelMode: google.maps.TravelMode[selectedMode]
        }, function(response, status) {
          if (status == 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }

function initialize() {
  var input1 = document.getElementById('fromloc');
  new google.maps.places.Autocomplete(input1);
    

  var input2 = document.getElementById('locationtext');
  new google.maps.places.Autocomplete(input2);
    
 
}


google.maps.event.addDomListener(window, 'load', initialize);



