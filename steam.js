window.onload = function() {
  var input = document.getElementById("input");
  input.onkeyup = function(e) {
    // Runs on enter press (when key is released)
    if (e.keyCode == 13) {
       validate();
    }
  }
};

function validate() {
  var username = input.value;
  error = "";

  // Username length validation
  if (username.length > 0) {
    console.log("Part 1 validation: COMPLETE");
  } else {
    // TODO: implement school-assistant style 1-time error message
    error = "Username must be longer than 0 characters.";
    console.log("Error: " + error);
    return false;
  }

  return true;
}

function getSteamData() {

}
