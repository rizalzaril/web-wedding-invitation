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
        "mt-3",
        "p-1"
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
