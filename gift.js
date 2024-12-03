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
    if (giftContent.is(":visible")) {
      giftContent.animate({ opacity: 0 }, 500, function () {
        giftContent.hide();
      });
    } else {
      giftContent.show().animate({ opacity: 1 }, 300);
    }
  });
});
