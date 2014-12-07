//This file handles the translation and keeps the room in sync

<?php

require_once('lib/autoloader.php');
use Pubnub\Pubnub;
$pubNub = new Pubnub(
    "pub-c-59a1f5c0-e4a6-48ce-b148-b9b0ca01bb3e",
    "sub-c-81c3a310-7d53-11e4-9173-02ee2ddab7fe"
);

$langToUse = [];

while(true){
    $pubnub->subscribe($argv[1],function($message){
       $arrayContents = $message["message"];
       
       if($arrayContents["event"] == "newuser"){
           if(in_array($arrayContents["language"],$langToUse)){
               $langToUse[] = $arrayContents["language"];
           }
       }
       
       echo $arrayContents ."\n";
    });
}