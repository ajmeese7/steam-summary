<?php
  // Get event ID you want to request:
  $steamID = isset($_GET['steamid']) ? $_GET['steamid'] : FALSE;

  // Set your token:
  $token = 'YOUR_KEY_HERE';

  // Exit if no ID provided:
  if (!$steamID) {
    $username = $_GET['username'];
    $url = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=%s&vanityurl=%s';

    // Set url, pass in params:
    $request_uri = sprintf($url, $token, $username);
  } else {
    // Set url, %s will be replaced later:
    $url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=%s&steamids=%s';

    // Set url, pass in params:
    $request_uri = sprintf($url, $token, $steamID);
  }

  // Try to fetch:
  $response = file_get_contents($request_uri);

  // Set content-type to application/json for the client to expect a JSON response:
  header('Content-type: application/json');

  // Output the response and kill the scipt:
  exit($response);
?>
