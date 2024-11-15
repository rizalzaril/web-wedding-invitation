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

const apiUrl = "https://backend-undangan-pernikahan-opang.vercel.app/tamu"; // Replace with your actual API endpoint

// Function to generate invitation URL
// function generateInvitationUrl(name) {
//   const formattedName = name.replace(/\s+/g, "+"); // Replace spaces with + and add &partner
//   return `https://web-wedding-invitation-umber.vercel.app/?to=${formattedName}`;
// }

function generateInvitationUrl(name) {
  const formattedName = name
    .trim() // Hapus spasi di awal dan akhir
    .replace(/\s+/g, "+") // Ganti spasi dengan "+"
    .replace(/[^a-zA-Z0-9\-_+]/g, "-"); // Ganti semua karakter spesial dengan "-"

  return `https://web-wedding-invitation-umber.vercel.app/?to=${formattedName}`;
}

// function generateInvitationUrl(name) {
//   const formattedName = name
//     .trim()
//     // .replace(/&/g, "&") // Ganti `&` dengan `and`
//     .replace(/\s+/g, "+")
//     .replace(/[^a-zA-Z0-9\-_+]/g, "");

//   return `https://web-wedding-invitation-umber.vercel.app/?to=${formattedName}`;
// }

// Handle form submission to create the invitation
document
  .getElementById("invitationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const guestName = document.getElementById("guestName").value;
    const invitationUrl = generateInvitationUrl(guestName);

    // Display the generated URL
    document.getElementById(
      "generatedUrl"
    ).textContent = `Generated URL: ${invitationUrl}`;

    // Save invitation data
    saveInvitationData();
  });

// Function to save invitation data
async function saveInvitationData() {
  const guestName = document.getElementById("guestName").value;
  const invitationUrl = generateInvitationUrl(guestName);

  // Prepare data to send
  const invitationData = {
    nama_tamu: guestName,
    timestamp: new Date().toISOString(),
    url: invitationUrl,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invitationData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Invitation Data Saved:", data);

      // Panggil fetchDataUndangan untuk memperbarui data di tabel
      fetchDataUndangan();

      // Show success message with SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Undangan Tersimpan!",
        text: "Data undangan berhasil disimpan!",
      });
    } else {
      console.error("Failed to save invitation data.");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal simpan data. Anda harus mengisi nama tamu terlebih dahulu!",
      });
    }
  } catch (error) {
    console.error("Error sending invitation data:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "There was an error sending the invitation data.",
    });
  }
}

//GET DATA UNDANGAN//
async function fetchDataUndangan() {
  try {
    const response = await fetch(
      "https://backend-undangan-pernikahan-opang.vercel.app/getTamu"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    console.log("Fetched data:", data);

    const tableBody = $("#tbUndangan tbody");
    tableBody.empty();

    if (data.length === 0) {
      tableBody.append(
        `<tr><td colspan="3" class="text-center">Tidak ada data undangan.</td></tr>`
      );
      return;
    }

    data.forEach((tamu) => {
      const date = new Date(tamu.timestamp);
      const formattedDate = date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const row = `<tr>
                      <td>${tamu.nama_tamu}</td>
                      <td>
                        ${tamu.url}
                        <button class="copy-btn btn btn-dark btn-sm" data-url="${tamu.url}">Copy <i class="fa-solid fa-copy"></i></button>
                      </td>
                      <td>${formattedDate}</td>
                   </tr>`;
      tableBody.append(row);
    });

    if ($.fn.DataTable.isDataTable("#tbUndangan")) {
      $("#tbUndangan").DataTable().destroy();
    }
    $("#tbUndangan").DataTable();

    $(".copy-btn").click(function () {
      const url = $(this).data("url");
      copyToClipboard(url);
    });
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
}

// Function to copy text to clipboard
function copyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
  alert("URL copied to clipboard!");
}

// Panggil fetchDataUndangan saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchDataUndangan);
