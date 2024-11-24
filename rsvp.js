// Import the necessary Firebase functions

// Utility function to calculate relative time
function timeAgo(date) {
  const now = new Date();
  const secondsAgo = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(secondsAgo / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
}

// Function to save form data with validation
async function saveFormData(event) {
  event.preventDefault();
  const nama = document.getElementById("nama").value.trim();
  const status = document.getElementById("status").value.trim();
  const pesan = document.getElementById("pesan").value.trim();

  // Validation check for empty fields
  if (!nama || !status || !pesan) {
    Swal.fire({
      title: "Warning!",
      text: "Tolong isi semua data.",
      icon: "warning",
      confirmButtonText: "OK",
    });
    return;
  }

  try {
    const response = await fetch(
      "https://backend-undangan-pernikahan-opang.vercel.app/invitations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nama, status, pesan }),
      }
    );

    const result = await response.json();
    if (response.ok) {
      Swal.fire({
        title: "Success!",
        text: "Data berhasil terkirim.",
        icon: "success",
        confirmButtonText: "OK",
      });

      document.getElementById("nama").value = "";
      document.getElementById("status").value = "";
      document.getElementById("pesan").value = "";
      fetchData(); // Refresh carousel data
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error adding document: ", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to save data, please try again.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}

// Function to fetch and display data from the API in Owl Carousel
async function fetchData() {
  const dataCarousel = document.getElementById("dataCarousel");
  dataCarousel.innerHTML = ""; // Clear previous data

  try {
    // Make a GET request to fetch data from your API
    const response = await fetch(
      "https://backend-undangan-pernikahan-opang.vercel.app/invitations"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch invitations.");
    }

    const invitations = await response.json();

    // Check if the carousel is already initialized and destroy it
    if ($(".owl-carousel").data("owl.carousel")) {
      $(".owl-carousel").trigger("destroy.owl.carousel");
      $(".owl-carousel").html(""); // Clear existing Owl Carousel content
    }

    // Loop through each invitation and add it to the carousel
    invitations.forEach((invitation) => {
      const { nama, status, pesan, timestamp } = invitation;
      const timeAgoText = timeAgo(new Date(timestamp)); // Get relative time

      dataCarousel.innerHTML += ` 
      <div class="card p-3  text text-white" 
      style="background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)); backdrop-filter: blur(3px); ">
            <p><strong>${nama}</strong> 
              <span> 
                ${
                  status === "1"
                    ? '<i class="fa-solid fa-square-check text-success fa-xl"></i>'
                    : '<i class="fa-solid fa-square-xmark text-danger fa-xl"></i>'
                } 
              </span> 
            </p>
            <p> "${pesan}"</p>
            <p> ${timeAgoText}</p>
        </div>
      `;
    });

    // Reinitialize Owl Carousel after adding new content with navigation arrows
    $(".owl-carousel").owlCarousel({
      loop: false,
      margin: 30,
      dots: false,
      autoplay: false,
      autoplayTimeout: 2000,
      autoplayHoverPause: true,
      nav: true, // Enable navigation arrows
      navText: [
        "<span class='fa fa-chevron-left fa-xl'></span>", // Left arrow
        "<span class='fa fa-chevron-right fa-xl'></span>", // Right arrow
      ],
      responsive: {
        0: { items: 1 },
        600: { items: 1 },
        1000: { items: 1 },
      },
    });
  } catch (error) {
    console.error("Error fetching invitations: ", error);
  }
}

// Add event listener to the form
document.getElementById("formSubmit").addEventListener("submit", saveFormData);

// Fetch data when the page loads
fetchData();

// ***************************************** GET REKENING ****************************** \\

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
      const { namaRekening, nomorRekening, bankLogo } = data[0];

      const nama = document.querySelector(".bank-name");
      const nomor = document.querySelector(".bank-number");
      const logoElement = document.createElement("img");
      const logoBankContainer = document.getElementById("logoBankContainer");

      nama.textContent = namaRekening;
      nomor.textContent = nomorRekening;
      logoElement.src = bankLogo;
      logoElement.classList.add("bank-logo");

      const colDiv = document.createElement("div");
      colDiv.classList.add("col"); // This ensures the images are responsive based on the grid

      colDiv.appendChild(logoElement);
      logoBankContainer.appendChild(colDiv);
    } else {
      console.log("No map data available.");
      Swal.fire("Error!", "No map data found.", "error");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    Swal.fire(
      "Error!",
      `There was an issue fetching the data: ${error.message}`,
      "error"
    );
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
      const { namaRekening, nomorRekening, bankLogo } = data[0];

      const nama = document.querySelector(".bank-name-second");
      const nomor = document.querySelector(".bank-number-second");
      const logoBankContainer = document.getElementById(
        "logoBankContainerSecond"
      );
      const logoElement = document.createElement("img");

      // Update the text content of the elements
      nama.textContent = namaRekening;
      nomor.textContent = nomorRekening;
      logoElement.src = bankLogo;
      logoElement.classList.add("bank-logo");

      const colDiv = document.createElement("div");
      colDiv.classList.add("col"); // This ensures the images are responsive based on the grid

      colDiv.appendChild(logoElement);
      logoBankContainer.appendChild(colDiv);
    } else {
      console.log("No map data available.");
      Swal.fire("Error!", "No map data found.", "error");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    Swal.fire(
      "Error!",
      `There was an issue fetching the data: ${error.message}`,
      "error"
    );
  });
