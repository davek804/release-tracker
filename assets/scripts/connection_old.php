<?php

whatAreWeDoing();

function whatAreWeDoing() {
    $operation = $_GET['request'];

    if ($operation == "initialLoad") {
        fetchWins();
    }

    if ($operation == "addPoints") {
        $user = $_GET['user'];
        addPoints($user);
    }

    if ($operation == "details") {
        fetchDetails();
    }

    if ($operation == "updateDetails") {
        $id = $_GET['id'];
        $newDetails = $_GET['newDetails'];
        updateDetails($id, $newDetails);
    }

}

function fetchWins() {
    $mysqli = new mysqli("localhost", "frehud_agg", "Testing1", "frehud_aggravation");
    if ($mysqli -> connect_errno) {
        echo "Failed to connect to MySQL: (".$mysqli -> connect_errno.") ".$mysqli -> connect_error;
    }
    //echo "Connection Successful!\n"; //"$mysqli->host_info . "\n";" 
    if ($result = $mysqli -> query("select user as user, count(*) as wins from wins group by user")) {
            //printf("Select returned %d rows.\n", $result -> num_rows);
        if($result === FALSE) { 
            die(mysql_error());
        }
        while($row = $result->fetch_array())
        {
            echo $row['user'];
            echo "|";
            echo $row['wins'];
            echo "\n";
        }   
        $result -> close();
    } 
}

function fetchDetails() {
    $mysqli = new mysqli("localhost", "frehud_agg", "Testing1", "frehud_aggravation");
    if ($mysqli -> connect_errno) {
        echo "Failed to connect to MySQL: (".$mysqli -> connect_errno.") ".$mysqli -> connect_error;
    }
    //echo "Connection Successful\n"; //"$mysqli->host_info . "\n";" 
    if ($result = $mysqli -> query("select * from wins")) {
            //printf("Select returned %d rows.\n", $result -> num_rows);
        if($result === FALSE) { 
            die(mysql_error());
            echo $result;
        }
        $rows = array();
        while($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        echo json_encode($rows); 
        $result -> close();
    } 
}

function addPoints($user) {
    $mysqli = new mysqli("localhost", "frehud_agg", "Testing1", "frehud_aggravation");
    if ($mysqli -> connect_errno) {
        echo "Failed to connect to MySQL: (".$mysqli -> connect_errno.") ".$mysqli -> connect_error;
    }
    //echo "Connection Successful!\n"; //"$mysqli->host_info . "\n";" 
    if ($result = $mysqli -> query("insert into wins (user) values (\"$user\")")) {
            //echo "Select returned %d rows.\n", $result -> num_rows;
            //echo $result;
        if($result === FALSE) { 
            die(mysql_error());
        } else {
                //echo "Inserted one win for: " . $user . ".\n";
            echo $user;
        }   
            //$result -> close();
    //echo "End adding points!";
    }

}

function updateDetails($id, $newDetails) {
    $mysqli = new mysqli("localhost", "frehud_agg", "Testing1", "frehud_aggravation");
    if ($mysqli -> connect_errno) {
        echo "Failed to connect to MySQL: (".$mysqli -> connect_errno.") ".$mysqli -> connect_error;
    }
    //echo "Connection Successful!\n"; //"$mysqli->host_info . "\n";" 
    if ($result = $mysqli -> query("update wins set details = (\"$newDetails\") where id = (\"$id\")")) {
            echo "Select returned %d rows.\n", $result -> num_rows;
            echo $result;
        if($result === FALSE) { 
            die(mysql_error());
        } else {
                echo "Inserted new detail for: " . $user . ".\n";
        }   
        $result -> close();
    //echo "End adding points!";
    }

}

?>