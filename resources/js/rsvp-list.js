firebase.database().ref().on('value', snap => {
  rsvpList = snap.val();
  // convert rsvp keys to array
  rsvpArray = Object.keys(rsvpList.rsvp);
  fillTable();
});

function fillTable() {

  $('.tableRow').remove();

  function capitalizeWords(str) {
   return str.replace(/\w\S*/g, function(txt) {
     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
     });
  }

  var rsvpName, allowedGuests, rsvpGuest, rsvpStatus, entry, linkedRSVP;
  var rsvpCount = 0;
  var guestCount = 0;
  var rsvpStatusCount = 0;
  var missingPercent = 0;
  var completePercent = 0;
  var timeStamp;


  for (i = 0; i < rsvpArray.length; i++) {
    var rsvpGuestCount = 0;
    var currentGuestsArray = Object.keys(rsvpList.rsvp[rsvpArray[i]].guests);

    rsvpName = rsvpArray[i];
    rsvpGuestCount += currentGuestsArray.length;
    guestCount += currentGuestsArray.length;
    rsvpStatus = rsvpList.rsvp[rsvpArray[i]].RSVP_status;
    allowedGuests = rsvpList.rsvp[rsvpArray[i]].allowed_guests;
    linkedRSVP = rsvpList.rsvp[rsvpArray[i]].linked_RSVP;
    if (rsvpStatus == "Yes" || rsvpStatus == "No") { rsvpStatusCount+= 1; completePercent += 1;};
    if (rsvpStatus == "") { missingPercent += 1;};

    var timeStamp = rsvpList.rsvp[rsvpName].lastUpdated;

    // gather guests for current rsvpName and print them
    var guestOptions = [];
    var guestOptions_print = "";

    var currentGuestsRef = rsvpList.rsvp[rsvpName.trim()].guests;
    var currentGuestsArray = Object.keys(currentGuestsRef);

    for (j = 0; j < currentGuestsArray.length; j++) {
      if (j == 0) { guestOptions_print = (j+1) + ": " + capitalizeWords(currentGuestsRef[currentGuestsArray[j]]); };
      if (j > 0) { guestOptions_print +=  '<br>' + (j+1) + ": " + capitalizeWords(currentGuestsRef[currentGuestsArray[j]]); };
    }

    entry = $('<tr class="tableRow"><td id="rsvpCount">' + (i+1) + '</td><td id="rsvpName">'
    + capitalizeWords(rsvpName) + '</td><td id="rsvpName">' + allowedGuests + '</td><td id="rsvpGuestCount">'
    + rsvpGuestCount + '</td><td id="rsvpGuest">' +
    guestOptions_print + '</td><td id="linkedRSVP">' + capitalizeWords(linkedRSVP) + '</td><td id="rsvpStatus">'
    + rsvpStatus + '</td>' + '<td id="timeStamp">' + timeStamp + '</td></tr>');

    if (i == rsvpArray.length-1) {
      var percentTotal = (completePercent + missingPercent);
      missingPercent = Math.round((missingPercent/percentTotal)*100);
      completePercent = Math.round((completePercent/percentTotal)*100);
      missingPercent = missingPercent.toString()+'%';
      completePercent = completePercent.toString()+'%';
      $('.complete')[0].setAttribute('style', 'width: ' + completePercent);
      $('.missing')[0].setAttribute('style', 'width: ' + missingPercent);
      if (missingPercent == "100%") { $('#missingPercent')[0].innerText = "0%" };
      if (missingPercent != "100%") { $('#missingPercent')[0].innerText = "" };

      $('#completePercent')[0].innerText = completePercent;

      $('#currentRSVP')[0].innerText = rsvpStatusCount;
      $('#currentInvites')[0].innerText = rsvpArray.length;
      $('#pendingRSVP')[0].innerText = rsvpArray.length - rsvpStatusCount;
      $('#guestCount')[0].innerText = guestCount;
      $('#currentRSVP2')[0].innerText = rsvpStatusCount;
      $('#allGuests')[0].innerText = rsvpStatusCount + guestCount;
    }

    $('#tableData tbody').append(entry);
  }
}
