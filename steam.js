function validateInput() {
  var username = document.getElementById("input").value;
  // Username length validation
  if (username.length > 0) {
    console.log("Part 1 validation: COMPLETE");
  } else {
    // School-assistant style 1-time error message
    return;
  }
}
