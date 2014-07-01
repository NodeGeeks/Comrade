<?php
	/**
	 * sends mail submitted from the contact form
	 */
    
    /*
        EDIT BELOW
     */
    $to_Email       = "example123@example.com"; //Replace with your email address
    $subject        = 'Email sent from delicious mail'; //Subject line for emails
    /*
        EDIT ABOVE
     */


	if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest')
		die("No direct access.");

	if(!isset($_POST["name"]) || !isset($_POST["email"]) || !isset($_POST["message"])) {
	    $output = json_encode(array('type'=>'error', 'text' => 'Input fields are empty!'));
	    die($output);
	}

	//additional validation
    $user_Name        = filter_var($_POST["name"], FILTER_SANITIZE_STRING);
    $user_Email       = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $user_Message     = filter_var($_POST["message"], FILTER_SANITIZE_STRING);

    if(strlen($user_Name)<4) {
        $output = json_encode(array('type'=>'error', 'text' => 'Name is too short or empty!'));
        die($output);
    }
    if(!filter_var($user_Email, FILTER_VALIDATE_EMAIL)) {
        $output = json_encode(array('type'=>'error', 'text' => 'Please enter a valid email!'));
        die($output);
    }
    if(strlen($user_Message)<5) {
        $output = json_encode(array('type'=>'error', 'text' => 'Too short message! Please enter something.'));
        die($output);
    }

    $sentMail = @mail($to_Email, $subject, $user_Message .'  -'.$user_Name, $headers);
   
    if(!$sentMail) {
        $output = json_encode(array('type'=>'error', 'text' => 'Server error, could not send email. Sorry for the inconvenience.'));
        die($output);
    } else {
        $output = json_encode(array('type'=>'success', 'text' => 'Message successfully sent!'));
        die($output);
    }
?>