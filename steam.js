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
    var success = response.response.success;
    if (success == 1) {
      getData(response.response.steamid);
    } else {
      var body = document.getElementsByTagName("body")[0];

      // Checks if an error message is already displayed
      if ($('#errorMessage').length > 0) {
        $('#successCode').innerHTML = success;
      } else {
        body.innerHTML += "<p id='errorMessage'>The Steam WebAPI responded with a success indicator of <span id='successCode'>" + success + "</span>.</p>";
        $('#errorMessage').css({"color": "red", "margin": "auto", "margin-top": "12px"});
      }

      window.onload(); // Goes back to waiting for text input
    }
  });
}

function getData(id) {
  $.getJSON('/proxy.php', {steamid: id}, function (response) {
    // A detailed list of all accessible data can be found here:
    // https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0002.29
    var info = response.response.players[0];

    var body = document.getElementsByTagName("body")[0];
    body.innerHTML = "<div id='container'>";
    var div = document.getElementById("container");

    // Images are blurry because of Steam. I can't help it
    div.innerHTML += "<img id='photo' src='" + info.avatarfull + "' alt=" + info.personaname + " />";
    body.style.backgroundColor = "#eee9df";

    div.innerHTML += "<div id='textDiv' style='flex-direction: column;'>";
        var textDiv = document.getElementById("textDiv");
        textDiv.innerHTML += "<p id='name'>" + info.personaname + " </p>";
        var nameP = document.getElementById("name");

        // TODO: Test the value returned when a profile doesn't have a real name set!
        var realName = info.realname;
        if (realName != "") {
          nameP.innerHTML += "<small>(" + info.realname + ")</small>";
        }

        textDiv.innerHTML += "<p>" + info.steamid + " </p>";

        console.log(info.timecreated);
        console.log(new Date(info.timecreated));

        // TODO: Find a fancier format to display this as, possibly like:
        // https://steamdb.info/calculator/76561198069087631/
        textDiv.innerHTML += "<p>" + new Date(info.timecreated * 1000) + " </p>";

        textDiv.innerHTML += "<a href='" + info.profileurl + "' >View profile on Steam</a>";
    div.innerHTML += "</div>";
    // IDEA: Playtime graph like https://profile-summary-for-github.com/user/ajmeese7?

    body.innerHTML += "</div>"; // End of container
  });
}
