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
  $.getJSON('proxy.php', { method: 'getID', username: username }, async (res) => {
    let success = await res.response.success;
    if (success == 1) {
      let steamid = res.response.steamid;
      let userData = await getData(steamid);
      userData = userData.response.players[0];
      addDataToPage(userData);

      // TODO: Separate these independent bits of code to do what the name says
      // Get friend list only works if profile is public (3)
      if (userData.communityvisibilitystate == 3)
        getFriendList(steamid);
        displayLevel(steamid);
    } else {
      document.getElementById("errorMessage").style.visibility = "visible";
      document.getElementById("successCode").innerText = success;

      window.onload(); // Goes back to waiting for text input
    }
  });
}

async function getData(id) {
  // A detailed list of all accessible data can be found here:
  // https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0002.29
  // https://partner.steamgames.com/doc/webapi/IPlayerService
    // TODO: Try to return the res.response.players[0] `only`
  return $.getJSON('proxy.php', { method: 'getData', steamid: id }, (res) => res);
}

function addDataToPage(info) {
  let start = document.getElementById("start"),
      profile = document.getElementById("profile"),
      body = document.getElementsByTagName("body")[0];
  start.style.display = "none";
  profile.style.display = "inherit";
  body.style.backgroundColor = "#eee9df";

  // Images are blurry because of Steam. I can't help it
  let profilePic = document.getElementById("profilePic");
  profilePic.src = info.avatarfull;
  profilePic.alt = info.personaname;
  profilePic.title = info.personaname;

  let name = document.getElementById("name");
  name.innerText = info.personaname;
  document.title = `${info.personaname}'s Profile`;

  let realName = info.realname;
  if (realName)
    name.innerHTML += "<small> (" + realName + ")</small>";
  
  if (info.timecreated) {
    let age = document.getElementById("age");
    let date = new Date(info.timecreated * 1000);
    age.title = date.toLocaleString();
    age.innerText = timeSince(date);
  }

  document.getElementById("steamId").innerText = info.steamid;
  document.getElementById("profileLink").href = info.profileurl;
}

function getFriendList(id) {
  $.getJSON('proxy.php', { method: 'getFriendList', steamid: id }, async (res) => {
    let friends = document.getElementById("friendList");
    let friendslist = res.friendslist.friends;

    // TODO: Paginate this correctly with a 'See more' button
    for (let i = 0; i < friendslist.length; i++) {
      if (i > 10) break;
      let friendInfo = await getData(friendslist[i].steamid);
      friendInfo = friendInfo.response.players[0];

      let friendCard = document.createElement("a");
      friendCard.href = friendInfo.profileurl;
      friendCard.setAttribute('target', '_blank');
      friendCard.classList.add("friendCard", "faded-out", "col-xs-12", "col-sm-6", "col-md-4", "col-lg-3");
      friendCard.innerHTML += `<img src='${friendInfo.avatarmedium}' />`;
      friendCard.innerHTML += `<p class='friendName'>${friendInfo.personaname}</p>`;
      friends.appendChild(friendCard);

      // https://medium.com/@felixblaschke/dynamisch-erstellte-html-elemente-animieren-6d165a37f685
      requestAnimationFrame(() => {
        friendCard.classList.remove("faded-out");
      });
    }
  });
}

function displayLevel(id) {
  // TODO: Test a private account to see if I can get this info
  $.getJSON('proxy.php', { method: 'getLevel', steamid: id })
    .done((json) => {
      let level = document.getElementById("level");
      level.innerText = `Level ${json.response.player_level}`;
      
      // TODO: Eventually find a workaround to return value from this async func
    })
    .fail((jqxhr, textStatus, error) => {
      let err = `${textStatus}, ${error}`;
      console.error("getLevel request failed:", err);
  });
}

// https://stackoverflow.com/a/3177838/6456163
function timeSince(date) {
  // TODO: Find a fancier format to display this as, possibly like:
  // https://steamdb.info/calculator/76561198069087631/

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