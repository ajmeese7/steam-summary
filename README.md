# steam-summary
A Steam profile visualizer.

I looked around for a while for a good Steam profile visualizer but I could never
find one that was up to my standards, so I made this.

### Setup
Make a file called `apikey.php` and paste in the following information:
```
<?php
  $steam_api_key = "YOUR_API_KEY_HERE";
  $steamid = "";
  $api_url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=$steam_api_key&steamids=$steamid";
  $json = json_decode(file_get_contents($api_url), true);
?>
```

Of course, replace the API key with your own, which you can get [here](http://steamcommunity.com/dev/apikey).
The `steamid` section won't be needed when I'm finished, but for now it's the only
way to get your profile information in this project.
