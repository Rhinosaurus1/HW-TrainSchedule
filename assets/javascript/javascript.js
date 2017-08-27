$(document).ready(function(){

// initialize connection to firebase
  var config = {
    apiKey: "AIzaSyBQsZ2ooFmmIFdPGhJULfHqR2P9-3vltKI",
    authDomain: "trainscheduledb-5d596.firebaseapp.com",
    databaseURL: "https://trainscheduledb-5d596.firebaseio.com",
    projectId: "trainscheduledb-5d596",
    storageBucket: "",
    messagingSenderId: "770930331531"
  };

  firebase.initializeApp(config);

    var database = firebase.database();

  // add on click event to submit button
  $("#add-train").on("click", function(event) {
      event.preventDefault();

    // assign variables from user input fields
    var name = $("#name-input").val().trim();
    var dest = $("#dest-input").val().trim();
    var first = $("#first-input").val().trim();
    var freq = $("#freq-input").val().trim();

    // push new user inputs to database
    database.ref().push({
      name: name,
      dest: dest,
      first: first,
      freq: freq,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // alert user that new entry successful
    alert("New Train Successfully Added!");

});

  // populate page with data from database and upon addition of new child
  database.ref().on("child_added", function(snapshot) {

    var sv = snapshot.val();

    // use moment.js to calculate next arrival time and minutes away
    var minFormat = "HH:mm";
    var convertedFirst = moment(sv.first, minFormat);
    var minDif = moment().diff(convertedFirst,"minutes");
    var minMod = (minDif % sv.freq);
    var minAway = (sv.freq-minMod);
    var addNext = moment().add(minAway,"minutes");
    var next = moment(addNext).format("HH:mm");

    // create new table row and append values to row
    var newRow = $("<tr>");

    var newName = $("<td>");
    newName.html(sv.name);
    newRow.append(newName);

    var newDest = $("<td>");
    newDest.html(sv.dest);
    newRow.append(newDest);

    var newFirst = $("<td>");
    newFirst.html(sv.first);
    newRow.append(newFirst);

    var newFreq = $("<td>");
    newFreq.html(sv.freq);
    newRow.append(newFreq);

    var newNext = $("<td>");
    newNext.html(next);
    newRow.append(newNext);

    var newAway = $("<td>");
    newAway.html(minAway);
    newRow.append(newAway);

    // append new row to table
    $("#table-body").append(newRow);

    // clear user input fields
    $("#name-input").val("");
    $("#dest-input").val("");
    $("#first-input").val("");
    $("#freq-input").val("");

  }, 

  // error watcher
  function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

});