<p align="center">
  <h1 align="center">♨️Steam Summary♨️</h1>
</p>

<p align="center">
  <a href="https://github.com/ajmeese7/steam-summary/search?l=javascript">
    <img src="https://img.shields.io/badge/language-JavaScript-yellow" alt="JavaScript" />
  </a>
  <a href="https://github.com/ajmeese7/steam-summary/blob/master/LICENSE.md">
    <img src="https://img.shields.io/github/license/ajmeese7/steam-summary" alt="License" />
  </a>
  <a href="https://github.com/ajmeese7/steam-summary/stargazers">
    <img src="https://img.shields.io/github/stars/ajmeese7/steam-summary" alt="Stars" />
  </a>
  <a href="https://github.com/ajmeese7/steam-summary/network/members">
    <img src="https://img.shields.io/github/forks/ajmeese7/steam-summary" alt="Forks" />
  </a>
  <a href="https://github.com/ajmeese7/steam-summary/stargazers">
    <img src="https://img.shields.io/static/v1?label=%F0%9F%8C%9F&message=If%20Useful&style=style=flat&color=BC4E99" alt="Leave a Star!"/>
  </a>
</p>

![Steam Summary preview](https://user-images.githubusercontent.com/17814535/91184061-cd870800-e6b1-11ea-9a6f-be739c4b46ff.png)

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
