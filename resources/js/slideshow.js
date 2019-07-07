  var slideIndexb = 0;
  showSlidesb();

  function showSlidesb() {
    var i;
    var slides_b = document.getElementsByClassName("mySlides_b");
    for (i = 0; i < slides_b.length; i++) {
      slides_b[i].style.display = "none";
    }
    slideIndexb++;
    if (slideIndexb > slides_b.length) {slideIndexb = 1}
    slides_b[slideIndexb-1].style.display = "block";
    setTimeout(showSlidesb, 4000); // Change image every 2 seconds
  }

  var slideIndexa = 0;
  showSlidesa();

  function showSlidesa() {
    var i;
    var slides = document.getElementsByClassName("mySlides_a");
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slideIndexa++;
    if (slideIndexa > slides.length) {slideIndexa = 1}
    slides[slideIndexa-1].style.display = "block";
    setTimeout(showSlidesa, 4000); // Change image every 2 seconds
  }
