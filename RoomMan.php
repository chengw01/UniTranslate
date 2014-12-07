//This file handles the translation and keeps the room in sync

<?php

require_once('lib/autoloader.php');
use Pubnub\Pubnub;

$pubNub = new Pubnub(
    "pub-c-59a1f5c0-e4a6-48ce-b148-b9b0ca01bb3e",
    "sub-c-81c3a310-7d53-11e4-9173-02ee2ddab7fe"
);

$langToUse = [];

$token = "";
$tokenExpireTime = "";

//From http://msdn.microsoft.com/en-us/library/hh454950.aspx
function getBingToken()
{
    global $token, $tokenExpireTime;
    
    try{
        $ch = curl_init();
        $paramArr = array (
            'grant_type'    => "client_credentials",
            'scope'         => "http://api.microsofttranslator.com",
            'client_id'     => "unitranslate",
            'client_secret' => "3nAai0myLhzBbeX8knglznQ5t1AJ0EjPD3juJXe1XKY="
        );
        $paramArr = http_build_query($paramArr);
        curl_setopt($ch, CURLOPT_URL, "https://datamarket.accesscontrol.windows.net/v2/OAuth2-13/");
        curl_setopt($ch, CURLOPT_POST, TRUE);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $paramArr);
        curl_setopt ($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $strResponse = curl_exec($ch);
        $curlErrno = curl_errno($ch);
        if($curlErrno){
            $curlError = curl_error($ch);
            throw new Exception($curlError);
        }
        
        curl_close($ch);
        $objResponse = json_decode($strResponse);
        if ($objResponse->error){
            throw new Exception($objResponse->error_description);
        }
        
        $token = $objResponse->access_token;
        $tokenExpireTime = time() + $objResponse->expires_in;
    }catch (Exception $e){
        echo "Failed to get Bing token";
    }
}

getBingToken();

while(true){
    $pubNub->subscribe($argv[1],function($message){
    
        if(time() + 10 > $tokenExpireTime){
           getBingToken();
       }
    
        global $langToUse, $tokenExpireTime, $token;
        
       $arrayContents = $message["message"];
       
       if($arrayContents["event"] == "newuser"){
           if(!in_array($arrayContents["language"],$langToUse)){
               $langToUse[] = $arrayContents["language"];
           }
       } else if ($arrayContents["event"] == "rawmessage") {
           
       }
       
       var_dump($arrayContents) ."\n";
    });
}