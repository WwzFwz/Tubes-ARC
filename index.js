const express = require('express');
const axios = require('axios');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

// Koneksi ke database MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Ganti dengan kata sandi database Anda jika ada
    database: 'tugas'
});

// Fungsi untuk menangani kesalahan koneksi
function handleDatabaseError(err) {
    console.error('Koneksi ke database gagal:', err);
    process.exit(1); // Keluar dari program jika koneksi gagal
}

// Mencoba untuk terhubung ke database
connection.connect((err) => {
    if (err) {
        handleDatabaseError(err); // Panggil fungsi untuk menangani kesalahan
    }
    console.log('Berhasil terhubung ke database MySQL');
});

// Fungsi untuk mengambil data cuaca dari API
async function fetchWeatherData() {
    try {
        const requestData = {
            lat: 49.809,
            lon: 16.787,
            model: "gfs",
            parameters: ["wind", "dewpoint", "rh", "pressure"],
            levels: ["surface", "800h", "300h"],
            key: "lacxivUSMHwrOiSInubdIEuIrv5DoJEH"
        };

        const response = await axios.post('https://api.windy.com/api/point-forecast/v2', requestData);
        const weatherData = response.data;

        // Simpan data cuaca ke dalam database MySQL
        const sql = `INSERT INTO weather_data (lat, lon, wind_speed, dewpoint, rh, pressure) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [requestData.lat, requestData.lon, weatherData.wind.speed, weatherData.dewpoint.value, weatherData.rh.value, weatherData.pressure.value];

        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error('Gagal menyimpan data cuaca ke database:', err);
                return;
            }
            console.log('Data cuaca berhasil disimpan ke database');
        });
    } catch (error) {
        console.error('Gagal mendapatkan data cuaca:', error.message);
    }
}

// Endpoint untuk mengakses data cuaca
app.get('/weather', (req, res) => {
    res.send('Data cuaca sedang diambil, silakan cek kembali dalam beberapa saat.');
});

// Memulai server dan mencoba untuk mengambil data cuaca
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    fetchWeatherData(); // Panggil fungsi untuk mengambil data cuaca
});
