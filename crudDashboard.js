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
          headers: {
            // Add any necessary headers here, like authorization if needed
            // "Authorization": "Bearer <your-token>"
          },
        }
      );

      // Check if the response is a JSON or HTML response
      const contentType = response.headers.get("Content-Type");

      if (!contentType || !contentType.includes("application/json")) {
        // If it's not JSON, assume it's an error page or non-JSON response
        throw new Error("Unexpected response format: " + contentType);
      }

      const data = await response.json();

      if (response.ok) {
        // Success message with SweetAlert2
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
          showConfirmButton: false,
          timer: 1500, // Auto-close after 1.5 seconds
        });
      } else {
        // Error message with SweetAlert2
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message,
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      // General error message with SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
        showConfirmButton: true,
      });
    }
  });
