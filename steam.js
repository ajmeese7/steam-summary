window.onload = function() {
  var input = document.getElementById("input");
  var username = "";
  input.onkeyup = function(e) {
    // Runs on enter press (when key is released)
    if (e.keyCode == 13) {
       username = input.value;
       if (validate(username)) {
         // TODO: Find a better way to wait until return value isn't undefined than calling getData() at end
         getID(username);
       }
    }
  }
};

function validate(username) {
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

function getID(username) {
  $.getJSON('/proxy.php', {username: username}, function (response) {
    // TODO: ADD FALLACY PROTECTION AGAINST INVALID USERNAMES!
    getData(response.response.steamid);
  });
}

function getData(id) {
  $.getJSON('/proxy.php', {steamid: id}, function (response) {
    var info = response.response.players[0];
    var body = document.getElementsByTagName("body")[0];
    body.innerHTML = "<img id='photo' src='" + info.avatarfull + "' />";
    body.style.backgroundColor = "#eee9df";

    body.innerHTML += "<p id='name'>" + info.personaname + "</p>";
  });
}
