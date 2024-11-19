//  ******************************** GET FIRST STORY *************************** \\
fetch("https://backend-undangan-pernikahan-opang.vercel.app/getFirstStory")
  .then((response) => response.json())
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      const firstStory = data[0]; // Ambil data pertama
      const imgUrl = firstStory.imageUrl; // URL gambar
      const caption = firstStory.caption; // Caption dari cerita

      // Atur background image
      const firstTimelineImg = document.querySelector(".timeline-img.first");
      if (firstTimelineImg) {
        if (imgUrl) {
          firstTimelineImg.style.backgroundImage = `url('${imgUrl}')`;
        } else {
          console.error("URL gambar tidak ditemukan di data pertama.");
        }
      } else {
        console.error(
          "Elemen dengan kelas 'timeline-img.first' tidak ditemukan."
        );
      }

      // Atur caption pada elemen <p>
      const captionElement = document.querySelector(".timeline-caption-first");
      if (captionElement) {
        if (caption) {
          captionElement.textContent = caption; // Set teks caption
        } else {
          console.error("Caption tidak ditemukan di data pertama.");
        }
      } else {
        console.error(
          "Elemen dengan kelas 'timeline-caption' tidak ditemukan."
        );
      }
    } else {
      console.error("Data API tidak valid atau kosong untuk cerita pertama.");
    }
  })
  .catch((error) => {
    console.error(
      "Terjadi kesalahan saat mengambil data cerita pertama:",
      error
    );
  });

//  ******************************** GET SECOND STORY *************************** \\
fetch("https://backend-undangan-pernikahan-opang.vercel.app/getSecondStory")
  .then((response) => response.json())
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      const firstStory = data[0]; // Ambil data pertama
      const imgUrl = firstStory.imageUrl; // URL gambar
      const caption = firstStory.caption; // Caption dari cerita

      // Atur background image
      const firstTimelineImg = document.querySelector(".timeline-img.second");
      if (firstTimelineImg) {
        if (imgUrl) {
          firstTimelineImg.style.backgroundImage = `url('${imgUrl}')`;
        } else {
          console.error("URL gambar tidak ditemukan di data pertama.");
        }
      } else {
        console.error(
          "Elemen dengan kelas 'timeline-img.first' tidak ditemukan."
        );
      }

      // Atur caption pada elemen <p>
      const captionElement = document.querySelector(".timeline-caption-second");
      if (captionElement) {
        if (caption) {
          captionElement.textContent = caption; // Set teks caption
        } else {
          console.error("Caption tidak ditemukan di data pertama.");
        }
      } else {
        console.error(
          "Elemen dengan kelas 'timeline-caption' tidak ditemukan."
        );
      }
    } else {
      console.error("Data API tidak valid atau kosong untuk cerita pertama.");
    }
  })
  .catch((error) => {
    console.error(
      "Terjadi kesalahan saat mengambil data cerita pertama:",
      error
    );
  });

//  ******************************** GET LAST STORY *************************** \\
fetch("https://backend-undangan-pernikahan-opang.vercel.app/getLastStory")
  .then((response) => response.json())
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      const firstStory = data[0]; // Ambil data pertama
      const imgUrl = firstStory.imageUrl; // URL gambar
      const caption = firstStory.caption; // Caption dari cerita

      // Atur background image
      const firstTimelineImg = document.querySelector(".timeline-img.last");
      if (firstTimelineImg) {
        if (imgUrl) {
          firstTimelineImg.style.backgroundImage = `url('${imgUrl}')`;
        } else {
          console.error("URL gambar tidak ditemukan di data pertama.");
        }
      } else {
        console.error(
          "Elemen dengan kelas 'timeline-img.last' tidak ditemukan."
        );
      }

      // Atur caption pada elemen <p>
      const captionElement = document.querySelector(".timeline-caption-last");
      if (captionElement) {
        if (caption) {
          captionElement.textContent = caption; // Set teks caption
        } else {
          console.error("Caption tidak ditemukan di data pertama.");
        }
      } else {
        console.error(
          "Elemen dengan kelas 'timeline-caption' tidak ditemukan."
        );
      }
    } else {
      console.error("Data API tidak valid atau kosong untuk cerita pertama.");
    }
  })
  .catch((error) => {
    console.error(
      "Terjadi kesalahan saat mengambil data cerita pertama:",
      error
    );
  });
