window.onload = () => {
  let input = document.getElementById("username");
  input.onkeyup = async (e) => {
    // Runs on enter press (when key is released)
    if (e.keyCode == 13) {
      let username = input.value;
      if (username.length) {
        let steamid = await getID(username);
        displayData(steamid);
      }
    }
  }
};

/*************************************
 *              GETTERS              *
 *************************************/
function getID(username) {
  const id = async () => {
    const result = await $.getJSON('proxy.php', { method: 'getID', username: username }, (res) => res);
    return result;
  }

  return (async () => {
    let res = await id();
    let success = res.response.success;
    if (success == 1) {
      return res.response.steamid;
    } else {
      document.getElementById("errorMessage").style.visibility = "visible";
      document.getElementById("successCode").innerText = success;

      return window.onload(); // Goes back to waiting for text input
    }
  })();
}

function getData(id) {
  // https://flaviocopes.com/how-to-return-result-asynchronous-function/
  const data = async () => {
    const result = await $.getJSON('proxy.php', { method: 'getData', steamid: id }, (res) => res);
    return result.response.players[0];
  }

  return (async () => await data() )();
}

function getFriendsList(id) {
  const list = async () => {
    const result = await $.getJSON('proxy.php', { method: 'getFriendList', steamid: id }, (res) => res);
    return result.friendslist.friends;
  }

  return (async () => await list() )();
}

function getBadges(id) {
  const badges = async () => {
    const result = await $.getJSON('proxy.php', { method: 'getBadges', steamid: id }, (res) => res);
    return result.response;
  }

  return (async () => await badges() )();
}

function getOwnedGames(id) {
  const games = async () => {
    const result = await $.getJSON('proxy.php', { method: 'getOwnedGames', steamid: id }, (res) => res);
    return result.response;
  }

  return (async () => await games() )();
}

/*************************************
 *            OTHER STUFF            *
 *************************************/
async function displayData(steamid) {
  let userData = await getData(steamid);
  addDataToPage(userData);

  // Methods that only work if profile is public (3)
  if (userData.communityvisibilitystate == 3) {
    // TODO: Do something with actual badges
    let badges = await getBadges(steamid);
    document.getElementById("level").title = `Total XP: ${badges.player_xp}`;

    // NOTE: Can also make a horizontal display like the one here if I want;
    // https://steamdb.info/calculator/76561198069087631/
    let progress = badges.player_xp - badges.player_xp_needed_current_level;
    let nextLevel = progress + badges.player_xp_needed_to_level_up;
    let levelCircle = Circles.create({
      // https://github.com/lugolabs/circles
      id:                  'level-circle',
      radius:              19.5,
      value:               progress,
      maxValue:            nextLevel,
      width:               6.25,
      text:                badges.player_level,
      colors:              ['#D3B6C6', '#4B253A'],
      duration:            500
    });

    // Global scope so I don't have to make this request again if
    // I want to use the individual games later
    window.games = await getOwnedGames(steamid);
    document.getElementById("games").innerText = `Owned games: ${window.games.game_count}`;

    let friendslist = await getFriendsList(steamid);
    displayFriendsList(friendslist);
  }
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