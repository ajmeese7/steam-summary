<?php
  $steam_api_key = "YOUR_API_KEY_HERE";
  $steamid = ""; // TODO: GET THIS FROM USERNAME
  $api_url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=$steam_api_key&steamids=$steamid";
  $json = json_decode(file_get_contents($api_url), true);
?>
