// ************************************ JADWAL AKAD FRONT END FUNCTION *********************************** \\

// ************************************ JADWAL AKAD FRONT END FUNCTION *********************************** \\
const apiUrl =
  "https://backend-undangan-pernikahan-opang.vercel.app/getJadwalAkad";

function getFormattedDate(dateString) {
  const date = new Date(dateString);
  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${month} ${year}`;
}

async function fetchJadwalAkad() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Gagal mengambil data dari API");
    }

    const data = await response.json();
    if (data && data.length > 0) {
      const { jam, tanggal } = data[0];
      const formattedDate = getFormattedDate(tanggal);
      const txtTglAkad = document.getElementById("tglAkad");
      const txtJamAkad = document.getElementById("jamAkad");
      txtTglAkad.innerHTML = `<i class="fa-solid fa-calendar-check"></i> ${formattedDate}`;
      txtJamAkad.innerHTML = `<i class="fa-regular fa-clock"></i> ${jam} - Selesai`;
    } else {
      document.getElementById("jadwal-akad").textContent =
        "Jadwal tidak ditemukan.";
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("jadwal-akad").textContent =
      "Terjadi kesalahan saat memuat jadwal.";
  }
}

fetchJadwalAkad();

// ************************************ JADWAL RESEPSI FRONT END FUNCTION *********************************** \\

const apiUrlResepsi =
  "https://backend-undangan-pernikahan-opang.vercel.app/getJadwalResepsi";

function getFormattedDate(dateString) {
  const date = new Date(dateString);
  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${month} ${year}`;
}

async function fetchJadwalResepsi() {
  try {
    const response = await fetch(apiUrlResepsi);
    if (!response.ok) {
      throw new Error("Gagal mengambil data dari API");
    }

    const data = await response.json();
    if (data && data.length > 0) {
      const { jam, tanggal, jamSelesai } = data[0];
      const formattedDate = getFormattedDate(tanggal);
      const txtTglResepsi = document.getElementById("tglResepsi");
      const txtJamResepsi = document.getElementById("jamResepsi");
      txtTglResepsi.innerHTML = `<i class="fa-solid fa-calendar-check"></i> ${formattedDate}`;
      txtJamResepsi.innerHTML = `<i class="fa-regular fa-clock"></i> ${jam} - ${jamSelesai}`;
    } else {
      document.getElementById("jadwal-akad").textContent =
        "Jadwal tidak ditemukan.";
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("jadwal-akad").textContent =
      "Terjadi kesalahan saat memuat jadwal.";
  }
}

fetchJadwalResepsi();

// *************** MAPS ************** //

// Fetch data from the API
fetch("https://backend-undangan-pernikahan-opang.vercel.app/getMaps")
  .then((response) => response.json())
  .then((data) => {
    const linksContainer = document.getElementById("maps-links");

    // Iterate over the data and create an anchor tag for each map URL
    data.forEach((item) => {
      // Create an anchor tag
      const linkElement = document.createElement("a");
      linkElement.href = item.url; // Set the URL to the href attribute
      linkElement.innerHTML = `<i class="fa-solid fa-location-dot"></i> Buka Maps `; // Set the text content
      linkElement.classList.add(
        "btn",
        "btn-dark",
        "mt-4",
        "btn-lg",
        "button-animate"
      );

      // Append the link to the container
      linksContainer.appendChild(linkElement);

      // Add a line break for better readability
      linksContainer.appendChild(document.createElement("br"));
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
