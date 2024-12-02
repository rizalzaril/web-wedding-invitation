// const rootElement = document.querySelector("body");
// function disableScroll() {
//   scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//   scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

//   window.onscroll = function () {
//     window.scrollTo(screenTop, scrollLeft);
//   };

//   rootElement.style.scrollBehavior = "unset";
// }

// function enableScroll() {
//   window.onscroll = function () {
//     rootElement.style.scrollBehavior = "smooth";
//   };
// }

// disableScroll();

const rootElement = document.querySelector("body");
let scrollTop, scrollLeft;

function disableScroll() {
  // Simpan posisi scroll saat ini
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  // Tambahkan properti CSS untuk mencegah scroll
  rootElement.style.overflow = "hidden";
  rootElement.style.position = "fixed";
  rootElement.style.top = `-${scrollTop}px`;
  rootElement.style.left = `-${scrollLeft}px`;
  rootElement.style.width = "100%";
}

function enableScroll() {
  // Hapus properti CSS untuk mengembalikan scroll
  rootElement.style.overflow = "";
  rootElement.style.position = "";
  rootElement.style.top = "";
  rootElement.style.left = "";
  rootElement.style.width = "";

  // Kembalikan ke posisi scroll sebelumnya
  window.scrollTo(scrollLeft, scrollTop);
}

// Panggil disableScroll() untuk menguji
disableScroll();

// // Enable scroll setelah 5 detik untuk demo
// setTimeout(enableScroll, 5000);
