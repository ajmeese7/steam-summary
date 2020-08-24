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
 *          DISPLAY FUNCTIONS        *
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
    let badgeColor = getBadgeColor(badges.player_level);
    Circles.create({
      // https://github.com/lugolabs/circles
      id:       'level-circle',
      radius:   17.5,
      value:    progress,
      maxValue: nextLevel,
      width:    2,
      text:     badges.player_level,
      colors:   [ badgeColor, LightenDarkenColor(badgeColor, -65) ],
      duration: 500
    });

    // TODO: Add a fallback for if location is not available
    showLocation(
      userData.loccountrycode,
      userData.locstatecode,
      userData.loccityid
    );

    // Global scope so I don't have to make this request again if
    // I want to use the individual games later
    window.games = await getOwnedGames(steamid);
    document.getElementById("games").innerText = `Owned games: ${window.games.game_count}`;

    window.friendslist = await getFriendsList(steamid);
    window.friendCounter = 0;
    showMoreFriends();

    let showMore = document.createElement("a");
    showMore.innerText = "Show more...";
    showMore.onclick = () => showMoreFriends();
    showMore.id = "showMore";
    document.getElementById("friends").appendChild(showMore);
  }
}

function addDataToPage(info) {
  let start = document.getElementById("start"),
      profile = document.getElementById("profile"),
      body = document.getElementsByTagName("body")[0];
  start.style.display = "none";
  profile.style.display = "inherit";
  body.style.backgroundColor = "#2a475e";
  body.classList.add("gradient-background");
  body.style.minHeight = `${window.innerHeight}px`;

  // Images are blurry because of Steam. I can't help it
  let profilePic = document.getElementById("profilePic");
  profilePic.src = info.avatarfull;
  profilePic.alt = info.personaname;
  profilePic.title = info.personaname;

  let name = document.getElementById("name");
  name.innerText = info.personaname;
  name.href = info.profileurl;
  document.title = `${info.personaname}'s Profile`;

  let realName = info.realname;
  if (realName)
    name.innerHTML += "<small> (" + realName + ")</small>";
  
  if (info.timecreated) {
    let age = document.getElementById("age");
    let date = new Date(info.timecreated * 1000);
    age.title = date.toLocaleString();
    age.innerHTML = `Joined Steam <span style="color: #66c0f4;">${timeSince(date)}</span> ago`;
  }

  document.getElementById("steamId").innerText = info.steamid;
}

// https://stackoverflow.com/a/60784336/6456163
async function showLocation(loccountrycode, locstatecode, loccityid) {
  console.log(`Location info: ${loccountrycode}, ${locstatecode}, ${loccityid}`);

  // File courtesy of https://github.com/Holek/steam-friends-countries
  let location, zoom;
  await fetch('./steam_countries.min.json')
    .then(response => response.json())
    .then(obj => {
      let country = eval(`obj.${loccountrycode}`);
      if (country) {
        location = country.coordinates;
        zoom = 4;
      }

      let state = eval(`country.states.${locstatecode}`);
      if (state) {
        location = state.coordinates;
        zoom = 5;
      }

      let city = eval(`country.states.${locstatecode}.cities[${loccityid}]`);
      if (city) {
        location = city.coordinates;
        zoom = 8;
      }
    })

  let coords = location.split(',');
  let map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: parseInt(coords[0]),
      lng: parseInt(coords[1])
    },
    zoom: zoom
  });

  // The center is slightly off, and this comes close to correcting it
  map.panBy(-25, -100);
}

// TODO: Fix the 'show more' button
async function showMoreFriends() {
  let friends = document.getElementById("friendList");
  let previousBound = window.friendCounter;

  // Loads friends 10 at a time
  for (let i = window.friendCounter; i < window.friendslist.length; i++) {
    if (i > previousBound + 9) break;
    let friendInfo = await getData(window.friendslist[i].steamid);
    let friendCard = document.createElement("a");
    
    friendCard.href = friendInfo.profileurl;
    friendCard.setAttribute('target', '_blank');
    friendCard.classList.add("friendCard", "faded-out", "col-xs-12", "col-sm-6", "col-md-4", "col-lg-3");
    friendCard.innerHTML += `<img src='${friendInfo.avatarmedium}' />`;
    friendCard.innerHTML += `<p class='friendName'>${friendInfo.personaname}</p>`; // TODO: Content w/ innerText
    friends.appendChild(friendCard);

    // https://medium.com/@felixblaschke/dynamisch-erstellte-html-elemente-animieren-6d165a37f685
    requestAnimationFrame(() => friendCard.classList.remove("faded-out") );
    window.friendCounter++;
  }
}

/*************************************
 *          HELPER FUNCTIONS         *
 *************************************/
function getBadgeColor(level) {
  // https://cdn.discordapp.com/attachments/185867315647086592/276664412650340353/unknown.png
  level = level % 100;
  if (level < 10) {
    return "#b9b9b9";
  } else if (level < 20) {
    return "#c02942";
  } else if (level < 30) {
    return "#d95b43";
  } else if (level < 40) {
    return "#fecc23";
  } else if (level < 50) {
    return "#467a3c";
  } else if (level < 60) {
    return "#4e8ddb";
  } else if (level < 70) {
    return "#7652c9";
  } else if (level < 80) {
    return "#c252c9";
  } else if (level < 90) {
    return "#542437";
  } else {
    return "#997c52";
  }
}

function LightenDarkenColor(col, amt) {
  // https://css-tricks.com/snippets/javascript/lighten-darken-color/
  let usePound = false;
  if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
  }
  let num = parseInt(col,16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if  (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255;
  else if  (b < 0) b = 0;
  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

// https://stackoverflow.com/a/3177838/6456163
function timeSince(date) {
  let seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    let rounded = parseInt(interval).toFixed(1);
    let trailingZero = rounded.slice(-1) == '0';
    return (trailingZero ? interval : rounded) + " years";
  }

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