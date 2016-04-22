Date.prototype.events = function() {
  return this.events;
}
var numberOfDaysInaWeek = 7;
var today = new Date();
var month = today.getMonth();
var todaysDate = today.getDate();
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var firstOfTheMonth = new Date(today.getFullYear(), today.getMonth(), 1);
var lastOfTheMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);

function Event(title, start, end, notes, allDay){
  this.title = title;
  this.start = start;
  this.end = end;
  this.notes = notes;
  this.allDay = allDay;
}

var monthEvents = [];

function changeMonth(direction){
  switch (direction)
  {
    case "back":
      month -= 1;
      break;
    case "forward":
      month += 1;
      break;
  }
  $("#calendarGrid td").each(function(i){
    $(this).text(" ");
  });
  firstOfTheMonth = new Date(today.getFullYear(), month, 1);
  lastOfTheMonth = new Date(today.getFullYear(), month+1, 0);
  drawCalendar();
  } 

function buildCalendarHeader(){
  var html="";
  var i;
  html +="<table id=\"calendarGrid\" class=\"table table-striped\">"
  //can't really iterate with how different the next row is
  html +="<tr class=\"month\">";
  html +="<th colspan=\"3\" id=\"backwards-month\" class=\"backwards-month\"><i class=\"fa fa-chevron-left\"></i></th>";
  html +="<th class=\"Month\">" + months[month] + "</th>";
  html +="<th colspan=\"3\" id=\"forwards-month\" class=\"forwards-month\"><i class=\"fa fa-chevron-right\"></i></th>";
  html +="</tr>";
  html +="<tr class=\"days-of-week\">";
  for (i = 0; i < weekDays.length; i++)
  {
    html += "<th>"+weekDays[i]+"</th>";
  }
  html +="</tr>";
  return html;
}

function writeCalendarDays(){
  var cellDiv;
  var i = 0;
  for (i = firstOfTheMonth.getDay(); i < (lastOfTheMonth.getDate() + firstOfTheMonth.getDay()); i++)
  {
    var dayOfMonth = 1+ (i - firstOfTheMonth.getDay())
    var classToAdd = months[month] + " " + dayOfMonth + " monthDay";
    var selector = "#cell"+i;
    $(selector).addClass( classToAdd);
    $(selector).html("<a href=#day id=\""+months[month]+dayOfMonth+"\" data-rel=\"popup\" data-position-to=\"window\"></a><span class=\"dayNumber\">" + dayOfMonth + "</span>");
  }
}

function genMonth(x,y){
  var html= buildCalendarHeader();
  var i;
  var j;
  var count = 0;
  for (i = 0; i < y; i++)
    {
      html +="<tr>";
      for (j = 0; j < x; j++)
      {
        html +="<td id=\"cell" + count + "\"></td>";
        count++;
      }
      html += "</tr>";
    }
    html += "</table>";
  $("#calendar").html(html);
  writeCalendarDays();
}

function placeEvents(){
  var i;
  var j;
  var cellDiv;
  var spans;
  for (i = firstOfTheMonth.getDay(); i < (lastOfTheMonth.getDate() + firstOfTheMonth.getDay()); i++)
  {
    cellDiv = document.getElementById("cell"+i);
    spans = cellDiv.getElementsByTagName('span');
    for (j = 0; j < monthEvents.length; j++){
      if (spans[0].innerHTML == monthEvents[j].eventDate)
      {
        cellDiv.innerHTML = cellDiv.innerHTML + "<span>" + monthEvents[j].eventName + "</span>";
      }
    }
  }
}

function addEvent(){
  var eventID = document.getElementById("eventID").value;
  var neweventDate = new Date(document.getElementById("eventDate").value);
  var newEvent = {eventName:eventID, eventDate: neweventDate.getDate()+1};
  monthEvents.push(newEvent);
  var i;
  var cellDiv;
  var spans;
  for (i = firstOfTheMonth.getDay(); i < (lastOfTheMonth.getDate() + firstOfTheMonth.getDay()); i++)
  {
    cellDiv = document.getElementById("cell"+i);
    spans = cellDiv.getElementsByTagName('span');
    if (spans[0].innerHTML == newEvent.eventDate)
    {
      cellDiv.innerHTML = cellDiv.innerHTML + "<span>" + newEvent.eventName + "</span>";
    }
  }
}

function addClickHandlers(){
  var calendarDiv = document.getElementById("calendar");
  var cells = calendarDiv.getElementsByTagName("td");
  var grids = calendarDiv.getElementsByTagName("table");
  var gridTable = grids[0];
  for (var i = 0; i< cells.length; i++)
  {
    cells[i].onclick = function(){
      var selected = gridTable.getElementsByClassName("selected");
      for (var j = 0; j < selected.length; j++){
        console.log(selected[j].innerHTML);
        selected[j].classList.remove('selected');
      }
      var col = this.cellIndex;
      var row = this.parentNode.rowIndex;
      var cell = gridTable.rows[row].cells[col];
      var dayNumber = cell.children[0];
      cell.className += " selected";
      cell.innerHTML += months[month] + " " + dayNumber.innerHTML;
    }
  }
}

function retrieveStorage(){
  document.getElementById("messages").innerHTML += localStorage.getItem("cs2550timestamp");
}

function clearStorage(){
  localStorage.clear();
  document.getElementById("messages").innerHTML = '<button id="clearStorage">Clear Local Storage</button>';
}

function loadEvents() {
  var events = xml.getElementsByTagName("event");
  var arr = [];
  for (var key in profiles){
      arr.push([]);
      var nodes = events[key].childNodes;
      for (var ele in nodes){
          if(nodes[ele]){
            arr[key].push(nodes[ele]);
          }
      }
  }
}

function retrieveEvents(){
  $.ajax({
    url: 'events.json',
    type: "GET",
    datatype:'json',
    success: function (doc){
      var events = [];
      if ( doc != undefined && doc.length > 0 ) {
        doc.forEach( function( monthEvents ) {
          if ( monthEvents == months[month]){
            monthEvents.forEach(function(entry){
              events.push( new Event(entry.title, entry.start, entry.end, entry.notes, entry.allDay));
            })
          };
        });
    }
    monthEvents = events;
    console.log(monthEvents);
    }
  })
};

function getEvents() {
    var request = new XMLHttpRequest();
    request.open("GET", "events.json");
    //request.setRequestHeader("Content-type", "application/json");
    request.send(null);
    var json = JSON.parse(request.responseText);
    console.log(json);}
    /*var events = xml.getElementsByTagName("events");
    var arr = [];
    for (var key = 0; key < events.length; key++){
      if (events[key] == months[month]){

        var newEvent = new Array();
        var nodes = events[key].children;
        for (var i = 0; i < nodes.length; i++){
          newEvent.push(nodes.item(i));
        }
        arr.push(newEvent);
      }
    }
    for (var i = 0; i < arr.length; i++) {
	     var myEvent = arr[i];
       var eventDay;
       var eventMonth;
       var eventYear;
       var eventTitle;
       for (var j = 0; j < myEvent.length; j++){
        var addThisEvent = true;
          switch (myEvent[j].nodeName){
            case "day":
                eventDay = myEvent[j].firstChild.data;
                break;
            case "month":
                eventMonth = myEvent[j].firstChild.data;
                break;
            case "year":
                eventYear = myEvent[j].firstChild.data;
                break;
            case "title":
                eventTitle = myEvent[j].firstChild.data;
                break;
            default:
                addThisEvent = false;
                break;
            }
      }
      if (addThisEvent){
        monthEvents.push({eventName: eventTitle, eventDate: new Date(eventYear, eventMonth, eventDay).getDate()})
      }
    }
}//*/
function drawCalendar(){
  var weeks = Math.ceil((firstOfTheMonth.getDay() + lastOfTheMonth.getDate()) / 7 );     
  genMonth(numberOfDaysInaWeek,weeks);
  //addClickHandlers();
  $(".fa-chevron-left").click(function(){changeMonth("back")});
  $(".fa-chevron-right").click(function(){changeMonth("forward")});
  
  getEvents();
  //placeEvents();
  retrieveEvents();

}

$(document).ready(function(){
  drawCalendar();
});
