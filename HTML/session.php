<?php

error_reporting(E_ALL);
if (is_null($_GET["meeting"]) && !is_null($_GET["username"])) {
    
    //Start a new room
    $randPin = "";
    for ($i = 1;$i<=9;$i++) {
        $randPin .= rand(0,9);
        if ($i%3 == 0) {
            $randPin .= "-";
        }
    }
    
    $randPin = substr($randPin,0,-1);
    
    if (!doesRoomExist($randPin)) {
        $pg = openDBConnection();
        $result = pg_insert($pg,"sessions",["name" =>$randPin]);
        if(!$result){
            echo "fail";
            exit();
        }
        pg_close($pg);
        addUserToSession($_GET["username"],$randPin);
        if ($result) {
            echo $randPin;
            exit();
        }
    }
    
    
}else if (!is_null($_GET["meeting"]) && !is_null($_GET["username"])) {
    
    //Look for existing room
    if (doesRoomExist($_GET["meeting"])) {
       addUserToSession($_GET["username"], $_GET["meeting"]);
       echo $_GET["meeting"];
       exit();
    }
    
}

echo "fail";
exit();

//Not proper database format, but eh, sue me
//Do a check before inserting!! No time for validation!
//Though it looks like pg_insert takes care of it for you
function addUserToSession($user,$room)
{
    $pg = openDBConnection();
    $result = pg_insert($pg,"room_user",["session" => $room,"name" => $user]);
    pg_close($pg);
    return $result;
}

function openDBConnection()
{
    return pg_connect("dbname=unitranslate host=localhost user=idontknow password=koding");
}

//Checks if a room already exist
function doesRoomExist($room)
{
    $pg = openDBConnection();
    $mv_action = pg_escape_literal($room);
    $result = pg_query($pg,"SELECT count(*) FROM sessions WHERE name = $mv_action");
    $result = pg_fetch_result($result,0,0);
    if($result > 0){
        return true;
    }
    return false;
}