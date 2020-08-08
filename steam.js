window.onload = () => {
  // TODO: Add an option to input other Steam forms (SteamID, Steam64, Steam32)
  let input = document.getElementById("username");
  input.onkeyup = function(e) {
    // Runs on enter press (when key is released)
    if (e.keyCode == 13) {
       let username = input.value;
       if (username.length) getID(username);
    }
  }
};

function getID(username) {
  $.getJSON('proxy.php', {username: username}, function (response) {
    let success = response.response.success;
    if (success == 1) {
      getData(response.response.steamid);
    } else {
      document.getElementById("errorMessage").style.visibility = "visible";
      document.getElementById("successCode").innerText = success;

      window.onload(); // Goes back to waiting for text input
    }
  });
}

function getData(id) {
  $.getJSON('proxy.php', {steamid: id}, function (response) {
    let start = document.getElementById("start");
    start.style.display = "none";
    let profile = document.getElementById("profile");
    profile.style.display = "inherit";

    let body = document.getElementsByTagName("body")[0];
    body.style.backgroundColor = "#eee9df";

    // A detailed list of all accessible data can be found here:
    // https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0002.29
    let info = response.response.players[0];

    // Images are blurry because of Steam. I can't help it
    let profilePic = document.getElementById("profilePic");
    profilePic.src = info.avatarfull;
    profilePic.alt = info.personaname;

    let name = document.getElementById("name");
    name.innerText = info.personaname;

    let realName = info.realname;
    if (realName) {
      name.innerHTML += "<small> (" + realName + ")</small>";
    }
    
    document.getElementById("steamId").innerText = info.steamid;

    // TODO: Find a fancier format to display this as, possibly like:
    // https://steamdb.info/calculator/76561198069087631/
    let age = document.getElementById("age");
    let date = new Date(info.timecreated * 1000);
    age.title = date.toLocaleString();
    age.innerText = timeSince(date);

    document.getElementById("profileLink").href = info.profileurl;
    // IDEA: Playtime graph like https://profile-summary-for-github.com/user/ajmeese7
  });
}

// https://stackoverflow.com/a/3177838/6456163
function timeSince(date) {
  let seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return interval + " years";

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + " months";

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return interval + " days";

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return interval + " hours";

  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + " minutes";

  return Math.floor(seconds) + " seconds";
}