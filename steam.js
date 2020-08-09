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
      addDataToPage(userData);

      // TODO: Separate these independent bits of code to do what the name says
      // Get friend list only works if profile is public (3)
      if (userData.communityvisibilitystate == 3) {
        let level = await getLevel(steamid);
        document.getElementById("level").innerText = `Level ${level}`;

        // Global scope so I don't have to make this request again if
        // I want to use the individual games later
        window.games = await getOwnedGames(steamid);
        document.getElementById("games").innerText = `Owned games: ${window.games.game_count}`;

        let friendslist = await getFriendsList(steamid);
        displayFriendsList(friendslist);
      }
    } else {
      document.getElementById("errorMessage").style.visibility = "visible";
      document.getElementById("successCode").innerText = success;

      window.onload(); // Goes back to waiting for text input
    }
  });
}

// A detailed list of all accessible data can be found here:
  // https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0002.29
  // https://partner.steamgames.com/doc/webapi/IPlayerService
function getData(id) {
  // https://flaviocopes.com/how-to-return-result-asynchronous-function/
  const data = async () => {
    const result = await $.getJSON('proxy.php', { method: 'getData', steamid: id }, (res) => res);
    return result.response.players[0];
  }

  return (async () => await data() )();
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
    age.innerText = `Joined Steam ${timeSince(date)} ago`;
  }

  document.getElementById("steamId").innerText = info.steamid;
  document.getElementById("profileLink").href = info.profileurl;
}

function getFriendsList(id) {
  const list = async () => {
    const result = await $.getJSON('proxy.php', { method: 'getFriendList', steamid: id }, (res) => res);
    return result.friendslist.friends;
  }

  return (async () => await list() )();
}

async function displayFriendsList(friendslist) {
  let friends = document.getElementById("friendList");

  // TODO: Paginate this correctly with a 'See more' button
  for (let i = 0; i < friendslist.length; i++) {
    if (i > 10) break;
    let friendInfo = await getData(friendslist[i].steamid);
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
}

// TODO: Test a private account to see if I can get this info
function getLevel(id) {
  const level = async () => {
    const result = await $.getJSON('proxy.php', { method: 'getLevel', steamid: id }, (res) => res);
    return result.response.player_level;
  }

  return (async () => await level() )();
}

function getOwnedGames(id) {
  const games = async () => {
    const result = await $.getJSON('proxy.php', { method: 'getOwnedGames', steamid: id }, (res) => res);
    return result.response;
  }

  return (async () => await games() )();
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