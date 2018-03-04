<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Steam Summary</title>

    <meta http-equiv=”Pragma” content=”no-cache”>
    <meta http-equiv=”Expires” content=”-1″>
    <meta http-equiv=”CACHE-CONTROL” content=”NO-CACHE”>

    <link rel="stylesheet" type="text/css" href="style.css" />
    <script type="text/javascript" src="steam.js"></script>
  </head>
  <body>
    <h1 id="instructions">Enter Steam username</h1>
    <div style="height: 40px; text-align: center;">
      <input id="input" type="text" placeholder="ex. 'ajmeese7'">
    </div>

    <section id="steam">
      <!-- TODO: Remove PHP and replace with AJAX? -->
      <?php include 'apikeys.php';
        /*
        echo "<img id='profilePhoto' src='";
        echo $json['response']['players'][0]['avatarfull'];
        echo "' alt='Steam profile picture' />";

        echo "<p style='display: inline-block;'>";
        echo $json['response']['players'][0]['personaname'];
        echo "</p>";
        */
      ?>
    </section>
  </body>
</html>
