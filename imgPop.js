// Fetch images from the endpoint
fetch("https://backend-undangan-pernikahan-opang.vercel.app/getGallery")
  .then((response) => response.json()) // Parse the JSON data
  .then((data) => {
    const galleryContainer = document.getElementById("imgGallery");

    // Loop through the images and create image elements
    data.forEach((image) => {
      const imgElement = document.createElement("img");
      imgElement.src = image.imageUrl; // Assuming the API returns an object with a 'imageUrl' property for each image
      imgElement.alt = "Wedding Image";
      imgElement.classList.add(
        "img-thumbnail",
        "rounded-lg",
        "col",
        "mt-5",
        "p-1",
        "gallery-shadow-img"
      ); // Optional: To make the images responsive

      const colDiv = document.createElement("div");
      colDiv.classList.add("col"); // This ensures the images are responsive based on the grid

      colDiv.appendChild(imgElement);
      galleryContainer.appendChild(colDiv);
    });
  })
  .catch((error) => {
    console.error("Error fetching the gallery images:", error);
  });

// **************** GET CAROUSEL IMG ****************** \\

// Mengambil data dari endpoint API
document.addEventListener("DOMContentLoaded", () => {
  fetch("https://backend-undangan-pernikahan-opang.vercel.app/getCarousel")
    .then((response) => response.json())
    .then((data) => {
      // Cek apakah data berupa array dan memiliki elemen
      if (Array.isArray(data) && data.length > 0) {
        const imgUrl = data[0].imageUrl; // Ambil URL gambar dari elemen pertama
        if (imgUrl) {
          // Menampilkan gambar di atribut src
          document.getElementById("carousel").src = imgUrl;
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
