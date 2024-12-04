function copyAccountNumber() {
  const accountNumber = document.querySelector(".bank-number").innerText;
  navigator.clipboard
    .writeText(accountNumber)
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Tersalin!",
        text: "Nomor rekening sudah tercopy",
        showConfirmButton: false,
        timer: 1500,
      });
    })
    .catch((err) => {
      console.error("Gagal menyalin teks: ", err);
    });
}

function copyAccountNumberSecond() {
  const accountNumber = document.querySelector(".bank-number-second").innerText;
  navigator.clipboard
    .writeText(accountNumber)
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Tersalin!",
        text: "Nomor rekening sudah tercopy",
        showConfirmButton: false,
        timer: 1500,
      });
    })
    .catch((err) => {
      console.error("Gagal menyalin teks: ", err);
    });
}

// GIFT TOGGLE //

$(document).ready(function () {
  $("#toggleGift").click(function () {
    const giftContent = $("#gift-content");
    if (giftContent.css("display") === "none") {
      giftContent.css("display", "block"); // Tampilkan elemen
      setTimeout(() => giftContent.css("opacity", 1), 10); // Tambahkan transisi opacity
    } else {
      giftContent.css("opacity", 0); // Ubah opacity menjadi 0
      setTimeout(() => giftContent.css("display", "none"), 500); // Sembunyikan elemen setelah transisi selesai
    }
  });
});

// get gift barang shopee \\

// Fetch data from the API
fetch("https://backend-undangan-pernikahan-opang.vercel.app/getBarang")
  .then((response) => response.json())
  .then((data) => {
    // Assuming the API returns an array of products, iterate through them
    data.forEach((item) => {
      // Create the HTML structure for each product
      const productElement = `
       <div class="col-6">
       <div class="img-shopee-container">
          <img class=" img-shopee" src="${item.imageUrl}" alt="${item.namaBarang}" />
       </div>
       </div>
       <div class="col-6 text-start text-white">
         <div class="card-title">
           <h3>${item.namaBarang}</h3>
         </div>
         <a href="${item.linkShopee}" class="btn btn-lg btn-danger mt-3">
           Pesan <i class="fa-solid fa-cart-shopping"></i>
         </a>
       </div>

       <hr style="color:white; margin-top:15px; margin-bottom:15px" />
     `;

      // Append the product element to the container
      document.getElementById("product-container").innerHTML += productElement;
    });
  })
  .catch((error) => console.error("Error fetching data:", error));
