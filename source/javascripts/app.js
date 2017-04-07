var placeID = 3391;

requestTideData(placeID);

$('select').change(function(){
  placeID = this.value;
  requestTideData(placeID);
  window.location.hash = placeID;
  console.log(liveURL);
});

if (window.location.hash.length) {
  var hash = window.location.hash.substring(1);
  requestTideData(hash);
}

var date = new Date();
var getYear = date.getFullYear().toString().substr(0,4);
var getMonth = ('0' + (date.getMonth() + 1)).slice(-2);
var getRawMonth = date.getMonth();
var monthName = new Array(12);
    monthName[0] = "January";
    monthName[1] = "February";
    monthName[2] = "March";
    monthName[3] = "April";
    monthName[4] = "May";
    monthName[5] = "June";
    monthName[6] = "July";
    monthName[7] = "August";
    monthName[8] = "September";
    monthName[9] = "October";
    monthName[10] = "November";
    monthName[11] = "December";

var getDate = ('0' + date.getDate()).slice(-2);
var getDay = date.getDay();
var weekDay = new Array(7);
    weekDay[0] = "Sunday";
    weekDay[1] = "Monday";
    weekDay[2] = "Tuesday";
    weekDay[3] = "Wednesday";
    weekDay[4] = "Thursday";
    weekDay[5] = "Friday";
    weekDay[6] = "Saturday";

var getMinutes = date.getMinutes();
var getHours = date.getHours();
var getCurrentMinutes = (60 * getHours) + getMinutes;

var dateToday = 'ymd'
  .replace('y', getYear)
  .replace('m', getMonth)
  .replace('d', getDate);

var readableDateToday = '@, # $ &'
  .replace('@', weekDay[getDay])
  .replace('#', monthName[getRawMonth])
  .replace('$', getDate)
  .replace('&', getYear);


function requestTideData(placeID) {

  var liveURL = "http://tidespy.com/api/tideturns?pn=" + placeID + "&unit=m&start=" + dateToday + "&days=1&key=nts0E6lKamjZPze2SIyUA89F4gfv5TuX";
  var testURL = "js/test.json";

  $.getJSON(liveURL, function(data) {
    $.each(data, function(key, value) {
      if (key == 'Name') {
        $('.tide-page h1').text(removeBrackets(value));
        $('.tide-page h2').text(readableDateToday);
      }
      if (key == 'Turns') {
        $.each(value, function(turnKeys, turnValues) {
          counter = 0;
          $.each(turnValues, function(turnKey, turnValue) {

            // Check if Low or High Tide
            if (turnKey == 'HorL') {
              tideType = 'High Tide';
              tideMovement = '(Falling)';
              if (turnValue == 'L') {
                tideType = 'Low Tide';
                tideMovement = '(Rising)';
              }
            }

            // Check what current tide is
            currentTide = true;
            counter++;
            if (turnKey == 'Minute') {
              if (getCurrentMinutes > turnValue) {
                $('.tide-page h3 span').text('at ' + timeConvert(turnValue));
              } else {
                currentTide = false;
              }
            }

            if (currentTide) {
              // Check current tide height
              if (turnKey == 'Height') {
                $('.tide-page h3').text(turnValue + 'm ' + tideType + ' ' + tideMovement);
              }
            } else {
              return false;
            }
          });
        });
      }
    });
  });
}

function timeConvert(n) {  
  var num = n;  
  var hours = (num / 60);  
  var rhours = Math.floor(hours);  
  var minutes = (hours - rhours) * 60; 
  var rminutes = Math.round(minutes);
  if (rminutes < 10) {
    rminutes = ('0' + rminutes).slice(-2);
  }

  var ampm = 'am';
  if (rhours > 12) {
    rhours = rhours - 12;
    ampm = 'pm';
  }

  return rhours + ':' + rminutes + ampm;  
}

function removeBrackets(input) {
  return input
    .replace(/{.*?}/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/<.*?>/g, "")
    .replace(/\(.*?\)/g, "");
}
