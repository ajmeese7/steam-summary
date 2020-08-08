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
Right now I **think** I have a pretty good setup for retrieving the Steam user's data, but the frontend (the 
main portion of the project) still has a lot of work that needs to be done to it.

If you're good with UI, your input here would be greatly appreciated. What I'm envisioning now is sort of a mix 
between the classic Steam interface and this [GitHub profile visualizer](https://github.com/tipsy/profile-summary-for-github).
