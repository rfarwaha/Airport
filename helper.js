// Global variables so I have access to them 
    var air1;
    var air2;
    var key;
    var a1Lat;
    var a1Long;
    var a2Lat;
    var a2Long;

    // This function computes the distance 
    function showResults() {
      air1 = $("#tags").val();
      air2 = $("#tags2").val();
      // validation check # 1
      if (air1 === "" || air2 === "") {
        $('#distance').html("Both fields are required.");
      }
      key = "2591c6409577b08c190875fd9dd66f2f";
      $.ajax({
        type: 'GET',
        url: "https://airport.api.aero/airport/distance/" + air1 + "/" + air2 + "?user_key=" + key,
        dataType: "jsonp",
        success: function(parsed_json) {
          var distance = parsed_json['distance'];
          // validation dheck # 2 - in case we do not get a response...meaning the airport is not supported by the API I am using 
          if (distance === null) {
            $('#distance').html("One of the airports is not supported by our API. Please try again.");
          }
          getA1cord(air1, air2, key);
        }
      });
    }

    // This function gets coordinates for aiport 1
    function getA1cord(air1, air2, key) {
      $.ajax({
        type: 'GET',
        url: "https://airport.api.aero/airport/" + air1 + "?user_key=" + key,
        dataType: "jsonp",
        success: function(parsed_json) {
          a1Lat = parsed_json.airports[0].lat;
          a1Long = parsed_json.airports[0].lng;
          getA2cord(air2, key, a1Lat, a1Long);
        }
      });
    }

    // This function gets coordinates for aiport 2 
    function getA2cord(airport2, key, airportOneLat, airportOneLong) {
      $.ajax({
        type: 'GET',
        url: "https://airport.api.aero/airport/" + air2 + "?user_key=" + key,
        dataType: "jsonp",
        success: function(parsed_json) {
          a2Lat = parsed_json.airports[0].lat;
          a2Long = parsed_json.airports[0].lng;
          initMap();
        }
      });
    }

    // This function is responsible for plotting trip on Google Maps 
    function initMap() {
      var myLatLng = new google.maps.LatLng((a1Lat + a2Lat) / 2, (a1Long + a2Long) / 2);
      var mapOptions = {
        center: myLatLng,
        zoom: 4
      };
      var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
      var flightPlanCoordinates = [
        new google.maps.LatLng(a1Lat, a1Long),
        new google.maps.LatLng(a2Lat, a2Long)
      ];
      var flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });

      flightPath.setMap(map);

      fourSquare(a2Lat, a2Long);

    }


    function fourSquare(a2latSquare, a2LongSquare) {
       $.ajax({
        type: 'GET',
        url: "https://api.foursquare.com/v2/venues/explore?ll=" + a2latSquare + "," + a2LongSquare + "&oauth_token=TDMNHEVSZRO0GJGBITHEO0C1RT0TWYCBLZXNOGD0QKELXJTY&v=20170327",
        dataType: "jsonp",
        success: function(parsed_json) {
          var length = parsed_json.response.groups[0].items.length;
          var currPlace;
          for (var i=0; i<length; i++)
          {
            currPlace = parsed_json.response.groups[0].items[i].venue.name
            $("#header ul").append('<li>' + currPlace + '</li>');
          }  
        }
      });
       $("#header ul").empty()
    }