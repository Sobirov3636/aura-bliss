console.log("Signup frontend javascript file");

$(function () {
  const fileTarget = $(".file-box .upload-hidden");
  let fileName;
  fileTarget.on("change", function () {
    if (window.FileReader) {
      const uploadFile = $(this)[0].files[0];
      const fileType = uploadFile["type"];
      const validImageType = ["image/jpg", "image/jpeg", "image/png"];
      if (!validImageType.includes(fileType)) {
        alert("Please insert only jpeg, jpg and png!");
      } else {
        if (uploadFile) {
          console.log(URL.createObjectURL(uploadFile));
          $(".upload-img-frame").attr("src", URL.createObjectURL(uploadFile)).addClass("success");
        }
        fileName = $(this)[0].files[0].name;
      }
      $(this).siblings(".upload-name").val(fileName);
    }
  });
});

function validateSignupForm() {
  const memberNick = $(".member-nick").val(),
    memberGender = $(".member-gender").val(),
    memberPhone = $(".member-phone").val(),
    memberPassword = $(".member-password").val(),
    confirmPassword = $(".confirm-password").val();
  if (
    memberNick === "" ||
    memberGender === "" ||
    memberPhone === "" ||
    memberPassword === "" ||
    confirmPassword === ""
  ) {
    alert("Please insert all required inputs");
    return false;
  }

  if (memberPassword !== confirmPassword) {
    alert("Password differs, please check!");
    return false;
  }

  const memberImage = $(".member-image").get(0).files[0] ? $(".member-image").get(0).files[0].name : null;

  if (!memberImage) {
    alert("Please insert profile image");
    return false;
  }
}
