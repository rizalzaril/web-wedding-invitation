// // document.addEventListener('DOMContentLoaded', functon()){

// // }
// // Get references to the audio element and icon
// const audio = document.querySelector("#song");
// const audioIcon = document.querySelector("#audio-icon");

// // Function to update the icon based on audio state

// function toggleAudio() {
//   if (!audio.paused) {
//     audio.pause();
//     audioIcon.classList.remove("fa-pause");
//     audioIcon.classList.add("fa-play"); // Change icon to play when paused
//     audioIcon.style.animation = "none"; // Remove spinning animation when paused
//   } else {
//     audio.play();
//     audioIcon.classList.remove("fa-play");
//     audioIcon.classList.add("fa-pause"); // Change icon to pause when playing
//     audioIcon.style.animation = "spin 2s linear infinite"; // Add spinning animation when playing
//   }
// }
// window.addEventListener("DOMContentLoaded", () => {
//   // Fetch the audio file URL from the API and set it as the source
//   fetch("https://backend-undangan-pernikahan-opang.vercel.app/getSound")
//     .then((response) => response.json())
//     .then((data) => {
//       const audioUrl = data[0].fileUrl; // Access the first item in the array and get the fileUrl
//       const audioSource = document.querySelector("#song source");
//       audioSource.src = audioUrl; // Set the src of the <source> element
//       audio.load(); // Reload the audio element to apply the new source
//     })
//     .catch((error) => {
//       console.error("Error fetching audio URL:", error);
//     });

//   // Attempt to start playing audio automatically on page load
//   // Set the initial icon based on the audio state
//   updateIcon();
//   // Attempt to play audio (muted) to comply with autoplay policy
//   audio.play().catch((error) => {
//     console.warn("Autoplay was prevented, requiring user interaction.");
//     // Change the icon to play if autoplay is blocked
//     audioIcon.classList.remove("fa-pause");
//     audioIcon.classList.add("fa-play");
//     audioIcon.style.animation = "none"; // No animation on play icon
//   });

//   // Unmute the audio after the user interacts with the page
//   audio.addEventListener("click", () => {
//     if (audio.muted) {
//       audio.muted = false;
//       audio.play();
//       audioIcon.classList.remove("fa-play");
//       audioIcon.classList.add("fa-pause");
//       audioIcon.style.animation = "spin 2s linear infinite"; // Add spinning animation when playing
//     }
//   });

//   // Play audio automatically (muted) to comply with autoplay policy
//   audio.play().catch((error) => {
//     console.warn("Autoplay was prevented, requiring user interaction.");
//     // Set the icon to play if autoplay is blocked
//     updateIcon();
//   });

//   // Unmute the audio after the user interacts with the page
//   audio.addEventListener("click", () => {
//     if (audio.muted) {
//       audio.muted = false;
//       audio.play();
//     }
//     updateIcon(); // Update the icon when audio is clicked and unmuted
//   });
// });

const audio = document.querySelector("#song");
const audioIcon = document.querySelector("#audio-icon");

// Function to toggle audio play/pause and update icon
function toggleAudio() {
  if (audio.paused) {
    audio.play();
    updateIcon("playing");
  } else {
    audio.pause();
    updateIcon("paused");
  }
}

// Function to update icon and animation based on audio state
function updateIcon(state) {
  if (state === "playing") {
    audioIcon.classList.remove("fa-play");
    audioIcon.classList.add("fa-pause");
    audioIcon.style.animation = "spin 2s linear infinite";
  } else {
    audioIcon.classList.remove("fa-pause");
    audioIcon.classList.add("fa-play");
    audioIcon.style.animation = "none";
  }
}

// Load audio source dynamically from API
window.addEventListener("DOMContentLoaded", () => {
  fetch("https://backend-undangan-pernikahan-opang.vercel.app/getSound")
    .then((response) => response.json())
    .then((data) => {
      const audioUrl = data[0].fileUrl; // Set the first file URL as the source
      const audioSource = document.querySelector("#song source");
      audioSource.src = audioUrl;
      audio.load(); // Reload the audio element with new source

      // Attempt autoplay
      audio
        .play()
        .then(() => updateIcon("playing"))
        .catch(() => {
          // Autoplay blocked, wait for user interaction
          updateIcon("paused");
        });
    })
    .catch((error) => console.error("Error fetching audio URL:", error));
});
