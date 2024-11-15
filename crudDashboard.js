document.addEventListener("DOMContentLoaded", loadGallery);

document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Show loading indicator
    const loader = document.getElementById("loadingSpinner");
    loader.style.display = "block";
    loader.style.marginLeft = "30px";
    loader.style.marginTop = "8px";

    const formData = new FormData();
    formData.append("file", document.getElementById("imageUrl").files[0]);

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
        document.getElementById("uploadForm").reset();
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
      document.getElementById("loadingSpinner").style.display = "none";
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
    populateTableWithDataTables(data);
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    hideLoading();
  }
}

function populateTableWithDataTables(data) {
  const tableId = "#tbUndangan";

  // Check if DataTable instance exists and destroy it
  if ($.fn.DataTable.isDataTable(tableId)) {
    $(tableId).DataTable().clear().destroy();
  }

  // Populate the table body
  const tableBody = document.querySelector(`${tableId} tbody`);
  tableBody.innerHTML = data.length
    ? data
        .map(
          ({ nama_tamu, url, timestamp }) => `
      <tr>
        <td>${nama_tamu}</td>
        <td>
          <a href="${url}" target="_blank">${url}</a>
          <button class="copy-btn btn btn-sm btn-dark" data-url="${url}">
            Copy <i class="fa fa-copy"></i>
          </button>
        </td>
        <td>${new Date(timestamp).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</td>
      </tr>`
        )
        .join("")
    : `<tr><td colspan="3" class="text-center">No invitations yet.</td></tr>`;

  // Reinitialize DataTable
  $(tableId).DataTable();

  // Add copy functionality to buttons
  document
    .querySelectorAll(".copy-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () => copyToClipboard(btn.dataset.url))
    );
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    Swal.fire("Copied!", "URL successfully copied to clipboard.", "success");
  });
}

function showLoading() {
  document.getElementById("loadingSpinner").style.display = "block";
}

function hideLoading() {
  document.getElementById("loadingSpinner").style.display = "none";
}

document.addEventListener("DOMContentLoaded", fetchDataUndangan);

// DATA SORTIR ///////////////////////////

let currentData = []; // To store fetched data for sorting purposes

// Update the fetch function to save data locally
async function fetchDataUndangan() {
  showLoading();

  try {
    const response = await fetch(API_ENDPOINTS.getGuests);
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    currentData = data; // Store the data for sorting
    populateTableWithDataTables(data);
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    hideLoading();
  }
}

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
      const { id, tanggal, jam } = data[0];

      // Convert "tanggal" from "DD-MM-YYYY" to "YYYY-MM-DD"
      const [day, month, year] = tanggal.split("-");
      const formattedDate = `${year}-${month}-${day}`;

      // Convert time format from "HH.MM" to "HH:MM"
      const formattedTime = jam.replace(".", ":");

      const idInput = document.getElementById("idJadwalAkad");
      const dateInput = document.getElementById("tglJadwalAkad");
      const timeInput = document.getElementById("jamJadwalAkad");

      if (idInput && dateInput && timeInput) {
        idInput.value = id;
        dateInput.value = formattedDate;
        timeInput.value = formattedTime;
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

    // Prepare the data to send in the update request
    const updatedData = {
      id,
      tanggal,
      jam,
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
    // Check if the response is OK (status 200)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (data && data.length > 0) {
      // Extract data from the first item
      const { id, tanggal, jam } = data[0];

      // Convert "tanggal" from "DD-MM-YYYY" to "YYYY-MM-DD"
      const [day, month, year] = tanggal.split("-");
      const formattedDate = `${year}-${month}-${day}`;

      // Convert time format from "HH.MM" to "HH:MM"
      const formattedTime = jam.replace(".", ":");

      const idInput = document.getElementById("idJadwalResepsi");
      const dateInput = document.getElementById("tglJadwalResepsi");
      const timeInput = document.getElementById("jamJadwalResepsi");

      if (idInput && dateInput && timeInput) {
        idInput.value = id;
        dateInput.value = formattedDate;
        timeInput.value = formattedTime;
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

    // Prepare the data to send in the update request
    const updatedData = {
      id,
      tanggal,
      jam,
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
