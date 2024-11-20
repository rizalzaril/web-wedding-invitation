// Mengambil data dari endpoint API
document.addEventListener("DOMContentLoaded", () => {
  fetch("https://backend-undangan-pernikahan-opang.vercel.app/getSampul")
    .then((response) => response.json())
    .then((data) => {
      // Cek apakah data berupa array dan memiliki elemen
      if (Array.isArray(data) && data.length > 0) {
        const imgUrl = data[0].imageUrl; // Ambil URL gambar dari elemen pertama
        if (imgUrl) {
          // Menampilkan gambar di atribut src
          document.getElementById("sampul").src = imgUrl;
        } else {
          console.error("URL gambar tidak ditemukan di data.");
        }
      } else {
        console.error("Data API tidak valid atau kosong.");
      }
    })
    .catch((error) => {
      console.error("Terjadi kesalahan saat mengambil data:", error);
    });

  // lazyLoadImages(".lazy-image", { threshold: 0.7 });
});
