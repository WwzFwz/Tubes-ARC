const TelegramBot = require("node-telegram-bot-api");
const token = "6286409190:AAEG9vr9Wp2wdU1-MGsC8Z2EkMotTHjYR60"; // Ganti dengan token bot Anda

const options = {
    polling: true
};
const pancarbot = new TelegramBot(token, options);

// Fungsi untuk memeriksa nilai variabel x dan mengirim pesan jika lebih besar dari 5
function cekDanKirimPesan(a,b,c,d,e,f,g,h,i,j) {
    const nomorPenerima = "1919601332"; // Nomor telepon penerima
    const pesan = "PERINGATAN!!! TERJADI PERUBAHAN CUACA YANG CUKUP EKSTREM. SEGERA MASUK KE RUMAH UNTUK ANDA DAN BERLINDUNG!."; // Pesan yang akan dikirim
    if (a >9 || b>9 || c>9 || d>9 || e>9 || f>9 || g>9 || h>9 || i>9 || j>9) {
        pancarbot.sendMessage(nomorPenerima, pesan).then(() => {
            console.log("Pesan berhasil dikirim.");
        }).catch((error) => {
            console.error("Gagal mengirim pesan:", error);
        });
    }
}

// Set interval untuk memanggil fungsi cekDanKirimPesan setiap 1 jam
setInterval(() => {
    let a = 2,
        b = 3,
        c = 5,
        d = 6,
        e = 1,
        f = 5,
        g = 6,
        h = 7,
        i = 10,
        j = 6; //Akan diisi dengan nilai PERUBAHAN variabel cuacanya
;
    cekDanKirimPesan(a,b,c,d,e,f,g,h,i,j);
}, 3600000); //
