const rootElement = document.querySelector("body");
function disableScroll() {
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  window.onscroll = function () {
    window.scrollTo(screenTop, scrollLeft);
  };

  rootElement.style.scrollBehavior = "unset";
}

function enableScroll() {
  window.onscroll = function () {
    rootElement.style.scrollBehavior = "smooth";
  };
}

disableScroll();
