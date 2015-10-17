<?php

if((isset($_FILES['odsfile']['name'])) && (!$_FILES['odsfile']['error']) )
{
   $fileName = "Kilopreise.ods";

   move_uploaded_file($_FILES['odsfile']['tmp_name'], "./".$fileName);
    
   if(file_exists("./".$fileName))
   {
      echo 'done, go on with <a href="DownloadData.php">Download</a>';
   }
   else
   {
		echo "broken: ".$_FILES['odsfile']['error'];
   }
}
else
{
   echo '
   <html>
   <body>
      <form  method="POST" enctype="multipart/form-data">
      <input type="file" name="odsfile">
      <input type="submit" value="Start import" accesskey="s">
      </form>
	  <br>
   </body>
   </html>';
}
?>
