var rsvpList;
var rsvpArray = [];
var RSVPStatus = "No";
var linkedRSVP = "";

// Snap values of DB in Realtime
firebase.database().ref().on('value', snap => {
  rsvpList = snap.val();
  rsvpArray = Object.keys(rsvpList.rsvp);
});


function getRSVPName() {
  return $('#rsvpName')[0].value.toLowerCase().trim();
}

// Display Error
function displayError(string) {
  let errorText = $('.error')[0].innerHTML = string;
  let errorDisplay = $('.error')[0].setAttribute('style', 'display: block');
}

// Remove Error
function removeError() {
  let errorDisplay = $('.error')[0].setAttribute('style', 'display: none');
}

// Capitalize Words
function capitalizeWords(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Get Time Stamp
function getTimeStamp() {
  var d = new Date;
  var timeStamp = "";
  var minutes = d.getMinutes();
  var month = (d.getMonth() + 1);
  var day = d.getDate();
  var year = d.getFullYear();
  if (minutes.toString().length == 1) {
    minutes = "0" + minutes;
  };
  var hours = d.getHours();
  if (hours > 12) {
    hours -= 12;
    timeStamp = month + "/" + day + "/" + year + " " + hours + ":" + minutes + " PM";
  }
  else if (hours == 0) {
    hours = 12;
    timeStamp = month + "/" + day + "/" + year + " " + hours + ":" + minutes + " AM";
  }
  else {
    timeStamp = month + "/" + day + "/" + year + " " + hours + ":" + minutes  + " AM";
  };
  return timeStamp;
}

function validateName(string) {
  return /^(?:\W*\w+\b){2,2}\W?$/.test(string);
}

function addMask(field) {
  IMask(field, {mask: /^(?:\W*\w+\b){0,2}\W?$/});
}

addMask($('#rsvpName')[0]);
//addMask($('#guestName')[0]);

function entry_rsvpStatus(rsvpStatus) {
  let rsvpEntry = {
      "RSVP_status": rsvpStatus
  }
  return rsvpEntry;
}
function entry_guests(guestObject) {
  let rsvpEntry = {
      "guests": guestObject
  }
  return rsvpEntry;
}
function entry_linkedRSVP(name) {
  let rsvpEntry = {
      "linked_RSVP": name
  }
  return rsvpEntry;
}
function entry_allowedGuests(number) {
  let rsvpEntry = {
      "allowed_guests": number
  }
  return rsvpEntry;
}

function writeSuccess() {
  $('body')[0].setAttribute('style', 'overflow: hidden');
  var guestOptions_print = "";
  if (linkedRSVP == 1) {
    $('#success-name')[0].innerText = capitalizeWords(getRSVPName());
    $('#success-name')[0].innerText += '\n'+capitalizeWords(getLinkedRSVP(getRSVPName()));
  };
  if (linkedRSVP != 1) {
    $('#success-name')[0].innerText = capitalizeWords(getRSVPName());
  }
  try {
    var currentGuestsRef = rsvpList.rsvp[getRSVPName()].guests;
    var currentGuestsArray = Object.keys(currentGuestsRef);
    for (j = 0; j < currentGuestsArray.length; j++) {
      if (j == 0) {
        guestOptions_print = capitalizeWords(currentGuestsRef[currentGuestsArray[j]]);
      };
      if (j > 0) {
        guestOptions_print += '<br>' + capitalizeWords(currentGuestsRef[currentGuestsArray[j]]);
      };
    };
    if (Object.keys(getGuestsFromFields()) == "") { $('#guestSection')[0].setAttribute('style', 'display: none'); }
    $('#success-guestName')[0].innerHTML = guestOptions_print;
  }
  catch {
    $('#guestSection')[0].setAttribute('style', 'display: none');
  }
  $('#success-response')[0].innerText = RSVPStatus;
  $('#todays-date')[0].innerText = getTimeStamp();
  $('.success-container')[0].setAttribute('style', 'display: flex');
}

function getLinkedRSVP(name) {
  return rsvpList["rsvp"][name]["linked_RSVP"];
}

function getAllowedGuests(name) {
  return rsvpList["rsvp"][name]["allowed_guests"];
}

function mergeData(name1, name2, object) {
  updateDB(name1, object);
  updateDB(name2, object);
}

function mergeLinkedRSVP(name1, name2) {
  updateDB(name1, entry_linkedRSVP(name2));
  updateDB(name2, entry_linkedRSVP(name1));
}

function findRSVP() {
  removeError();
  for (i in rsvpArray) {

    // if user input matches guestArray name
    if (rsvpArray[i] == getRSVPName()) {
      $("#rsvpName").prop('disabled', true);
      for (x in rsvpList.rsvp) {
        if(x && rsvpList.rsvp[x]["linked_RSVP"]) {
          mergeLinkedRSVP(x, rsvpList.rsvp[x]["linked_RSVP"]);
        }
      }
      // if searched RSVP HAS a linked RSVP
      if (getLinkedRSVP(getRSVPName()) != "") {
        $('#rsvp-card .flex-container p')[0].innerText = 'RSVP found!';
        try {
          mergeData(getRSVPName(), getLinkedRSVP(getRSVPName()), entry_allowedGuests(getAllowedGuests(getRSVPName())));
        }
        catch(e) {
          console.log(e);
        }

        displayError('Your RSVP is linked with <strong>' + capitalizeWords(getLinkedRSVP(getRSVPName())) + '</strong>. Would you like to RSVP for both?');

        $('#answer_yes').click(function(){
          RSVPStatus = "Yes";
          if (linkedRSVP === "") {
            linkedRSVP = 1;
            addGuests();
          };
          if (linkedRSVP === 0) {
            addGuests();
            removeError();
          };
          $('#answer_yes').off();
        });

        $('#answer_no').click(function(){
          if (linkedRSVP === 0) {
            updateDB(getRSVPName(), entry_rsvpStatus(RSVPStatus));
            updateDB(getRSVPName(), entry_guests(""));
            writeSuccess();
          };
          if (linkedRSVP === "") {
            displayError('Not a problem!<br>Your linked guest can still RSVP whenever they are ready.<br><br>Are you able to attend?');
            linkedRSVP = 0;
          };
        });
      }
      else {
        $('#rsvp-card .flex-container p')[0].innerHTML = 'RSVP found! Are you able to attend?';
        $('#answer_yes').click(function(){
          RSVPStatus = "Yes";
          addGuests();
          removeError();
          $('#answer_yes').off();
        });
        $('#answer_no').click(function(){
          RSVPStatus = "No";
          updateDB(getRSVPName(), entry_rsvpStatus(RSVPStatus))
          writeSuccess();
          $('#answer_no').off();
        });
        // $('#answer_yes').click(function(){ updateDB(getRSVPName(), entry_rsvpStatus("Yes")); writeSuccess(); });
      }
      $('#lookupRSVP')[0].setAttribute('style', 'display: none');
      $('#answers')[0].setAttribute('style', 'display: flex');
      break;
    };
  };
  // If RSVP Not Found
  if (rsvpArray[i] != getRSVPName()) {
    $('.error')[0].setAttribute('style', 'display: block');
    displayError('Could not find your RSVP. Please verify your first and last name were entered correctly.');
    return;
  };
};

function addGuests() {
  console.log(linkedRSVP);
  var allowedGuests = getAllowedGuests(getRSVPName());
  $('#answers')[0].setAttribute('style', 'display: none');
  if (linkedRSVP == 1) {
    displayError('You are submitting this RSVP for you and your linked RSVP, <strong>'+capitalizeWords(getLinkedRSVP(getRSVPName()))+'</strong>.');
  };
  if (allowedGuests > 0) {
    $('#rsvp-card .flex-container p')[0].innerText = 'Please enter any guests that will be joining you. If none, click Submit RSVP to complete. Click the + or press TAB to add more guests.';
    $('.guestInput')[0].setAttribute('style', 'display: block');
    $('#submitRSVP')[0].setAttribute('style', 'display: block');

    if (allowedGuests == 1) {
      $('#rsvp-card .flex-container p')[0].innerText += '\n\n';
      $('#rsvp-card .flex-container p')[0].innerHTML += '<strong>You may bring up to ' + allowedGuests + ' guest.</strong>'
      $('.addGuest')[0].setAttribute('style', 'display: none');
      $('#guestName')[0].setAttribute('style', 'width: 100%');
      $('#submitRSVP')[0].setAttribute('style', 'display: block');
    }
    else {
      tabNewGuest();
      $('#rsvp-card .flex-container p')[0].innerText += '\n\n';
      $('#rsvp-card .flex-container p')[0].innerHTML += '<strong>You may bring up to ' + allowedGuests + ' guests.</strong>'
    };
  };
  if (allowedGuests == 0) {
    if (linkedRSVP == 1) {
      updateDB(getRSVPName(), entry_rsvpStatus(RSVPStatus));
      updateDB(getLinkedRSVP(getRSVPName()), entry_rsvpStatus(RSVPStatus));
      writeSuccess();
    };
    updateDB(getRSVPName(), entry_rsvpStatus(RSVPStatus));
    writeSuccess();
  };
  $('#submitRSVP').click(function() {
    if (linkedRSVP == 1) {
      updateDB(getRSVPName(), entry_rsvpStatus(RSVPStatus));
      updateDB(getLinkedRSVP(getRSVPName()), entry_rsvpStatus(RSVPStatus));
      if (Object.keys(getGuestsFromFields()) != "") {
        setDB(getRSVPName(), getGuestsFromFields());
      }
      writeSuccess();
    };
    if (linkedRSVP != 1) {
      updateDB(getRSVPName(), entry_rsvpStatus(RSVPStatus));
      if (Object.keys(getGuestsFromFields()) != "") {
        setDB(getRSVPName(), getGuestsFromFields());
      }
      writeSuccess();
    };

  });
};

function getGuestsFromFields() {
  var guests = {};
  // Get all guests from fields
  for (i = 0; i < $('.guestField input').length; i++) {
    if ($('.guestField input')[i].value) {
      guests["guest " + (i + 1)] = $('.guestField input')[i].value.toLowerCase();
    }
  };
  return guests;
}

function addGuestField() {
  var allowedGuests = rsvpList["rsvp"][getRSVPName()]["allowed_guests"];
  if (allowedGuests != document.querySelectorAll('#guestName').length) {
    var addInput = $('<div class="guestField flex-container ai-center"><input type="text" id="guestName" value="" style="width: 80%"><button class="addGuest" type="button" name="guestButton" onclick="addGuestField()" style="width: 20%"><i class="fas fa-plus"></i></button></div>');
    $('.guestField button').remove();
    var inputCount = $('.guestField input').length;
    $('.guestField input')[inputCount - 1].style['width'] = "100%"
    $('.guestInput').append(addInput);
  };
  if (allowedGuests == document.querySelectorAll('#guestName').length) {
    $('.addGuest')[0].setAttribute('style', 'display: none');
    $('.guestField:last-child').children()[0].setAttribute('style', 'width: 100%');
  };
};

function updateDB(name, object) {
  var firebaseRef = firebase.database().ref();
  var fbGuestRef = firebaseRef.child("rsvp").child(name);
  fbGuestRef.update(object);
  fbGuestRef.update({"lastUpdated": getTimeStamp()});
};

function noGuestsDB(name, object) {
  var firebaseRef = firebase.database().ref();
  var fbChangeRef = firebaseRef.child("rsvp").child(name);
  fbChangeRef.set(object);
  fbChangeRef.update({"lastUpdated": getTimeStamp()});
}

function setDB(name, object) {
  var firebaseRef = firebase.database().ref();
  var fbGuestRef = firebaseRef.child("rsvp").child(name).child("guests");
  var fbChangeRef = firebaseRef.child("rsvp").child(name);
  fbGuestRef.set(object);
  fbChangeRef.update({"lastUpdated": getTimeStamp()});
}
