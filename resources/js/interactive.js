// Search on Enter
$('#rsvpName').keypress(function(e){
  if (e.which == 13) {
    if ($('#lookupRSVP')[0].style.display == "block") { findRSVP() };
  }
});

// On Enter Keypress
$('#guestName').keypress(function(e){
  if (e.which == 13) {
    //if ($('#submitRSVP')[0].style.display == "block") { updateDB() };
  }
});



function tabNewGuest() {
  $(".userInput").on('keydown', '#guestName', function(e) {
    var keyCode = e.keyCode || e.which;
    var inputCount = $('.guestField input').length;
    if (document.activeElement == $('.guestField input')[inputCount-1]) {
      if (keyCode == 9) {
        e.preventDefault();
        addGuestField();
        inputCount = $('.guestField input').length;
        $('.guestField input')[inputCount-1].focus();
      };
    };
  });
}


// if rsvpName is cleared
$('#rsvpName').change(function() {
  if (!$('#rsvpName')[0].value) {
    $('.error')[0].setAttribute('style', 'display: none');
    $('.guestInput')[0].setAttribute('style', 'display: none');
    $('#submitRSVP')[0].setAttribute('style', 'display: none');
    $('#lookupRSVP')[0].setAttribute('style', 'display: block');
    $('#rsvp-card .flex-container p')[0].innerHTML = 'Please enter your first and last name to look up your RSVP.';
  }
});

// Exit Prompt upon clicking X
function exitPrompt() {
  $('.success-container')[0].setAttribute('style', 'display: none');
  location.reload();
};

// search
$(document).ready(function(){
  $("#tableSearch").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#tableData tr.tableRow").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

function navToggle() {
  $('#mobile-nav-list').slideToggle();
  console.log('yes');
}

$('#submitNewRSVP').click(function() {
  if ($('#newName')[0].value && $('#newAllowedGuests')[0].value) {
    addEntry($('#newName')[0].value.toLowerCase(), $('#newAllowedGuests')[0].value, $('#newLinkedRSVP')[0].value.toLowerCase());
    alert('New entry added successfully!');
  };
  $('#newName')[0].value = '';
  $('#newAllowedGuests')[0].value  = '';
  $('#newLinkedRSVP')[0].value  = '';
});

function beginRemove() {
  var name = event.target.parentElement.parentElement.getElementsByClassName('rsvpName')[0].innerText;
  var linkedName = event.target.parentElement.parentElement.getElementsByClassName('linkedRSVP')[0].innerText;
  if (confirm('Are you sure you want to delete the RSVP for ' + name + '?')) {
    if (linkedName) {
      if (confirm(name + "'s linked RSVP is " + linkedName + ". Do you want to delete the RSVP for them, too?")) {
        removeEntry(linkedName.toLowerCase());
      }
    };
    removeEntry(name.toLowerCase());
  };

}
