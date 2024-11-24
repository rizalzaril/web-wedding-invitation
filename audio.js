// Get references to the audio element and icon
const audio = document.querySelector("#song");
const audioIcon = document.querySelector("#audio-icon");

// Function to update the icon based on audio state
function updateIcon() {
  if (audio.paused) {
    audioIcon.classList.remove("fa-record-vinyl"); // Remove disc icon
    audioIcon.classList.add("fa-play"); // Add play icon
    audioIcon.style.animation = "none"; // Remove spinning animation
  } else {
    audioIcon.classList.remove("fa-play"); // Remove play icon
    audioIcon.classList.add("fa-record-vinyl"); // Add disc icon
    audioIcon.style.animation = "spin 2s linear infinite"; // Add spinning animation
  }
}

// Function to toggle audio between play and pause
function toggleAudio() {
  if (!audio.paused) {
    audio.pause(); // Pause the audio
  } else {
    audio.play(); // Play the audio
  }
  updateIcon(); // Update the icon after toggling audio
}

// Fetch the audio file URL from the API and set it as the source
fetch("https://backend-undangan-pernikahan-opang.vercel.app/getSound")
  .then((response) => response.json())
  .then((data) => {
    const audioUrl = data[0].fileUrl; // Access the first item in the array and get the fileUrl
    const audioSource = document.querySelector("#song source");
    audioSource.src = audioUrl; // Set the src of the <source> element
    audio.load(); // Reload the audio element to apply the new source
  })
  .catch((error) => {
    console.error("Error fetching audio URL:", error);
  });

// Attempt to start playing audio automatically on page load
window.addEventListener("DOMContentLoaded", () => {
  // Set the initial icon based on the audio state
  updateIcon();

  // Attempt to play audio (muted) to comply with autoplay policy
  audio.play().catch((error) => {
    console.warn("Autoplay was prevented, requiring user interaction.");
    // Set the icon to play if autoplay is blocked
    updateIcon();
  });

  // Unmute the audio after the user interacts with the page
  audio.addEventListener("click", () => {
    if (audio.muted) {
      audio.muted = false;
      audio.play();
    }
    updateIcon(); // Update the icon when audio is clicked and unmuted
  });
});
