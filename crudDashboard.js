document.addEventListener("DOMContentLoaded", loadGallery);

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit
const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("imageUrl");
const loader = document.getElementById("loadingSpinner");

uploadForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent the form from submitting

  // File size validation
  const file = fileInput.files[0];
  if (file && file.size > MAX_FILE_SIZE) {
    Swal.fire({
      icon: "error",
      title: "File Size Error",
      text: "File size exceeds the 50MB limit.",
      showConfirmButton: true,
    });
    return; // Stop further execution if file size exceeds limit
  }

  // Show loading indicator
  loader.style.display = "block";
  loader.style.marginLeft = "30px";
  loader.style.marginTop = "8px";

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(
      "https://backend-undangan-pernikahan-opang.vercel.app/uploadGallery",
      {
        method: "POST",
        body: formData,
      }
    );

    const contentType = response.headers.get("Content-Type");

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Unexpected response format: " + contentType);
    }

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: data.message,
        showConfirmButton: false,
        timer: 1500,
      });

      // Display the uploaded image in the gallery
      displayImageCard(data.imageUrl, data.id);

      // Reset the form
      uploadForm.reset();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message,
        showConfirmButton: true,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong. Please try again later.",
      showConfirmButton: true,
    });
  } finally {
    // Hide loading indicator after upload attempt finishes
    loader.style.display = "none";
  }
});

async function loadGallery() {
  try {
    const response = await fetch(
      "https://backend-undangan-pernikahan-opang.vercel.app/getGallery"
    );

    const data = await response.json();

    if (response.ok) {
      data.forEach((image) => {
        displayImageCard(image.imageUrl, image.id);
      });
    } else {
      console.error("Failed to load gallery images:", data.message);
    }
  } catch (error) {
    console.error("Error loading gallery images:", error);
  }
}

function displayImageCard(imageUrl, imageId) {
  const card = document.createElement("div");

  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = "Uploaded Image";
  image.classList.add(
    "img-thumbnail",
    "rounded-lg",
    "col",
    "mt-1",
    "p-1",
    "gallery-shadow-img"
  );

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("btn", "btn-danger", "mt-3", "absolute-top");
  deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteButton.addEventListener("click", () => {
    deleteImageCard(card, imageId);
  });

  card.appendChild(image);
  card.appendChild(deleteButton);

  document.getElementById("galleryContainer").appendChild(card);
}

async function deleteImageCard(card, imageId) {
  try {
    const response = await fetch(
      `https://backend-undangan-pernikahan-opang.vercel.app/deleteGallery/${imageId}`,
      { method: "DELETE" }
    );

    if (response.ok) {
      card.remove();
      Swal.fire({
        icon: "success",
        title: "Terhapus!",
        text: "Photo berhasil di hapus",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      const data = await response.json();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message || "Failed to delete image.",
        showConfirmButton: true,
      });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Server Bermasalah.",
      showConfirmButton: true,
    });
  }
}

// ************************************************ DATA CAROUSEL ***********************************************\\\\\

const MAX_FILE_SIZES = 5 * 1024 * 1024; // 5MB limit
const uploadFormCarousel = document.getElementById("uploadFormCarousel");
const fileInputCarousel = document.getElementById("imageUrlCarousel");
const loaderSpinner = document.getElementById("loadingSpinnerCarousel");
const galleryContainerCarousel = document.getElementById(
  "galleryContainerCarousel"
);

// Load existing images when the page loads
document.addEventListener("DOMContentLoaded", loadCarousel);

uploadFormCarousel.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent form submission

  const file = fileInputCarousel.files[0];
  if (!file || file.size > MAX_FILE_SIZES) {
    Swal.fire({
      icon: "error",
      title: "File Size Error",
      text: "File size exceeds the 5MB limit.",
      showConfirmButton: true,
    });
    return;
  }

  loaderSpinner.style.display = "block";

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(
      "https://backend-undangan-pernikahan-opang.vercel.app/uploadCarousel",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      Swal.fire({
        icon: "success",
        title: "Uploaded Successfully",
        text: data.message,
        showConfirmButton: false,
        timer: 1500,
      });

      // Add the uploaded image to the gallery
      displayImageCardCarousel(data.imageUrl, data.id);

      // Reset form
      uploadFormCarousel.reset();
    } else {
      const errorData = await response.json();
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: errorData.message || "An error occurred during upload.",
        showConfirmButton: true,
      });
    }
  } catch (error) {
    console.error("Error during upload:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong. Please try again.",
      showConfirmButton: true,
    });
  } finally {
    loaderSpinner.style.display = "none";
  }
});

async function loadCarousel() {
  try {
    const response = await fetch(
      "https://backend-undangan-pernikahan-opang.vercel.app/getCarousel"
    );

    if (response.ok) {
      const data = await response.json();
      galleryContainerCarousel.innerHTML = ""; // Clear existing gallery

      data.forEach((image) => {
        displayImageCardCarousel(image.imageUrl, image.id);
      });
    } else {
      const errorData = await response.json();
      console.error("Failed to load gallery:", errorData.message);
    }
  } catch (error) {
    console.error("Error loading carousel:", error);
  }
}

function displayImageCardCarousel(imageUrl, imageCarouselId) {
  const card = document.createElement("div");
  card.classList.add("col", "mb-3", "position-relative");

  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = "Uploaded Image";
  img.classList.add("img-thumbnail", "gallery-shadow-img");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "btn-danger", "mt-2");
  deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i> Delete';
  deleteButton.addEventListener("click", async () => {
    await deleteImageCarouselCard(card, imageCarouselId);
  });

  card.appendChild(img);
  card.appendChild(deleteButton);
  galleryContainerCarousel.appendChild(card);
}

async function deleteImageCarouselCard(card, imageCarouselId) {
  try {
    const response = await fetch(
      `https://backend-undangan-pernikahan-opang.vercel.app/deleteCarouselData/${imageCarouselId}`,
      { method: "DELETE" }
    );

    if (response.ok) {
      card.remove();
      Swal.fire({
        icon: "success",
        title: "Terhapus!",
        text: "Photo berhasil di hapus",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      const data = await response.json();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message || "Failed to delete image.",
        showConfirmButton: true,
      });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Server Bermasalah.",
      showConfirmButton: true,
    });
  }
}

// DATA UCAPAN ***********************************************************************************************\\\\\
$(document).ready(function () {
  fetchData();
});

async function fetchData() {
  try {
    const response = await fetch(
      "https://backend-undangan-pernikahan-opang.vercel.app/invitations"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    console.log("Fetched data:", data); // Log fetched data for verification

    const tableBody = $("#example tbody");
    tableBody.empty();

    if (data.length === 0) {
      console.warn("No data to display in table");
      return;
    }

    data.forEach((item) => {
      const date = new Date(item.timestamp);
      const formattedDate = date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const row = `<tr>
                      <td>${item.nama}</td>
                      <td>${
                        item.status === "1"
                          ? '<i class="fa-solid fa-square-check text-success fa-xl"></i>'
                          : '<i class="fa-solid fa-square-xmark text-danger fa-xl"></i>'
                      }</td>
                      <td>${item.pesan}</td>
                      <td>${formattedDate}</td>
                   </tr>`;
      tableBody.append(row);
    });

    // Destroy any existing DataTable instance, then initialize a new one
    if ($.fn.DataTable.isDataTable("#example")) {
      $("#example").DataTable().destroy();
    }

    $("#example").DataTable();
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
}

// DATA UNDANGAN TAMU /////////////////////////////////////////////////////////////////////////////

// API URL for storing the invitation data

const API_ENDPOINTS = {
  saveInvitation: "https://backend-undangan-pernikahan-opang.vercel.app/tamu",
  getGuests: "https://backend-undangan-pernikahan-opang.vercel.app/getTamu",
  deleteGuest:
    "https://backend-undangan-pernikahan-opang.vercel.app/deleteTamu",
};

function generateInvitationUrl(name) {
  const formattedName = name.trim().replace(/\s+/g, "+");
  return `https://web-wedding-invitation-umber.vercel.app/?to=${formattedName}`;
}

document
  .getElementById("invitationForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const guestName = document.getElementById("guestName").value;

    if (!guestName) {
      Swal.fire("Error", "Please enter a guest name.", "error");
      return;
    }

    try {
      await saveInvitationData(guestName);
    } catch (err) {
      console.error(err);
    }
  });

async function saveInvitationData(guestName) {
  const invitationUrl = generateInvitationUrl(guestName);
  const invitationData = {
    nama_tamu: guestName,
    timestamp: new Date().toISOString(),
    url: invitationUrl,
  };

  try {
    const response = await fetch(API_ENDPOINTS.saveInvitation, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invitationData),
    });

    if (!response.ok) throw new Error("Failed to save data.");

    await fetchDataUndangan();

    Swal.fire("Success", "Invitation saved successfully!", "success");
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Failed to save invitation. Try again later.", "error");
  }
}

async function fetchDataUndangan() {
  showLoading();

  try {
    const response = await fetch(API_ENDPOINTS.getGuests);
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    populateTableWithData(data);
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    hideLoading();
  }
}

function populateTableWithData(data) {
  const tableId = "#tbUndangan";

  if ($.fn.DataTable.isDataTable(tableId)) {
    $(tableId).DataTable().clear().destroy();
  }

  const tableBody = document.querySelector(`${tableId} tbody`);
  tableBody.innerHTML = data.length
    ? data
        .map(
          ({ id, nama_tamu, url, timestamp }) => `
<tr>
  <td>${nama_tamu}</td>
  <td>
    <a href="${url}" target="_blank" style="font-size:10px">${url}</a>
   
    <button class="share-btn btn btn-sm btn-info" data-name="${nama_tamu}" data-url="${url}">
      Share <i class="fa fa-share-alt"></i>
    </button>
  </td>
  
  <td>${new Date(timestamp).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}</td>
  <td>
    <button class="delete-btn btn btn-sm btn-danger" data-id="${id}">
      <i class="fa fa-trash"></i>
    </button>
  </td>
</tr>`
        )
        .join("")
    : `<tr><td colspan="3" class="text-center">No invitations yet.</td></tr>`;

  $(tableId).DataTable();

  // Event delegation for copy buttons
  document
    .querySelector(`${tableId} tbody`)
    .addEventListener("click", (event) => {
      if (event.target.closest(".copy-btn")) {
        copyToClipboard(event.target.closest(".copy-btn").dataset.url);
      }

      if (event.target.closest(".share-btn")) {
        const btn = event.target.closest(".share-btn");
        const guestName = btn.dataset.name;
        const invitationUrl = btn.dataset.url;

        updateOGTitleAndDescription(guestName);
        updateOGImage(invitationUrl);

        const shareMessage = generateShareMessage(guestName, invitationUrl);
        document.getElementById(
          "modalMessage"
        ).innerText = `Share this invitation to ${guestName}`;

        setupShareButtons(shareMessage, invitationUrl);
        new bootstrap.Modal(document.getElementById("shareModal")).show();
      }

      if (event.target.closest(".delete-btn")) {
        const guestId = event.target.closest(".delete-btn").dataset.id;
        deleteInvitation(guestId);
      }
    });

  // debounce function for share buttons to prevent overload
  function debounce(fn, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  }

  const debouncedShareHandler = debounce((guestName, invitationUrl) => {
    updateOGTitleAndDescription(guestName);
    updateOGImage(invitationUrl);

    const shareMessage = generateShareMessage(guestName, invitationUrl);
    document.getElementById(
      "modalMessage"
    ).innerText = `Share this invitation to ${guestName}`;

    setupShareButtons(shareMessage, invitationUrl);
    new bootstrap.Modal(document.getElementById("shareModal")).show();
  }, 300);

  // Attach the debounced share button handler
  document.querySelectorAll(".share-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const guestName = btn.dataset.name;
      const invitationUrl = btn.dataset.url;
      debouncedShareHandler(guestName, invitationUrl);
    });
  });
}

function generateShareMessage(guestName, invitationUrl) {
  return `Kepada Yth.\nBapak/Ibu/Saudara/i\n\n${guestName}\n\nAssalamu'alaikum Wr. Wb.\nBismillahirahmanirrahim.\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami.\n\nBerikut link untuk info lengkap dari acara kami:\n\n${invitationUrl}\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.\n\nWassalamu'alaikum Wr. Wb.\n\nTerima Kasih..\n\nHormat kami,\nNaufal & Anggi`;
}

function setupShareButtons(shareMessage, invitationUrl) {
  document.getElementById("whatsappShareBtn").onclick = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
      "_blank"
    );
  };

  document.getElementById("facebookShareBtn").onclick = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        invitationUrl
      )}&quote=${encodeURIComponent(shareMessage)}&picture=${
        document.getElementById("og-image").content
      }`,
      "_blank"
    );
  };

  document.getElementById("instagramShareBtn").onclick = () => {
    Swal.fire(
      "Instagram",
      "Sharing via Instagram is not directly supported.",
      "info"
    );
  };
}

async function deleteInvitation(guestId) {
  try {
    // Confirm the deletion with the user
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "This guest will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmation.isConfirmed) return; // If user cancels, do nothing.

    // Send delete request to API
    const response = await fetch(`${API_ENDPOINTS.deleteGuest}/${guestId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorMessage = await response.text(); // Capture error message from response
      throw new Error(errorMessage || "Failed to delete guest.");
    }

    // Re-fetch the guest list after deletion
    await fetchDataUndangan();

    // Success alert
    Swal.fire("Success", "Guest deleted successfully!", "success");
  } catch (error) {
    // Log the detailed error for debugging
    console.error("Delete error:", error);

    // Show user-friendly error message
    Swal.fire("Error", `Failed to delete guest. ${error.message}`, "error");
  }
}

function showLoading() {
  document.getElementById("loading").style.display = "block";
}

function hideLoading() {
  document.getElementById("loading").style.display = "none";
}

function copyToClipboard(url) {
  navigator.clipboard
    .writeText(url)
    .then(() =>
      Swal.fire("Copied!", "Invitation URL copied to clipboard.", "success")
    )
    .catch(() => Swal.fire("Error", "Failed to copy invitation URL.", "error"));
}

function updateOGTitleAndDescription(guestName) {
  const ogTitleMetaTag = document.querySelector('meta[property="og:title"]');
  const ogDescriptionMetaTag = document.querySelector(
    'meta[property="og:description"]'
  );

  if (ogTitleMetaTag) {
    ogTitleMetaTag.setAttribute("content", `The Wedding of ${guestName}`);
  }
  if (ogDescriptionMetaTag) {
    ogDescriptionMetaTag.setAttribute(
      "content",
      "Dengan memohon Rahmat dan Ridho Allah SWT, Kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pernikahan kami"
    );
  }
}

function updateOGImage(invitationUrl) {
  const ogImageMetaTag = document.getElementById("og-image");
  const twitterImageMetaTag = document.querySelector(
    'meta[name="twitter:image"]'
  );

  const dynamicImageUrl =
    "https://res.cloudinary.com/djgr3hq5k/image/upload/v1732463390/gd8fyaby9bvavvq5ecwv.jpg";

  if (ogImageMetaTag) {
    ogImageMetaTag.setAttribute("content", dynamicImageUrl);
  }
  if (twitterImageMetaTag) {
    twitterImageMetaTag.setAttribute("content", dynamicImageUrl);
  }

  const ogUrlMetaTag = document.querySelector('meta[property="og:url"]');
  if (ogUrlMetaTag) {
    ogUrlMetaTag.setAttribute("content", invitationUrl);
  }
}

// Initial Data Fetch
fetchDataUndangan();

// ***************************************** JADWAL AKAD SETTINGS ************************************ \\

// Fetch data from the API and populate the form
fetch("https://backend-undangan-pernikahan-opang.vercel.app/getJadwalAkad")
  .then((response) => {
    // Check if the response is OK (status 200)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (data && data.length > 0) {
      // Extract data from the first item
      const { id, tanggal, jam, alamat } = data[0];

      // Convert "tanggal" from "DD-MM-YYYY" to "YYYY-MM-DD"
      const [day, month, year] = tanggal.split("-");
      const formattedDate = `${year}-${month}-${day}`;

      // Convert time format from "HH.MM" to "HH:MM"
      const formattedTime = jam.replace(".", ":");

      const idInput = document.getElementById("idJadwalAkad");
      const dateInput = document.getElementById("tglJadwalAkad");
      const timeInput = document.getElementById("jamJadwalAkad");
      const alamatInput = document.getElementById("alamatJadwalAkad");

      if (idInput && dateInput && timeInput) {
        idInput.value = id;
        dateInput.value = formattedDate;
        timeInput.value = formattedTime;
        alamatInput.value = alamat;
      } else {
        console.warn("One or more form elements not found.");
      }
    } else {
      console.log("No jadwal data available.");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// Handle form submission to update data
document
  .getElementById("jadwalAkadForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const id = document.getElementById("idJadwalAkad").value;
    const tanggal = document.getElementById("tglJadwalAkad").value;
    const jam = document.getElementById("jamJadwalAkad").value;
    const alamat = document.getElementById("alamatJadwalAkad").value;

    // Prepare the data to send in the update request
    const updatedData = {
      id,
      tanggal,
      jam,
      alamat,
    };

    // Show SweetAlert2 confirmation before updating
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the Jadwal Akad?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Send a PUT request to update the data on the server
        fetch(
          `https://backend-undangan-pernikahan-opang.vercel.app/updateJadwalAkad/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("Update successful:", data);
            Swal.fire(
              "Updated!",
              "The Jadwal Akad has been updated successfully.",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error updating data:", error);
            Swal.fire(
              "Error!",
              "There was an error updating the Jadwal Akad.",
              "error"
            );
          });
      }
    });
  });

// Check if the browser supports input[type="time"]
function isTimeInputSupported() {
  const input = document.createElement("input");
  input.setAttribute("type", "time");
  return input.type === "time";
}

if (!isTimeInputSupported()) {
  // Fallback: Use a text input and custom validation for browsers that don't support time input
  const timeInput = document.getElementById("jamJadwalAkad");

  timeInput.setAttribute("type", "text");
  timeInput.setAttribute("placeholder", "HH:MM");
  timeInput.setAttribute("pattern", "^([01]?[0-9]|2[0-3]):([0-5][0-9])$");

  // Optional: Add custom validation on form submit
  document
    .getElementById("jadwalAkadForm")
    .addEventListener("submit", function (event) {
      const timeValue = timeInput.value;
      const timePattern = new RegExp(timeInput.getAttribute("pattern"));

      if (!timePattern.test(timeValue)) {
        event.preventDefault();
        alert("Please enter a valid time in HH:MM format.");
      }
    });
}

// ******************************************** JADWAL RESEPSI SETTING ************************************* \\

// Fetch data from the API and populate the form
fetch("https://backend-undangan-pernikahan-opang.vercel.app/getJadwalResepsi")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (data && data.length > 0) {
      const { id, tanggal, jam, jamSelesai, alamat } = data[0];

      // Convert "tanggal" from "DD-MM-YYYY" to "YYYY-MM-DD"
      const [day, month, year] = tanggal.split("-");
      const formattedDate = `${year}-${month}-${day}`;

      // Convert time format from "HH.MM" to "HH:MM"
      const formattedTime = jam.replace(".", ":");
      const formattedEndTime = jamSelesai.replace(".", ":");

      const idInput = document.getElementById("idJadwalResepsi");
      const dateInput = document.getElementById("tglJadwalResepsi");
      const timeInput = document.getElementById("jamJadwalResepsi");
      const timeEndInput = document.getElementById("jamJadwalSelesaiResepsi");
      const alamatResepsiInput = document.getElementById("alamatJadwalResepsi");

      if (idInput && dateInput && timeInput && timeEndInput) {
        idInput.value = id;
        dateInput.value = formattedDate;
        timeInput.value = formattedTime;
        timeEndInput.value = formattedEndTime;
        alamatResepsiInput.value = alamat;
      } else {
        console.warn("One or more form elements not found.");
      }
    } else {
      console.log("No jadwal data available.");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// Handle form submission to update data
document
  .getElementById("jadwalResepsiForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const id = document.getElementById("idJadwalResepsi").value;
    const tanggal = document.getElementById("tglJadwalResepsi").value;
    const jam = document.getElementById("jamJadwalResepsi").value;
    const alamat = document.getElementById("alamatJadwalResepsi").value;
    const jamSelesai = document.getElementById("jamJadwalSelesaiResepsi").value;

    // Prepare the data to send in the update request
    const updatedData = {
      id,
      tanggal,
      jam,
      jamSelesai,
      alamat,
    };

    // Show SweetAlert2 confirmation before updating
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the Jadwal Resepsi?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Send a PUT request to update the data on the server
        fetch(
          `https://backend-undangan-pernikahan-opang.vercel.app/updateJadwalResepsi/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("Update successful:", data);
            Swal.fire(
              "Updated!",
              "The Jadwal Resepsi has been updated successfully.",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error updating data:", error);
            Swal.fire(
              "Error!",
              "There was an error updating the Resepsi Akad.",
              "error"
            );
          });
      }
    });
  });

// Check if the browser supports input[type="time"]
function isTimeInputSupported() {
  const input = document.createElement("input");
  input.setAttribute("type", "time");
  return input.type === "time";
}

if (!isTimeInputSupported()) {
  // Fallback: Use a text input and custom validation for browsers that don't support time input
  const timeInput = document.getElementById("jamJadwalAkad");

  timeInput.setAttribute("type", "text");
  timeInput.setAttribute("placeholder", "HH:MM");
  timeInput.setAttribute("pattern", "^([01]?[0-9]|2[0-3]):([0-5][0-9])$");

  // Optional: Add custom validation on form submit
  document
    .getElementById("jadwalResepsiForm")
    .addEventListener("submit", function (event) {
      const timeValue = timeInput.value;
      const timePattern = new RegExp(timeInput.getAttribute("pattern"));

      if (!timePattern.test(timeValue)) {
        event.preventDefault();
        alert("Please enter a valid time in HH:MM format.");
      }
    });
}

// ********************* MAPS *********************** \\

// Fetch data from the API and populate the form
fetch("https://backend-undangan-pernikahan-opang.vercel.app/getMaps")
  .then((response) => {
    // Check if the response is OK (status 200)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      // Extract data from the first item
      const { url, id } = data[0];

      const lokasiInput = document.getElementById("lokasiResepsi");
      const idLokasi = document.getElementById("idLokasi");

      lokasiInput.value = url;
      idLokasi.value = id;
    } else {
      console.log("No map data available.");
      Swal.fire("Error!", "No map data found.", "error");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    Swal.fire("Error!", "There was an issue fetching the data.", "error");
  });

document
  .getElementById("formLokasi")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const id = document.getElementById("idLokasi").value;
    const url = document.getElementById("lokasiResepsi").value;

    // Basic validation to check if fields are filled
    if (!id || !url) {
      Swal.fire("Error!", "Please fill in all fields.", "error");
      return;
    }

    // Prepare the data to send in the update request
    const updatedMaps = {
      id,
      url,
    };

    // Show SweetAlert2 confirmation before updating
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the Maps Link?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        // Send a PUT request to update the data on the server
        const response = await fetch(
          `https://backend-undangan-pernikahan-opang.vercel.app/updateMaps/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedMaps),
          }
        );

        // Handle server response
        const data = await response.json();
        if (response.ok) {
          console.log("Update successful:", data);
          Swal.fire(
            "Updated!",
            "The Maps Link has been updated successfully.",
            "success"
          );
        } else {
          // If response is not OK, display error
          throw new Error(data.message || "Error updating data.");
        }
      } catch (error) {
        console.error("Error updating data:", error);
        Swal.fire(
          "Error!",
          "There was an error updating the Maps Link.",
          "error"
        );
      }
    }
  });

// **************** MAPS AKAD ******************* \\
fetch("https://backend-undangan-pernikahan-opang.vercel.app/getMapsAkad")
  .then((response) => {
    // Check if the response is OK (status 200)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      // Extract data from the first item
      const { url, id } = data[0];

      const lokasiInput = document.getElementById("lokasiAkad");
      const idLokasi = document.getElementById("idLokasiAkad");

      lokasiInput.value = url;
      idLokasi.value = id;
    } else {
      console.log("No map data available.");
      Swal.fire("Error!", "No map data found.", "error");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    Swal.fire("Error!", "There was an issue fetching the data.", "error");
  });

document
  .getElementById("formLokasiAkad")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const id = document.getElementById("idLokasiAkad").value;
    const url = document.getElementById("lokasiAkad").value;

    // Basic validation to check if fields are filled
    if (!id || !url) {
      Swal.fire("Error!", "Please fill in all fields.", "error");
      return;
    }

    // Prepare the data to send in the update request
    const updatedMaps = {
      id,
      url,
    };

    // Show SweetAlert2 confirmation before updating
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the Maps Link?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        // Send a PUT request to update the data on the server
        const response = await fetch(
          `https://backend-undangan-pernikahan-opang.vercel.app/updateMapsAkad/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedMaps),
          }
        );

        // Handle server response
        const data = await response.json();
        if (response.ok) {
          console.log("Update successful:", data);
          Swal.fire(
            "Updated!",
            "The Maps Link has been updated successfully.",
            "success"
          );
        } else {
          // If response is not OK, display error
          throw new Error(data.message || "Error updating data.");
        }
      } catch (error) {
        console.error("Error updating data:", error);
        Swal.fire(
          "Error!",
          "There was an error updating the Maps Link.",
          "error"
        );
      }
    }
  });

//*******************************/ Mempelai Pria ****************************\\

// Fetch data from the API and populate the form
// Fetch initial data (no changes here)
fetch("https://backend-undangan-pernikahan-opang.vercel.app/getMempelaiPria")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      const { imageUrl, id, caption, nama, linkInstagram } = data[0];

      const imgElement = document.getElementById("imagePreview");
      const namaMempelaiPria = document.getElementById("namaMempelaiPria");
      const linkInstagramMempelaiPria = document.getElementById(
        "linkInstagramMempelaiPria"
      );
      const idMempelaiPria = document.getElementById("idMempelaiPria");
      const captionMempelaiPria = document.getElementById(
        "captionMempelaiPria"
      );

      // Set initial image source
      imgElement.src = imageUrl;
      idMempelaiPria.value = id;
      linkInstagramMempelaiPria.value = linkInstagram;
      captionMempelaiPria.value = caption;
      namaMempelaiPria.value = nama;
    } else {
      console.log("No map data available.");
      Swal.fire("Error!", "No map data found.", "error");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    Swal.fire("Error!", "There was an issue fetching the data.", "error");
  });

// Handle file input change event to update image preview
document
  .getElementById("imageMempelaiPria")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      // Create a URL for the selected file and update the preview
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgElement = document.getElementById("imagePreview");
        imgElement.src = e.target.result; // Update the image preview with the selected file
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  });

// Form submission logic (with spinner display)
document
  .getElementById("mempelaiPriaForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const id = document.getElementById("idMempelaiPria").value;
    const caption = document.getElementById("captionMempelaiPria").value;
    const nama = document.getElementById("namaMempelaiPria").value;
    const linkInstagram = document.getElementById(
      "linkInstagramMempelaiPria"
    ).value;
    const imageInput = document.getElementById("imageMempelaiPria");

    // Basic validation
    if (!id || !caption || !nama || !linkInstagram) {
      Swal.fire("Error!", "Please fill in all fields.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("caption", caption);
    formData.append("nama", nama);
    formData.append("linkInstagram", linkInstagram);

    // If an image file is selected, append it to the formData
    const file = imageInput.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Error!", "File size must not exceed 5MB.", "error");
        return;
      }
      formData.append("file", file); // Add the image to formData if selected
    }

    // Show SweetAlert2 confirmation before updating
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      // Show the loading spinner
      document.getElementById("loadingSpinner").style.display = "flex";

      try {
        const response = await fetch(
          `https://backend-undangan-pernikahan-opang.vercel.app/updateMempelaiPria/${id}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
          const errorText = await response.text(); // Read the raw response text
          console.error("Server Error Response:", errorText);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Attempt to parse JSON if the response is okay
        const data = await response.json();

        // Display success message if the data was updated successfully
        Swal.fire("Updated!", "Data has been updated successfully.", "success");
      } catch (error) {
        console.error("Error updating data:", error);
        Swal.fire(
          "Error!",
          "There was an error updating the data. Check the console for details.",
          "error"
        );
      } finally {
        // Hide the loading spinner
        document.getElementById("loadingSpinner").style.display = "none";
      }
    }
  });

//*******************************/ Mempelai Wanita ****************************\\

// Fetch data from the API and populate the form
// Fetch initial data (no changes here)
fetch("https://backend-undangan-pernikahan-opang.vercel.app/getMempelaiWanita")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      const { imageUrl, id, caption, nama, linkInstagram } = data[0];

      const imgElement = document.getElementById("imagePreview2");
      const namaMempelaiWanita = document.getElementById("namaMempelaiWanita");
      const linkInstagramMempelaiWanita = document.getElementById(
        "linkInstagramMempelaiWanita"
      );
      const idMempelaiPria = document.getElementById("idMempelaiWanita");
      const captionMempelaiWanita = document.getElementById(
        "captionMempelaiWanita"
      );

      // Set initial image source
      imgElement.src = imageUrl;
      idMempelaiPria.value = id;
      captionMempelaiWanita.value = caption;
      linkInstagramMempelaiWanita.value = linkInstagram;
      namaMempelaiWanita.value = nama;
    } else {
      console.log("No map data available.");
      Swal.fire("Error!", "No map data found.", "error");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    Swal.fire("Error!", "There was an issue fetching the data.", "error");
  });

// Handle file input change event to update image preview
document
  .getElementById("imageMempelaiWanita")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      // Create a URL for the selected file and update the preview
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgElement = document.getElementById("imagePreview2");
        imgElement.src = e.target.result; // Update the image preview with the selected file
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  });

// Form submission logic (with spinner display)
document
  .getElementById("mempelaiWanitaForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const id = document.getElementById("idMempelaiWanita").value;
    const caption = document.getElementById("captionMempelaiWanita").value;
    const nama = document.getElementById("namaMempelaiWanita").value;
    const linkInstagram = document.getElementById(
      "linkInstagramMempelaiWanita"
    ).value;
    const imageInput = document.getElementById("imageMempelaiWanita");

    // Basic validation
    if (!id || !caption || !nama || !linkInstagram) {
      Swal.fire("Error!", "Please fill in all fields.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("caption", caption);
    formData.append("nama", nama);
    formData.append("linkInstagram", linkInstagram);

    // If an image file is selected, append it to the formData
    const file = imageInput.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Error!", "File size must not exceed 5MB.", "error");
        return;
      }
      formData.append("file", file); // Add the image to formData if selected
    }

    // Show SweetAlert2 confirmation before updating
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      // Show the loading spinner
      document.getElementById("loadingSpinner").style.display = "flex";

      try {
        const response = await fetch(
          `https://backend-undangan-pernikahan-opang.vercel.app/updateMempelaiWanita/${id}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
          const errorText = await response.text(); // Read the raw response text
          console.error("Server Error Response:", errorText);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Attempt to parse JSON if the response is okay
        const data = await response.json();

        // Display success message if the data was updated successfully
        Swal.fire("Updated!", "Data has been updated successfully.", "success");
      } catch (error) {
        console.error("Error updating data:", error);
        Swal.fire(
          "Error!",
          "There was an error updating the data. Check the console for details.",
          "error"
        );
      } finally {
        // Hide the loading spinner
        document.getElementById("loadingSpinner").style.display = "none";
      }
    }
  });

// **************************************** SAMPUL SETTING ******************************* \\

fetch("https://backend-undangan-pernikahan-opang.vercel.app/getSampul")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      const { imageUrl, id, caption, nama } = data[0];

      const imgElement = document.getElementById("imageSampulPreview");
      const idMempelaiPria = document.getElementById("idSampul");

      // Set initial image source
      imgElement.src = imageUrl;
      idMempelaiPria.value = id;
    } else {
      console.log("No Sampul data available.");
      Swal.fire("Error!", "No map data found.", "error");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    Swal.fire("Error!", "There was an issue fetching the data.", "error");
  });

// Handle file input change event to update image preview
document
  .getElementById("imageSampul")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      // Create a URL for the selected file and update the preview
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgElement = document.getElementById("imageSampulPreview");
        imgElement.src = e.target.result; // Update the image preview with the selected file
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  });

// Form submission logic (with spinner display)
document
  .getElementById("sampulForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const id = document.getElementById("idSampul").value;
    const imageInput = document.getElementById("imageSampul");

    // // Basic validation
    // if (!id || !caption || !nama) {
    //   Swal.fire("Error!", "Please fill in all fields.", "error");
    //   return;
    // }

    const formData = new FormData();
    formData.append("id", id);

    // If an image file is selected, append it to the formData
    const file = imageInput.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Error!", "File size must not exceed 5MB.", "error");
        return;
      }
      formData.append("file", file); // Add the image to formData if selected
    }

    // Show SweetAlert2 confirmation before updating
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      // Show the loading spinner
      document.getElementById("loadingSpinner").style.display = "flex";

      try {
        const response = await fetch(
          `https://backend-undangan-pernikahan-opang.vercel.app/updateSampul/${id}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
          const errorText = await response.text(); // Read the raw response text
          console.error("Server Error Response:", errorText);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Attempt to parse JSON if the response is okay
        const data = await response.json();

        // Display success message if the data was updated successfully
        Swal.fire("Updated!", "Data has been updated successfully.", "success");
      } catch (error) {
        console.error("Error updating data:", error);
        Swal.fire(
          "Error!",
          "There was an error updating the data. Check the console for details.",
          "error"
        );
      } finally {
        // Hide the loading spinner
        document.getElementById("loadingSpinner").style.display = "none";
      }
    }
  });

// **************************************** FIRST STORY  SETTING ******************************* \\

fetch("https://backend-undangan-pernikahan-opang.vercel.app/getFirstStory")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      const { imageUrl, id, caption } = data[0];

      const imgElement = document.getElementById("imagePreviewStoryPertama");
      const idStoryPertama = document.getElementById("idStoryPertama");
      const captionStoryPertama = document.getElementById(
        "captionStoryPertama"
      );

      // Set initial image source
      imgElement.src = imageUrl;
      idStoryPertama.value = id;
      captionStoryPertama.value = caption;
    } else {
      console.log("No Story Pertama data available.");
      Swal.fire("Error!", "No map data found.", "error");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    Swal.fire("Error!", "There was an issue fetching the data.", "error");
  });

// Handle file input change event to update image preview
document
  .getElementById("imageStoryPertama")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      // Create a URL for the selected file and update the preview
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgElement = document.getElementById("imagePreviewStoryPertama");
        imgElement.src = e.target.result; // Update the image preview with the selected file
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  });

// Form submission logic (with spinner display)
document
  .getElementById("storyPertamaForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const id = document.getElementById("idStoryPertama").value;
    const imageInput = document.getElementById("imageStoryPertama");
    const caption = document.getElementById("captionStoryPertama").value;

    // Basic validation
    if (!id || !caption) {
      Swal.fire("Error!", "Please fill in all fields.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("caption", caption);

    // Check if an image file is selected and validate its size
    const file = imageInput.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Error!", "File size must not exceed 5MB.", "error");
        return;
      }
      formData.append("file", file); // Add the image to formData if selected
    }

    // Show SweetAlert2 confirmation before updating
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      // Show the loading spinner
      document.getElementById("loadingSpinner").style.display = "flex";

      try {
        const response = await fetch(
          `https://backend-undangan-pernikahan-opang.vercel.app/updateFirstStory/${id}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
          const errorText = await response.text(); // Read the raw response text
          console.error("Server Error Response:", errorText);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Attempt to parse JSON if the response is okay
        const data = await response.json();

        // Display success message if the data was updated successfully
        Swal.fire("Updated!", "Data has been updated successfully.", "success");
      } catch (error) {
        console.error("Error updating data:", error);
        Swal.fire(
          "Error!",
          "There was an error updating the data. Check the console for details.",
          "error"
        );
      } finally {
        // Hide the loading spinner
        document.getElementById("loadingSpinner").style.display = "none";
      }
    }
  });

// **************************************** SECOND STORY  SETTING ******************************* \\

fetch("https://backend-undangan-pernikahan-opang.vercel.app/getSecondStory")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      const { imageUrl, id, caption } = data[0];

      const imgElement = document.getElementById("imagePreviewStoryKedua");
      const idStoryPertama = document.getElementById("idStoryKedua");
      const captionStoryPertama = document.getElementById("captionStoryKedua");

      // Set initial image source
      imgElement.src = imageUrl;
      idStoryPertama.value = id;
      captionStoryPertama.value = caption;
    } else {
      console.log("No Story Pertama data available.");
      Swal.fire("Error!", "No map data found.", "error");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    Swal.fire("Error!", "There was an issue fetching the data.", "error");
  });

// Handle file input change event to update image preview
document
  .getElementById("imageStoryKedua")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      // Create a URL for the selected file and update the preview
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgElement = document.getElementById("imagePreviewStoryKedua");
        imgElement.src = e.target.result; // Update the image preview with the selected file
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  });

// Form submission logic (with spinner display)
document
  .getElementById("storyKeduaForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const id = document.getElementById("idStoryKedua").value;
    const imageInput = document.getElementById("imageStoryKedua");
    const caption = document.getElementById("captionStoryKedua").value;

    // Basic validation
    if (!id || !caption) {
      Swal.fire("Error!", "Please fill in all fields.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("caption", caption);

    // Check if an image file is selected and validate its size
    const file = imageInput.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Error!", "File size must not exceed 5MB.", "error");
        return;
      }
      formData.append("file", file); // Add the image to formData if selected
    }

    // Show SweetAlert2 confirmation before updating
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      // Show the loading spinner
      document.getElementById("loadingSpinner").style.display = "flex";

      try {
        const response = await fetch(
          `https://backend-undangan-pernikahan-opang.vercel.app/updateSecondStory/${id}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
          const errorText = await response.text(); // Read the raw response text
          console.error("Server Error Response:", errorText);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Attempt to parse JSON if the response is okay
        const data = await response.json();

        // Display success message if the data was updated successfully
        Swal.fire("Updated!", "Data has been updated successfully.", "success");
      } catch (error) {
        console.error("Error updating data:", error);
        Swal.fire(
          "Error!",
          "There was an error updating the data. Check the console for details.",
          "error"
        );
      } finally {
        // Hide the loading spinner
        document.getElementById("loadingSpinner").style.display = "none";
      }
    }
  });

// **************************************** LAST STORY  SETTING ******************************* \\

fetch("https://backend-undangan-pernikahan-opang.vercel.app/getLastStory")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      const { imageUrl, id, caption } = data[0];

      const imgElement = document.getElementById("imagePreviewStoryLast");
      const idStoryPertama = document.getElementById("idStoryLast");
      const captionStoryPertama = document.getElementById("captionStoryLast");

      // Set initial image source
      imgElement.src = imageUrl;
      idStoryPertama.value = id;
      captionStoryPertama.value = caption;
    } else {
      console.log("No Story Pertama data available.");
      Swal.fire("Error!", "No map data found.", "error");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    Swal.fire("Error!", "There was an issue fetching the data.", "error");
  });

// Handle file input change event to update image preview
document
  .getElementById("imageStoryLast")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      // Create a URL for the selected file and update the preview
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgElement = document.getElementById("imagePreviewStoryLast");
        imgElement.src = e.target.result; // Update the image preview with the selected file
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  });

// Form submission logic (with spinner display)
document
  .getElementById("storyLastForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const id = document.getElementById("idStoryLast").value;
    const imageInput = document.getElementById("imageStoryLast");
    const caption = document.getElementById("captionStoryLast").value;

    // Basic validation
    if (!id || !caption) {
      Swal.fire("Error!", "Please fill in all fields.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("caption", caption);

    // Check if an image file is selected and validate its size
    const file = imageInput.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Error!", "File size must not exceed 5MB.", "error");
        return;
      }
      formData.append("file", file); // Add the image to formData if selected
    }

    // Show SweetAlert2 confirmation before updating
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      // Show the loading spinner
      document.getElementById("loadingSpinner").style.display = "flex";

      try {
        const response = await fetch(
          `https://backend-undangan-pernikahan-opang.vercel.app/updateLastStory/${id}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
          const errorText = await response.text(); // Read the raw response text
          console.error("Server Error Response:", errorText);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Attempt to parse JSON if the response is okay
        const data = await response.json();

        // Display success message if the data was updated successfully
        Swal.fire("Updated!", "Data has been updated successfully.", "success");
      } catch (error) {
        console.error("Error updating data:", error);
        Swal.fire(
          "Error!",
          "There was an error updating the data. Check the console for details.",
          "error"
        );
      } finally {
        // Hide the loading spinner
        document.getElementById("loadingSpinner").style.display = "none";
      }
    }
  });

// ********************************* REKENING SETTING ********************************* \\

// FIRST REKENING \\
fetch("https://backend-undangan-pernikahan-opang.vercel.app/getFirstRekening")
  .then((response) => {
    // Check if the response is OK (status 200)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      // Extract data from the first item
      const { id, namaRekening, nomorRekening, bankId } = data[0];

      // Get references to the elements
      const databank = document.getElementById("databank");
      const namaInput = document.getElementById("namaFirstRekening");
      const nomorInput = document.getElementById("nomorFirstRekening");
      const idRek = document.getElementById("idFirstRekening");

      // Set values for inputs
      namaInput.value = namaRekening;
      nomorInput.value = nomorRekening;
      idRek.value = id;

      // Assuming you have a list of banks to populate the select options dynamically
      fetch("https://backend-undangan-pernikahan-opang.vercel.app/getBank") // Replace this with the actual endpoint for fetching bank data
        .then((response) => response.json())
        .then((banks) => {
          if (Array.isArray(banks)) {
            // Loop through the list of banks and add them to the select element
            banks.forEach((bank) => {
              const option = document.createElement("option");
              option.value = bank.id; // VALUE NYA ADALAH ID DARI BANK
              option.textContent = bank.namaBank; // Display the bank name
              // alert(`test: ${bank.id} nama bank : ${bank.namaBank}`);
              databank.appendChild(option); // Add the option to the select
            });

            // Set the selected bankId
            databank.value = bankId;
          } else {
            console.error("No bank data available.");
            Swal.fire("Error!", "No bank data found.", "error");
          }
        })
        .catch((error) => {
          console.error("Error fetching bank data:", error);
          Swal.fire(
            "Error!",
            "There was an issue fetching the bank data.",
            "error"
          );
        });
    } else {
      console.log("No map data available.");
      Swal.fire("Error!", "No map data found.", "error");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    Swal.fire("Error!", "There was an issue fetching the data.", "error");
  });

document
  .getElementById("firstRekeningForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const namaRekening = document.getElementById("namaFirstRekening").value;
    const nomorRekening = document.getElementById("nomorFirstRekening").value;
    const id = document.getElementById("idFirstRekening").value;
    const bankId = document.getElementById("databank").value;

    // Basic validation to check if fields are filled
    if (!id || !namaRekening || !nomorRekening || !bankId) {
      Swal.fire("Error!", "Please fill in all fields.", "error");
      return;
    }

    // Prepare the data to send in the update request
    const updated = {
      id,
      namaRekening,
      nomorRekening,
      bankId,
    };

    // Show SweetAlert2 confirmation before updating
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the Maps Link?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        // Send a PUT request to update the data on the server
        const response = await fetch(
          `https://backend-undangan-pernikahan-opang.vercel.app/updateFirstRekening/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updated),
          }
        );

        // Handle server response
        const data = await response.json();
        if (response.ok) {
          console.log("Update successful:", data);
          Swal.fire(
            "Updated!",
            "Rekening  has been updated successfully.",
            "success"
          );
        } else {
          // If response is not OK, display error
          throw new Error(data.message || "Error updating data.");
        }
      } catch (error) {
        console.error("Error updating data:", error);
        Swal.fire(
          "Error!",
          "There was an error updating the Maps Link.",
          "error"
        );
      }
    }
  });

// SECOND REKENING \\
fetch("https://backend-undangan-pernikahan-opang.vercel.app/getSecondRekening")
  .then((response) => {
    // Check if the response is OK (status 200)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      // Extract data from the first item
      const { id, namaRekening, nomorRekening, bankId } = data[0];

      // Get references to the elements
      const databank = document.getElementById("databanksecond");
      const namaInput = document.getElementById("namaSecondRekening");
      const nomorInput = document.getElementById("nomorSecondRekening");
      const idRek = document.getElementById("idSecondRekening");

      // Set values for inputs
      namaInput.value = namaRekening;
      nomorInput.value = nomorRekening;
      idRek.value = id;

      // Assuming you have a list of banks to populate the select options dynamically
      fetch("https://backend-undangan-pernikahan-opang.vercel.app/getBank") // Replace this with the actual endpoint for fetching bank data
        .then((response) => response.json())
        .then((banks) => {
          if (Array.isArray(banks)) {
            // Loop through the list of banks and add them to the select element
            banks.forEach((bank) => {
              const option = document.createElement("option");
              option.value = bank.id; // VALUE NYA ADALAH ID DARI BANK
              option.textContent = bank.namaBank; // Display the bank name
              // alert(`test: ${bank.id} nama bank : ${bank.namaBank}`);
              databank.appendChild(option); // Add the option to the select
            });

            // Set the selected bankId
            databank.value = bankId;
          } else {
            console.error("No bank data available.");
            Swal.fire("Error!", "No bank data found.", "error");
          }
        })
        .catch((error) => {
          console.error("Error fetching bank data:", error);
          Swal.fire(
            "Error!",
            "There was an issue fetching the bank data.",
            "error"
          );
        });
    } else {
      console.log("No map data available.");
      Swal.fire("Error!", "No map data found.", "error");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    Swal.fire("Error!", "There was an issue fetching the data.", "error");
  });

document
  .getElementById("secondRekeningForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const namaRekening = document.getElementById("namaSecondRekening").value;
    const nomorRekening = document.getElementById("nomorSecondRekening").value;
    const id = document.getElementById("idSecondRekening").value;
    const bankId = document.getElementById("databanksecond").value;

    // Basic validation to check if fields are filled
    if (!id || !namaRekening || !nomorRekening || !bankId) {
      Swal.fire("Error!", "Please fill in all fields.", "error");
      return;
    }

    // Prepare the data to send in the update request
    const updated = {
      id,
      namaRekening,
      nomorRekening,
      bankId,
    };

    // Show SweetAlert2 confirmation before updating
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the Maps Link?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        // Send a PUT request to update the data on the server
        const response = await fetch(
          `https://backend-undangan-pernikahan-opang.vercel.app/updateSecondRekening/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updated),
          }
        );

        // Handle server response
        const data = await response.json();
        if (response.ok) {
          console.log("Update successful:", data);
          Swal.fire(
            "Updated!",
            "Rekening kedua has been updated successfully.",
            "success"
          );
        } else {
          // If response is not OK, display error
          throw new Error(data.message || "Error updating data.");
        }
      } catch (error) {
        console.error("Error updating data:", error);
        Swal.fire(
          "Error!",
          "There was an error updating the Maps Link.",
          "error"
        );
      }
    }
  });

// ************************************ SOUND ******************************* \\

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadSound");
  const soundContainer = document.getElementById("soundContainer");
  const idSoundInput = document.getElementById("idSound"); // The input field to display the sound ID
  const loadingSpinner = document.getElementById("loadingSpinner");

  // Fungsi untuk mengambil data backsound dari server
  async function fetchSoundData() {
    try {
      const response = await fetch(
        "https://backend-undangan-pernikahan-opang.vercel.app/getSound"
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data backsound.");
      }

      const soundData = await response.json();

      // Tampilkan data backsound
      soundContainer.innerHTML = soundData
        .map(
          (sound, index) => ` 
            <div class="sound-item">
              <p><a>${sound.fileUrl}</a></p>
              <audio id="audio-${index}" src="${sound.fileUrl}" preload="none"></audio>
              <button class="btn btn-primary play-button" data-index="${index}">
                Play
              </button>
            </div>
          `
        )
        .join("");

      // Set the ID of the first sound automatically in the input field
      if (soundData.length > 0) {
        idSoundInput.value = soundData[0].id; // Automatically set the first sound ID
      }

      // Tambahkan event listener ke tombol Play
      attachPlayButtonListeners();
    } catch (error) {
      console.error("Error:", error);
      soundContainer.innerHTML = "<p>Gagal memuat data backsound.</p>";
    }
  }

  // Fungsi untuk memperbarui backsound berdasarkan ID
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const soundFile = document.getElementById("soundUrl").files[0];

    // Validasi file (size dan type)
    if (!soundFile) {
      alert("Pilih file terlebih dahulu.");
      return;
    }

    const validTypes = ["audio/mpeg", "audio/wav"];
    if (!validTypes.includes(soundFile.type)) {
      alert("Hanya file dengan format MP3 atau WAV yang diperbolehkan.");
      return;
    }

    if (soundFile.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal adalah 5MB.");
      return;
    }

    // Ambil ID yang dipilih untuk update (dari input field)
    const soundId = idSoundInput.value;

    if (!soundId) {
      alert("Pilih file yang ingin diperbarui.");
      return;
    }

    // Siapkan data untuk dikirim
    const formData = new FormData();
    formData.append("soundUrl", soundFile);

    // Tampilkan loader
    if (loadingSpinner) loadingSpinner.style.display = "block";

    try {
      const response = await fetch(
        `https://backend-undangan-pernikahan-opang.vercel.app/updateSound/${soundId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Gagal memperbarui file.");
      }

      const result = await response.json();
      console.log(result); // Log the response to inspect for any issues

      // Sembunyikan loader
      if (loadingSpinner) loadingSpinner.style.display = "none";

      // Refresh daftar backsound
      fetchSoundData();

      alert("File berhasil diperbarui!");
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat memperbarui file.");
    } finally {
      // Sembunyikan loader
      if (loadingSpinner) loadingSpinner.style.display = "none";
    }
  });

  // Fungsi untuk menambahkan event listener ke tombol Play
  function attachPlayButtonListeners() {
    const playButtons = document.querySelectorAll(".play-button");

    playButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        const audioElement = document.getElementById(`audio-${index}`);

        // Stop all other audios
        document.querySelectorAll("audio").forEach((audio) => {
          if (audio !== audioElement) {
            audio.pause();
            audio.currentTime = 0; // Reset to start
          }
        });

        // Play or Pause the clicked audio
        if (audioElement.paused) {
          audioElement.play();
          button.textContent = "Pause";
        } else {
          audioElement.pause();
          button.textContent = "Play";
        }

        // Update button text based on playback state
        audioElement.addEventListener("ended", () => {
          button.textContent = "Play";
        });
      });
    });
  }

  // Panggil fetchSoundData saat halaman dimuat
  fetchSoundData();
});

// ***************************** GIFT BARANG FUNCTION ************************************* \\

$(document).ready(function () {
  fetchData();
});

async function deleteData(id) {
  try {
    // Send DELETE request to the server with the item's ID
    const response = await fetch(
      `https://backend-undangan-pernikahan-opang.vercel.app/deleteBarang/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete data");
    }

    // SweetAlert to confirm successful deletion
    Swal.fire({
      icon: "success",
      title: "Data deleted successfully!",
      text: "The item has been removed from the list.",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      // After successful deletion, refresh the page
      location.reload(); // This will refresh the page
    });
  } catch (error) {
    console.error("Error deleting data:", error);

    // SweetAlert for error handling
    Swal.fire({
      icon: "error",
      title: "Failed to delete data!",
      text: "There was an error while deleting the item.",
      confirmButtonText: "Try Again",
    });
  }
}

async function fetchData() {
  try {
    const response = await fetch(
      "https://backend-undangan-pernikahan-opang.vercel.app/getBarang"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    console.log("Fetched data:", data); // Log fetched data for verification

    const tableBody = $("#tbGiftBarang tbody");
    tableBody.empty();

    if (data.length === 0) {
      console.warn("No data to display in table");
      return;
    }

    data.forEach((item) => {
      const date = new Date(item.timestamp);
      const formattedDate = date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const row = `<tr id="${item._id}">
      <td style="font-size:12px">${item.namaBarang}</td>
      <td><img class="img-thumbnail" style="width:50px; height:50px" src="${item.imageUrl}" /></td>
      <td style="font-size:10px" class="shopee-link">${item.linkShopee} &nbsp;
      </td>
      <td>
        <a class="btn btn-danger btn-sm" href="${item.linkShopee}">Visit</a>
      </td>
      <td>
        <div class="d-flex gap-2">
          <button class="btn btn-danger" onclick="deleteData('${item.id}')"><i class="fa-solid fa-trash"></i></button>
          <!-- Edit button that navigates to a different page with the item's ID as a parameter -->
          <button class="btn btn-primary" onclick="window.location.href = './src/edit_barang.html?id=${item.id}'"><i class="fa-solid fa-edit"></i></button>
        </div>
      </td>
    </tr>`;

      tableBody.append(row);

      // Truncate Shopee Link after appending to the table
      document.querySelectorAll(".shopee-link").forEach((td) => {
        const linkText = td.childNodes[0].textContent.trim(); // Get the raw text
        if (linkText.length > 20) {
          td.childNodes[0].textContent = linkText.substring(0, 20) + "..."; // Truncate and append ellipsis
        }
      });
    });

    // Destroy any existing DataTable instance, then initialize a new one
    if ($.fn.DataTable.isDataTable("#tbGiftBarang")) {
      $("#tbGiftBarang").DataTable().destroy();
    }

    $("#tbGiftBarang").DataTable();
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
}

async function fetchBarangById(id) {
  try {
    const response = await fetch(
      `https://backend-undangan-pernikahan-opang.vercel.app/getBarang/${id}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

async function populateForm() {
  // Get ID from the query parameter in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (id) {
    const barang = await fetchBarangById(id);

    if (barang) {
      // Populate the form with data
      document.getElementById("namaBarangEdit").value = barang.nama;
      document.getElementById("linkShopeeEdit").value = barang.linkShopee;

      // Optional: Handle displaying the image (if needed)
      console.log("Fetched data:", barang);
    } else {
      console.error("Failed to load data for the given ID");
    }
  } else {
    console.error("No ID found in the URL");
  }
}

// Populate the form when the page loads
window.onload = populateForm;

// post data barang \\
// Function to post data
async function postData(formData) {
  try {
    // Tampilkan dialog konfirmasi sebelum mengirim data
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to add this item?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    // Jika pengguna memilih "No", hentikan eksekusi
    if (!confirmation.isConfirmed) {
      return Swal.fire({
        icon: "info",
        title: "Cancelled",
        text: "Item addition cancelled.",
      });
    }

    const response = await fetch(
      "https://backend-undangan-pernikahan-opang.vercel.app/postBarang",
      {
        method: "POST",
        body: formData, // Do not set Content-Type manually
      }
    );

    if (!response.ok) {
      throw new Error("Failed to post data");
    }

    const result = await response.json();
    console.log("Data successfully posted:", result);

    // Show success notification
    await Swal.fire({
      icon: "success",
      title: "Success",
      text: `Barang "${result.namaBarang}" has been successfully added!`,
    }).then(() => {
      // After successful deletion, refresh the page
      location.reload(); // This will refresh the page
    });

    // Append the new data to the table

    // Clear form for next input
    document.querySelector("#addbarangForm").reset();
  } catch (error) {}
}

// Event listener for form submission
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("#addbarangForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const fileInput = document.querySelector("#imageBarang");
      if (!fileInput || fileInput.files.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "No Image Selected",
          text: "Please select an image to upload.",
        });
        return;
      }

      const namaBarang = document.querySelector("#namaBarang").value;
      const linkShopee = document.querySelector("#linkShopee").value;

      if (!namaBarang || !linkShopee) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Form",
          text: "Please fill out all fields.",
        });
        return;
      }

      const formData = new FormData();
      formData.append("namaBarang", namaBarang);
      formData.append("linkShopee", linkShopee);
      formData.append("file", fileInput.files[0]); // File upload

      try {
        await postData(formData); // Post data and handle success
      } catch (error) {
        console.error("Error posting data:", error);
      }
    });
});

// ALAMAT BARANG \\

let selectedAlamatId = null; // Variable to store selected alamat ID

// Function to fetch data and populate the modal
async function fetchAlamatBarang() {
  try {
    const response = await fetch(
      "https://backend-undangan-pernikahan-opang.vercel.app/getAlamatBarang"
    );
    const data = await response.json();

    if (data.message === "AlamatBarang fetched successfully") {
      // Assuming the data has multiple records, and you want to populate the first one
      const alamatBarang = data.data[0]; // Change this if you need a specific entry

      // Store the ID of the selected alamat
      selectedAlamatId = alamatBarang.id;

      // Populate the modal fields
      document.getElementById("alamatKirim").value = alamatBarang.alamatBarang;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to update alamatBarang
async function updateAlamatBarang(event) {
  event.preventDefault(); // Prevent the form from submitting normally

  const alamatKirim = document.getElementById("alamatKirim").value;

  if (!alamatKirim) {
    alert("Alamat Lengkap is required.");
    return;
  }

  try {
    const response = await fetch(
      `https://backend-undangan-pernikahan-opang.vercel.app/updateAlamatBarang/${selectedAlamatId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alamatBarang: alamatKirim,
        }),
      }
    );

    const data = await response.json();

    if (data.message === "Rekening Kedua updated successfully") {
      alert("Alamat updated successfully.");
      // Optionally, close the modal after update
      $("#exampleModal2").modal("hide");
    } else {
      Swal.fire({
        icon: "success",
        title: "success update data!",
        text: "oke",
      });
    }
  } catch (error) {
    console.error("Error updating data:", error);
    alert("Failed to update data.");
  }
}

// Call fetchAlamatBarang when the modal is shown
const modal = document.getElementById("exampleModal2");
modal.addEventListener("show.bs.modal", fetchAlamatBarang);

// Add an event listener to handle the form submission
const form = document.getElementById("updateAlamatForm");
form.addEventListener("submit", updateAlamatBarang);
