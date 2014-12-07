<?php

require_once('../lib/autoloader.php');
use Pubnub\Pubnub;

define("USE_TRANSLATION_CACHE",false);

//Do we have the required data?
if (is_null($_GET["username"]) || is_null($_GET["message"]) || is_null($_GET["room"])) {
    echo "fail";
    exit();
}

//Find out do we even need to translate
$pg = openDBConnection();
$user = pg_escape_literal($_GET["username"]);
$room = pg_escape_literal($_GET["room"]);

//We need the original language regardless
$orgLang = pg_query($pg,"SELECT lang FROM room_user WHERE name=$user");
$orgLang = pg_fetch_result($orgLang,0);

//This is why you properly make tables even in time constraints...
$result = pg_query($pg,"SELECT count(distinct lang) FROM room_user WHERE session = (SELECT session FROM room_user WHERE name= $user AND session = $room LIMIT 1)");
$result = pg_fetch_result($result,0);

if($result == 1){
    sendResponse($_GET["message"],$_GET["room"],$_GET["username"],$orgLang);
}else if($result == 0 || !$result){
    echo "fail";
    exit();
}

//Ok so we do need to translate, grab the token
$result = pg_query($pg,"SELECT expire,token FROM token LIMIT 1");
$result = pg_fetch_array($result);

//We'd better renew the token
if($result["expire"] < time() +10 || is_null($result["expire"])){
    $token = getBingToken();
}else{
    $token = $result["token"];
}

pg_close($pg);
$pg = openDBConnection();

$result = pg_query($pg,"SELECT distinct lang FROM room_user WHERE session = (SELECT session FROM room_user WHERE name=$user AND session = $room LIMIT 1)");

$returnArray = [$orgLang => $_GET["message"]];

//Loop through all languages and translate them
while ($lang = pg_fetch_array($result)) {
    
    //Only translate if the languages don't match
    if($orgLang != $lang[0]){
        $result = getTranslation(getTwoCharacterLanguage($orgLang),$_GET["message"],getTwoCharacterLanguage($lang[0]));
        $returnArray[$lang[0]] = $result;
    }
}

sendResponse($returnArray,$_GET["room"],$_GET["username"],$orgLang);

exit();


function sendResponse($data,$room,$orgUser,$orgLang,$retry = false){
    
    
    $pubNub = new Pubnub(
        "pub-c-59a1f5c0-e4a6-48ce-b148-b9b0ca01bb3e",
        "sub-c-81c3a310-7d53-11e4-9173-02ee2ddab7fe"
    );
    
    if(!is_array($data)){
        $returnArray = ["message" => $data];
    }
    
    $returnArray["event"] = "message";
    $returnArray["username"] = $orgUser;
    $returnArray["time"] = time();
    $returnArray["language"] = $orgLang;
    $returnArray["message"] = $data;
        

    $result = $pubNub->publish($room,$returnArray);
    
    if($result[1] != "Sent" && !$retry){
        sendResponse($data,$room,$orgUser,$orgLang,true);
    }else if($retry){
        echo "fail";
    }else{
        echo "ok";
    }

    exit();
}

function getTwoCharacterLanguage($input){
    //We have some special ones due to differences between services
    if($input == "cmn-Hans-HK"){
        return "zh-CHT";
    }else if($input == "cmn-Hans-CN"){
        return "zh-CHS";
    }else if($input == "tlh"){
        return $input;
    }
    return substr($input,0,2);
}

function getTranslation($org,$message,$to)
{
    
    //Check if it's already in the cache
    $db = openDBConnection();
    
    if(USE_TRANSLATION_CACHE){
        $res = pg_query($db,"SELECT to_text FROM translation_cache WHERE org_lang = " .pg_escape_literal($org) ." AND org_message = " .pg_escape_literal($message) ." AND to_lang = " .pg_escape_literal($to));
        if($result = pg_fetch_result($res,0)){
            pg_update($db,"translation_cache",["access" => time()],["org_lang" => $org, "org_message" => $message, "to_lang" => $to]);
            return $result;
        }
    }
    
    global $token;
    
    
    $url = "http://api.microsofttranslator.com/v2/Http.svc/Translate?text=" .urlencode($message) ."&from=$org&to=$to";
    $token = "Authorization: Bearer " .$token;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt ($ch, CURLOPT_HTTPHEADER, array($token,"Content-Type: text/xml"));
    $strResponse = curl_exec($ch);
    $curlErrno = curl_errno($ch);
    if($curlErrno){
        return false;
    }
    
    $xml = new SimpleXMLElement($strResponse);
    
    echo $xml;
    
    //Add this to the array
    if(USE_TRANSLATION_CACHE){
        $result = pg_insert($db,"translation_cache",["org_lang" => $org,"org_message" => $message, "to_lang" => $to, "to_text" => (string)$xml,"access" => time()]);
    }
    
    return (string)$xml;
}

//From http://msdn.microsoft.com/en-us/library/hh454950.aspx
function getBingToken()
{
    $db = openDBConnection();
    $result = pg_query($db,"SELECT token FROM token LIMIT 1");
    $result = pg_fetch_result($result,0);
    pg_delete($db,"token",["token" => $result]);

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
        curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);
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
        
        //Save to DB
        $result = pg_insert($db,"token",["token" => $objResponse->access_token,"expire" => $objResponse->expires_in + time()]);
        
        return $objResponse->access_token;
    }catch (Exception $e){
        echo "Failed to get Bing token";
    }
}

function openDBConnection()
{
    return pg_connect("dbname=unitranslate host=localhost user=idontknow password=koding");
}
