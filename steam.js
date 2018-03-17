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
  var key = apikey.key;
  var url= "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=" + key + "&vanityurl=" + username;
  var id = "";
  // Super special thanks to this guy. It took me 244 tries to successfully access the Steam Web API
  // without using PHP, and I only got it because of this. Shoutout to the real ones
  $.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?', function (data) {
    var information = data.contents;
    id = JSON.stringify(information).substring(42, 59);
    getData(id);
  });
}

function getData(id) {
  var key = apikey.key;
  var url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + key + "&steamids=" + id;

  $.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?', function (data) {
    var json = JSON.parse(data.contents);
    console.log(json.response.players[0].steamid);
  });

    /*echo "<img id='profilePhoto' src='";
    echo $json['response']['players'][0]['avatarfull'];
    echo "' alt='Steam profile picture' />";

    echo "<p style='display: inline-block;'>";
    echo $json['response']['players'][0]['personaname'];
    echo "</p>";*/
}
