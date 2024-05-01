console.log("Products frontend javascript file");
$(function () {
  // $(".product-collection").on("change", () => {
  //   const selectedValue = $(".product-collection").val();
  //   if (selectedValue === "DRINK") {
  //     $("#product-collection").hide();
  //     $("#product-volume").show();
  //   } else {
  //     $("#product-volume").hide();
  //     $("#product-collection").show();
  //   }
  // });
  $("#process-btn").on("click", () => {
    $(".cosmetic-container").slideToggle(500);
    $("#process-btn").css("display", "none");
  });

  $("#cancel-btn").on("click", () => {
    $(".cosmetic-container").slideToggle(100);
    $("#process-btn").css("display", "flex");
  });
  $(".new-product-status").on("change", async function (e) {
    const id = e.target.id;
    const productStatus = $(`#${id}.new-product-status`).val();

    try {
      const response = await axios.post(`/admin/product/${id}`, { productStatus: productStatus });
      console.log("response:", response);
      const result = response.data;
      if (result.data) {
        $(".new-product-status").blur();
      } else alert("Product update failed!");
    } catch (err) {
      console.log(err);
      alert("Product update failed!");
    }
  });
});
function validateForm() {
  const productName = $(".product-name").val(),
    productTargetUser = $(".product-target-user").val(),
    productPrice = $(".product-price").val(),
    productLeftCount = $(".product-left-count").val(),
    proudctCategory = $(".product-category").val(),
    productDesc = $(".product-desc").val(),
    productStatus = $(".product-status").val();

  if (
    productName === "" ||
    productTargetUser === "" ||
    productPrice === "" ||
    productLeftCount === "" ||
    proudctCategory === "" ||
    productDesc === "" ||
    productStatus === ""
  ) {
    alert("Please insert all details!");
    return false;
  } else return true;
}

function previewFileHandler(input, order) {
  const imgClassName = input.className;
  const file = $(`.${imgClassName}`).get(0).files[0];
  const fileType = file["type"];
  const validImageType = ["image/jpg", "image/jpeg", "image/png"];

  if (!validImageType.includes(fileType)) {
    alert("Please insert only jpeg, jpg and png!");
  } else {
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        $(`#image-section-${order}`).attr("src", reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
}
