# steam-summary

![Steam Summary preview](https://user-images.githubusercontent.com/17814535/91070783-e08bd080-e5fc-11ea-9abc-a64f53a12b65.png)

I looked around for a while for a good Steam profile visualizer and left disappointed, 
so I started working my own.

### Setup
If you don't have your own Steam API key, go [here](https://steamcommunity.com/dev/apikey) to 
acquire one.

Create a file named `env.php` to include your Steam API key, and fill it like so:
```php
<?php
  $token = 'YOUR_STEAM_API_KEY_HERE';
?>
```

Of course, replace the API key with your own, which you can get [here](http://steamcommunity.com/dev/apikey).
If you want to run the project locally, start the server by running the following command
then visiting the URL in your browser:

```
php -S localhost:8000
```

You will need your own Google Maps API key for testing, as mine is restricted to the hosted
domain to prevent abuse. You can find the instructions on how to do so 
[here](https://developers.google.com/maps/documentation/javascript/get-api-key).

### Contributing
Right now I **think** I have a pretty good setup for retrieving the Steam user's data, but the frontend 
still needs a lot of work.

If you're good with UI, your input here would be greatly appreciated. What I'm envisioning now is sort of a mix 
between the classic Steam interface and this [GitHub profile visualizer](https://github.com/tipsy/profile-summary-for-github).

Steam has these [two](https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0002.29) 
[APIs](https://partner.steamgames.com/doc/webapi/IPlayerService) that allow me to get the info I need for this project.
If you're looking for a place to start adding to this project, look for something I haven't added and get on it!

### TODO
- Add a playtime graph like [this](https://profile-summary-for-github.com/user/ajmeese7)
- Show location by using [this project](https://github.com/Holek/steam-friends-countries)
- Create player-specific URLs that can be visited by anyone, so profiles can be
shared on social. Data will likely have to be stored and refreshed periodically
- Accept other forms of identification (SteamID, Steam64, Steam32) in the input field
- Steal more features from some of [these sites](https://steamcommunity.com/sharedfiles/filedetails/?id=451698754),
particularly [this one](https://steamdb.info/calculator/76561198069087631/)
- Make the layout mobile-friendly, and have a graceful transition for the map when 
the window width drops below 1000px