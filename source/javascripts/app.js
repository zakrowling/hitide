var getLocationId = 3374;
var tideSize = '40%'; // 3 metres is high, 0.5 metres is low

$('.header .menu').click(function(){
  $('.tide-page').toggleClass('inactive');
  $('.tide-menu').toggleClass('active');
});

$('.tide-menu li').click(function(){
  var getLocation = $(this).attr('class');
  var getLocationId = $(this).attr('data-location');

  $('body').removeClass().addClass(getLocation);
  $('.tide-page').removeClass('inactive');
  $('.tide-page h1').text('Loading...');
  $('.tide-menu').removeClass('active');
  $('html, body').animate({scrollTop : 0},500);
  requestTideData(getLocationId);
  window.location.hash = getLocationId;
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

  var liveURL = "http://hitide.me/ba-simple-proxy.php?url=http%3A%2F%2Ftidespy.com%2Fapi%2Ftideturns%3Fpn%3D" + placeID + "%26unit%3Dm%26start%3D" + dateToday + "%26days%3D2%26key%3Dnts0E6lKamjZPze2SIyUA89F4gfv5TuX&mode=native&full_headers=1&full_status=1";
  var testURL = "https://raw.githubusercontent.com/zakrowling/hitide/master/test.json";
  var devURL = "http://tidespy.com/api/tideturns?pn=" + placeID + "&unit=m&start=" + dateToday + "&days=2&key=nts0E6lKamjZPze2SIyUA89F4gfv5TuX";
  var nextTide = false;

  $.getJSON(devURL, function(data) {
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
              tideType = 'Rising Low Tide';
              tideMovement = 'High Tide From';
              $('.tide-page .arrow').addClass('up');
              if (turnValue == 'L') {
                tideType = 'Falling High Tide';
                tideMovement = 'Low Tide From';
                $('.tide-page .arrow').removeClass('up');
              }
              $('.tide-page h3 strong').text(tideType);
              $('.tide-page .arrow .next-tide').text(tideMovement);
            }

            // Chech which day it is
            currentTideDay = true;
            if (turnKey == 'Date') {
              if (turnValue != dateToday) {
                currentTideDay = false;
              } 
            }

            // Check what current tide is
            currentTide = true;
            counter++;
            if (turnKey == 'Minute') {
              if (getCurrentMinutes > turnValue) {
                $('.tide-page h3 span').text(' at ' + timeConvert(turnValue));
              } else {
                currentTide = false;
              }
            }

            if (currentTide) {
              // Check current tide height
              if (turnKey == 'Height') {
                $('.tide-page h3 em').text(turnValue + ' metres');
                if (turnValue.substring(0,1) == '-') { tideSize = '80%'; }
                if (turnValue.substring(0,1) == '0') { tideSize = '75%'; }
                if (turnValue.substring(0,1) == '1') { tideSize = '60%'; }
                if (turnValue.substring(0,1) == '2') { tideSize = '50%'; }
                if (turnValue.substring(0,1) >= '3') { tideSize = '40%'; }
                if (turnValue.substring(0,1) >= '4') { tideSize = '30%'; }
                if (turnValue.substring(0,1) >= '5') { tideSize = '20%'; }
                $('.tide-card .tide').css('top',tideSize);
              }
            } else {
              if ((turnKey == 'Minute') && (nextTide == false)) {
                $('.tide-page .arrow .next-tide-time').text(timeConvert(turnValue));
                nextTide = true;
              }

              if (currentTideDay) {
                return false;
              }
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
