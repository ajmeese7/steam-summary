<?php
  // Keep the API key ($token) a secret
  include('env.php');

  switch ($_GET['method']) {
    case 'getID':
      $url = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=%s&vanityurl=%s';
      $request_uri = sprintf($url, $token, $_GET['username']);
      break;
    case 'getData':
      $url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=%s&steamids=%s';
      $request_uri = sprintf($url, $token, $_GET['steamid']);
      break;
    case 'getFriendList':
      $url = 'http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=%s&steamid=%s&relationship=friend';
      $request_uri = sprintf($url, $token, $_GET['steamid']);
      break;
    case 'getOwnedGames':
      $url = 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=%s&steamid=%s';
      $request_uri = sprintf($url, $token, $_GET['steamid']);
      break;
    case 'getBadges':
      $url = 'https://api.steampowered.com/IPlayerService/GetBadges/v1/?key=%s&steamid=%s';
      $request_uri = sprintf($url, $token, $_GET['steamid']);
      break;
    default:
      header('HTTP/1.1 400 Bad Request');
      exit("No valid method was provided.");
      break;
  }

  // Try to fetch:
  $response = file_get_contents($request_uri);

  // Set content-type to application/json for the client to expect a JSON response:
  header('Content-type: application/json');

  // Output the response and kill the scipt:
  exit($response);
?>
