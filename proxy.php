<?php
  // Keep the API key ($token) a secret
  include('env.php');

  $method = $_GET['method'];
  if ($method == 'getID') {
    $url = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=%s&vanityurl=%s';
    $request_uri = sprintf($url, $token, $_GET['username']);
  } else if ($method == 'getData') {
    $url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=%s&steamids=%s';
    $request_uri = sprintf($url, $token, $_GET['steamid']);
  } else if ($method == 'getLevel') {
    $url = 'https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=%s&steamid=%s';
    $request_uri = sprintf($url, $token, $_GET['steamid']);
  } else if ($method == 'getFriendList') {
    $url = 'http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=%s&steamid=%s&relationship=friend';
    $request_uri = sprintf($url, $token, $_GET['steamid']);
  } else {
    header('HTTP/1.1 400 Bad Request');
    exit("No valid method was provided.");
  }

  // Try to fetch:
  $response = file_get_contents($request_uri);

  // Set content-type to application/json for the client to expect a JSON response:
  header('Content-type: application/json');

  // Output the response and kill the scipt:
  exit($response);
?>
