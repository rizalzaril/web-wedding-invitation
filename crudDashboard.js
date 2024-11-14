document.addEventListener("DOMContentLoaded", loadGallery);

document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

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

        displayImageCard(data.imageUrl, data.id); // Assuming response contains `imageUrl` and `id`
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
        displayImageCard(image.imageUrl, image.id); // Assuming `id` is returned with each image
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
  card.classList.add("image-card");

  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = "Uploaded Image";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-btn");
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
