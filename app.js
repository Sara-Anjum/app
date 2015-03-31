var meetings;
var g;
$(document).ready(function () {
	// check is logged in 
	if (api.is_login) {
        $.mobile.changePage("#main", {transition: "slide", changeHash: false});
        refresh_list();
	};

	$('#btn-signin').click(function (evt) {
	    var data = {
	        email: $('#email-login').val(),
	        password: $('#password-login').val()
	    }
	    if (data.email !== '' && data.password !== '') {
	        $.mobile.loading('show', {
	                   text: 'Please Wait',
	                   textVisible: true,
	                   theme: 'b',
	                   html: ""
	               });
	        var result = api.login(data,
	                function () {
	                    $.mobile.changePage("#main", {transition: "slide", changeHash: false});
	                    $.mobile.loading('hide');
	                    refresh_list();
	                },
	                function () {
	                    alert('login failed');
	                    $.mobile.loading('hide');
	                });
	    }
	});

	$('#btn-signup').click(function() {
	    var data = {
	        fname : $('#fname-signup').val(),
	        lname : $('#lname-signup').val(),
	        email : $('#email-signup').val(),
	        password : $('#password-signup').val(),
	    };
	    if(data.password !== $('#password-confirm-signup').val()){
	    	alert('Password does not match!');
	    	return false;
	    }
	    var check = data.fname !== '' ? (data.lname!=='' ? (data.password!==''? true:false):false):false;
	    if(check){
	    	$.mobile.loading('show', {
	                   text: 'Please Wait',
	                   textVisible: true,
	                   theme: 'b',
	                   html: ""
	               });
	        console.log(data);
	        api.signup(data,
    	                function () {
    	                    $.mobile.changePage("#main", {transition: "slide", changeHash: false});
    	                    $.mobile.loading('hide');
    	                },
    	                function () {
    	                    alert('Signup failed');
    	                    $.mobile.loading('hide');
    	                });
	    }else{
	        alert('All fields are required');
	    }
	});
	
	$('#btn-create').click(function  () {
		var data = {
			name : $('#title-create').val(),
			description : $('#description-create').val(),
			venue : $('#venue-create').val(),
			complete:false
		}
		if(data.name=='' || data.description=='' || data.venue == ''){
			return false;
		}
		$.mobile.loading('show', {
	               text: 'Please Wait',
	               textVisible: true,
	               theme: 'b',
	               html: ""
	           });
		api.create_meeting(data,
			function  () {
				$.mobile.changePage("#list-meeting", {transition: "slide", changeHash: false});
				$.mobile.loading('hide');
				refresh_list();
			},
			function  () {
				$.mobile.loading('hide');
				alert('error');
			});
	});
});

function refresh_list () {
	$.mobile.loading('show', {
               text: 'Please Wait',
               textVisible: true,
               theme: 'b',
               html: ""
           });
	api.meeting_list(
		function  (list) {
			$.mobile.loading('hide');
			console.log(list);
			meetings = list;
			loadScript();
		}
	);
}

//maps
var mapScriptLoaded = 0; 
var divCounter = 0;
function mapInitialize() {
  for(i = 0; i< meetings.length;i++){
  	var t = document.createElement('h5');
  	t.className = "map-title";
  	t.appendChild(document.createTextNode(meetings[i].name));
  	var p = document.createElement('p');
  	p.className = "map-desctiption";
  	p.appendChild(document.createTextNode(meetings[i].description));
    var div = document.createElement('div');
    div.id = 'map-'+i;
    div.className = 'maps';
    document.getElementById('meeting-list').appendChild(t);
    document.getElementById('meeting-list').appendChild(p);
    document.getElementById('meeting-list').appendChild(div);
  	$.ajax({url: "http://maps.google.com/maps/api/geocode/json?address="+meetings[i].venue+"&sensor=false",
  	 	success: function(result){
  	 		var location = result.results[0].geometry.location;
  	        mapOptions = {
		        zoom: 8,
		        center: new google.maps.LatLng(location.lat, location.lng)
		    };
    		var map = new google.maps.Map(document.getElementById('map-'+divCounter),mapOptions);
    		divCounter++;
			var marker = new google.maps.Marker({
				position: mapOptions.center,
				map: map,
				title: meetings[divCounter].name,
				visible:true
			});
			marker.showInfoWindow();
  	    }
  	});
  }
}

function loadScript() {
  if(mapScriptLoaded){
    initialize();
    return;
  }
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
      '&signed_in=true&callback=mapInitialize';
  document.body.appendChild(script);
  mapScriptLoaded = 1;
}
