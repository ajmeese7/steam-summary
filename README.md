# steam-summary
A Steam profile visualizer.

I looked around for a while for a good Steam profile visualizer but I could never
find one that was up to my standards, so I started working on one.

### Setup
Edit the file `proxy.php` to include your API key here:
```php
$token = 'YOUR_KEY_HERE';
```

Of course, replace the API key with your own, which you can get [here](http://steamcommunity.com/dev/apikey).
If you want to run the project locally, start the server by running the following command
then visiting the URL in your browser:

```
php -S localhost:8000
```

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
- Find an API that shows total XP, so that can be the title attribute for the player level
- Accept other forms of identification (SteamID, Steam64, Steam32) in the input field