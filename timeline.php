<?php require_once("auth.php"); ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PANCAR</title>
    <link rel="stylesheet" href="timeline.css">
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
                    <li><a href="" class="tbl-biru">Login</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="wrapper">
        <!-- untuk BERANDA -->
        <section id="home">
            <img src="https://img.freepik.com/free-vector/meteorology-abstract-concept-vector-illustration-met-station-meteorology-program-university-degree-weather-prediction-method-measuring-instruments-atmosphere-study-abstract-metaphor_335657-1980.jpg?w=740&t=st=1711556616~exp=1711557216~hmac=78ebaf4c79ed162ab7be5b613553d8092d7aea340c96f82bafdd20469b67f052"/>
            <div class="kolom">
                <p class="deskripsi">....</p>
                <h2>Tetap Sehat, Tetap Semangat</h2>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt, nobis.</p>
                <p><a href="" class="tbl-pink">Pelajari Lebih Lanjut</a></p>
            </div>
        </section>

        <!-- untuk BERITA -->
        <section id="berita">
            <div class="kolom">
                <p class="deskripsi">You Will Need This</p>
                <h2>...</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed deserunt voluptatibus possimus blanditiis reiciendis. Qui, facilis! Delectus exercitationem dolores sapiente?</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed deserunt voluptatibus possimus blanditiis reiciendis. Qui, facilis! Delectus exercitationem dolores sapiente?</p>
                <p><a href="" class="tbl-biru">Pelajari Lebih Lanjut</a></p>
            </div>
            <img src="https://img.freepik.com/premium-vector/cloud-computing-with-man-using-a-smartphone_951778-1155.jpg?w=740"/>
        </section>

    <div id="contact">
        <div class="wrapper">
            <div class="footer">
                <div class="footer-section">
                    <h3>PANCAR</h3>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint, culpa!</p>
                </div>
                <div class="footer-section">
                    <h3>About</h3>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint, culpa!</p>
                </div>
                <div class="footer-section">
                    <h3>Kontak</h3>
                    <p>-</p>
                    <p>-</p>
                </div>

            </div>
        </div>
    </div>

    <div id="copyright">
        <div class="wrapper">
            &copy; 2024. <b>PANCAR</b> All Rights Reserved.
        </div>
    </div>
    
</body>
</html>