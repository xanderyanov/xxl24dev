function siteResizeFunction() {
  prevWindowWidth = windowWidth;
  windowWidth = $window.width();

  if (prevWindowWidth <= 1080 && windowWidth > 1080) {
  }

  if (prevWindowWidth > 1080 && windowWidth <= 1080) {
  }
}

$(function () {
  $window.on('resize', siteResizeFunction);
});
