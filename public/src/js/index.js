var database = firebase.database();

firebase.auth().onAuthStateChanged(function(user) {
  if(user) {
    navigator.geolocation.getCurrentPosition(position => {
      firebase.database().ref('users/' + user.displayName).set({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      }, error => {
        alert(error);
      }, {
        timeout: 10000,
        maximumAge: 20000,
        enableHighAccuracy: true
    });
  }
});

if("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
    navigator.serviceWorker.getRegistration()
}

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.076668, lng: 15.421371},
    zoom: 12
  });

  var infowindow =	new google.maps.InfoWindow();
  
  var starCountRef = firebase.database().ref('users/');
  starCountRef.on('value', (snapshot) => {

    for(let [key, value] of Object.entries(snapshot.val())) {
      var marker = new google.maps.Marker({
        position:	new google.maps.LatLng(value.latitude, value.longitude),
        map: map,
        animation: google.maps.Animation.DROP
      });

      google.maps.event.addListener(marker, 'click', (function(marker, key) {
        return function() {
          infowindow.setContent('<h3>' + key + '</h3>');
          infowindow.open(map, marker);
        }
      })(marker, key));
    }
  });
}