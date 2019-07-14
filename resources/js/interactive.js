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
    $("#searchable tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

// Detect if element in viewport
function isElementInViewport(el) {
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    var rect = el.getBoundingClientRect();
    return console.log(
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

function navToggle() {
  $('#mobile-nav-list').slideToggle();
  console.log('yes');
}
