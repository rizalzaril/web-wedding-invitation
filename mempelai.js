// Fetch images from the endpoint
fetch("http://localhost:5000/getMempelaiPria/")
  .then((response) => response.json()) // Parse the JSON data
  .then((data) => {
    const galleryContainer = document.getElementById("imgMempelaiPria");

    // Loop through the images and create image elements
    data.forEach((mempelaiPria) => {
      const imgElement = document.createElement("img");
      imgElement.src = mempelaiPria.imageUrl; // Assuming the API returns an object with a 'imageUrl' property for each image
      imgElement.alt = "Wedding Image";
      imgElement.classList.add(
        "img-thumbnail",
        "rounded-lg",
        "col",
        "mt-3",
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
