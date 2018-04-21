window.onload = function() {
  var input = document.getElementById("input");
  var username = "";
  // TODO: Add an option to input other Steam forms (SteamID, Steam64, Steam32)
  input.onkeyup = function(e) {
    // Runs on enter press (when key is released)
    if (e.keyCode == 13) {
       username = input.value;
       if (username.length > 0) {
         getID(username);
       }
    }
  }
};

function getID(username) {
  $.getJSON('/proxy.php', {username: username}, function (response) {
    if (response.response.success == 1) {
      getData(response.response.steamid);
    } else {
      // TODO: Display this in a fancy fashion?
      console.log("Invalid username: Steam servers responded without success.");
    }
  });
}

function getData(id) {
  $.getJSON('/proxy.php', {steamid: id}, function (response) {
    // A detailed list of all accessible data can be found here:
    // https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0002.29
    var info = response.response.players[0];
    var body = document.getElementsByTagName("body")[0];

    body.innerHTML = "<img id='photo' src='" + info.avatarfull + "' alt=" + info.personaname + " />";
    body.style.backgroundColor = "#eee9df";

    body.innerHTML += "<p id='name'>" + info.personaname + " </p>";
    var nameP = document.getElementById("name");

    // TODO: Test the value returned when a profile doesn't have a real name set!
    var realName = info.realname;
    if (realName != "") {
      nameP.innerHTML += "<small>(" + info.realname + ")</small>";
    }
  });
}
