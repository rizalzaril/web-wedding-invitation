// Fetch images from the endpoint
fetch("https://backend-undangan-pernikahan-opang.vercel.app/getMempelaiPria/")
  .then((response) => response.json()) // Parse the JSON data
  .then((data) => {
    const galleryContainer = document.getElementById("imgMempelaiPria");

    // Loop through the images and create image elements
    data.forEach((mempelaiPria) => {
      const imgElement = document.createElement("img");
      const nama = document.getElementById("namaMempelaiPria");
      const caption = document.getElementById("captionMempelaiPria");
      imgElement.src = mempelaiPria.imageUrl; // Assuming the API returns an object with a 'imageUrl' property for each image
      imgElement.alt = "Wedding Image";
      imgElement.classList.add(
        "img-thumbnail",
        "rounded-lg",
        "col",
        "ml-5",
        "img-mempelai",
        "gallery-shadow-img"
      ); // Optional: To make the images responsive

      nama.innerHTML = mempelaiPria.nama;
      caption.innerHTML = mempelaiPria.caption;

      const colDiv = document.createElement("div");
      colDiv.classList.add("col"); // This ensures the images are responsive based on the grid

      colDiv.appendChild(imgElement);
      galleryContainer.appendChild(colDiv);
    });
  })
  .catch((error) => {
    console.error("Error fetching the gallery images:", error);
  });

// Fetch images from the endpoint
fetch(
  "https://backend-undangan-pernikahan-opang.vercel.app//getMempelaiWanita/"
)
  .then((response) => response.json()) // Parse the JSON data
  .then((data) => {
    const galleryContainer = document.getElementById("imgMempelaiWanita");

    // Loop through the images and create image elements
    data.forEach((mempelaiWanita) => {
      const imgElement = document.createElement("img");
      const namaWanita = document.getElementById("namaMempelaiWanita");
      const captionWanita = document.getElementById("captionMempelaiWanita");
      imgElement.src = mempelaiWanita.imageUrl; // Assuming the API returns an object with a 'imageUrl' property for each image
      imgElement.alt = "Wedding Image";
      imgElement.classList.add(
        "img-thumbnail",
        "rounded-lg",
        // "col",
        "gallery-shadow-img"
      ); // Optional: To make the images responsive
      namaWanita.innerHTML = mempelaiWanita.nama;
      captionWanita.innerHTML = mempelaiWanita.caption;

      const colDiv = document.createElement("div");
      colDiv.classList.add("col"); // This ensures the images are responsive based on the grid

      colDiv.appendChild(imgElement);
      galleryContainer.appendChild(colDiv);
    });
  })
  .catch((error) => {
    console.error("Error fetching the gallery images:", error);
  });
