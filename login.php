<?php

require_once("config.php");

if (isset($_POST['login'])) {

    // melakukan filter input
    $username = strip_tags(filter_input(INPUT_POST, 'username'));
    $password = filter_input(INPUT_POST, 'password');

    // menyiapkan query
    $sql = "SELECT * FROM users WHERE username=:username OR email=:email";
    $stmt = $db->prepare($sql);

    // bind parameter ke query
    $params = array(
        ":username" => $username,
        ":email" => $username,
    );
    $stmt->execute($params);

    // mengambil data user
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if($user) {
        // verifikasi password
        if(password_verify($password, $user["password"])) {
            // membuat session
            session_start();
            $_SESSION["user"] = $user;
            header("Location: timeline.php");
        }
    }
}   
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="./Tubes-ARC/Login 4 + Sign up/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="./Tubes-ARC/Login 4 + Sign up/style.css">
    <title>Pancar </title>
</head>
<body>

    <nav>
        <div class="wrapper">
            <div class="logo"><a href=''>PANCAR</a></div>
            <div class="menu">
                <ul>
                    <li><a href="#home">Beranda</a></li>
                    <li><a href="#berita">Berita</a></li>
                    <li><a href="#contact">Kontak</a></li>
                </ul>
            </div>
        </div>
    </nav>




    <!-- --------------------- Main  ------------------------ -->

    <div class="container d-flex justify-content-center align-items-center min-vh=100">

    <!----------------------- Login  -------------------------->

        <div class="row border rounded-5 p-3 bg-white shadow box-area ">

    <!--------------------------- Left Box ----------------------------->
        
        <div class="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box"style="background : #103cbe">
            <div class="featured-image mb-3 ">
                <img src="./Tubes-ARC/Login 4 + Sign up/images/forecast.jpeg" class="img-fluid" style="width: 250px;">
            </div>
            <p class="text-white fs-2"style="font-family : 'Courieer New', Courier, monospace; font-weight : 600">Pancar</p>
            <small class="text-white text-wrap text-center" style="width: 17rem;font-family : 'Courieer New', Courier, monospace;">Help you to know the weather in your area</small>

        </div>


    <!-------------------- ------ Right Box ---------------------------->
        <div class="col-md-6 right-box">
            <div class="row align-items-center">
                <div class="header-text mb-4">
                    <p>Hello There!</p>
                    <p>Welcome to our page</p>
                </div>
                <div class="input-group mb-3">
                    <input type="text" name="username" class="form-control form-control-lg bg-light fs-6" placeholder = "Username atau email">
                </div>

                <div class="input-group mb-1">
                    <input type="text" name="password" class="form-control form-control-lg bg-light fs-6"placeholder = "Password">
                </div>
                <!--
                <div class="input-group mb-5 d-flex justify-content-between">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="formCheck" >
                        <label for="formCheck" class="form-check-label text-secondary"><small>Remember Me</small></label>
                    </div>
                    
                    <div class="forgot">
                        <small><a href="#">Forgot Password?</a></small>
                    </div>
                    -->
                </div>

                <div class="input-group mb-3 ">
                    <button class="btn btn-lg bt-primary w-100 fs-6" type="submit" name="login">Login</button>
                </div>
                <!--
                <div class="input-group mb-3 ">
                    <button class="btn btn-lg bt-primary w-100 fs-6" ><img src="./Tubes-ARC/Login 4 + Sign up/images/google.png" style="width: 20px;" class="me-2"><small>Sign In with Google</small></button>
                </div>
                -->
                <div class="row">
                    <small>Don't Have an Account? <a href="register.php">Sign Up</a></small>
                </div>

            </div>

                
        </div>

        </div>

    </div>

</body>
</html>