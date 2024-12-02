// // const rootElement = document.querySelector("body");
// // function disableScroll() {
// //   scrollTop = window.pageYOffset || document.documentElement.scrollTop;
// //   scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

// //   window.onscroll = function () {
// //     window.scrollTo(screenTop, scrollLeft);
// //   };

// //   rootElement.style.scrollBehavior = "unset";
// // }

// // function enableScroll() {
// //   window.onscroll = function () {
// //     rootElement.style.scrollBehavior = "smooth";
// //   };
// // }

// // disableScroll();
// const song = document.querySelector("#song");
// const audioIcon = document.querySelector("#audio-icon");
// const rootElement = document.querySelector("body");
// let scrollTop, scrollLeft;

// function disableScroll() {
//   // Simpan posisi scroll saat ini
//   scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//   scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

//   // Tambahkan properti CSS untuk mencegah scroll
//   rootElement.style.overflow = "hidden";
//   rootElement.style.position = "fixed";
//   rootElement.style.top = `-${scrollTop}px`;
//   rootElement.style.left = `-${scrollLeft}px`;
//   rootElement.style.width = "100%";
//   audioIcon.style.display = "none";
//   !playAudio();
// }

// function enableScroll() {
//   // Hapus properti CSS untuk mengembalikan scroll
//   rootElement.style.overflow = "";
//   rootElement.style.position = "";
//   rootElement.style.top = "";
//   rootElement.style.left = "";
//   rootElement.style.width = "";
//   audioIcon.style.display = "block";

//   // Kembalikan ke posisi scroll sebelumnya
//   window.scrollTo(scrollLeft, scrollTop);
//   playAudio();
// }

// async function playAudio() {
//   song.play();
// }

// // // Function to update the icon based on audio state

// function toggleAudio() {
//   if (!song.paused) {
//     song.pause();
//     audioIcon.classList.remove("fa-pause");
//     audioIcon.classList.add("fa-play"); // Change icon to play when paused
//     audioIcon.style.animation = "none"; // Remove spinning animation when paused
//   } else {
//     song.play();
//     audioIcon.classList.remove("fa-play");
//     audioIcon.classList.add("fa-pause"); // Change icon to pause when playing
//     audioIcon.style.animation = "spin 2s linear infinite"; // Add spinning animation when playing
//   }
// }

// disableScroll();
