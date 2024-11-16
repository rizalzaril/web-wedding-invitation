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
      txtJamAkad.innerHTML = `<i class="fa-regular fa-clock"></i> ${jam}`;
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
