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

// Asumsi tabel dalam database MySQL memiliki kolom-kolom berikut:
// id (auto_increment), lat, lon, timestamp, wind_u_surface, wind_u_800h, wind_u_300h, wind_v_surface, wind_v_800h, wind_v_300h, dewpoint_surface, dewpoint_800h, dewpoint_300h, rh_surface, rh_800h, rh_300h, pressure_surface

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

        // Memformat data dari API ke dalam array yang sesuai dengan struktur tabel
        const formattedData = weatherData.ts.map((timestamp, index) => ({
            lat: requestData.lat,
            lon: requestData.lon,
            timestamp,
            wind_u_surface: weatherData["wind_u-surface"][index],
            wind_u_800h: weatherData["wind_u-800h"][index],
            wind_u_300h: weatherData["wind_u-300h"][index],
            wind_v_surface: weatherData["wind_v-surface"][index],
            wind_v_800h: weatherData["wind_v-800h"][index],
            wind_v_300h: weatherData["wind_v-300h"][index],
            dewpoint_surface: weatherData["dewpoint-surface"][index],
            dewpoint_800h: weatherData["dewpoint-800h"][index],
            dewpoint_300h: weatherData["dewpoint-300h"][index],
            rh_surface: weatherData["rh-surface"][index],
            rh_800h: weatherData["rh-800h"][index],
            rh_300h: weatherData["rh-300h"][index],
            pressure_surface: weatherData["pressure-surface"][index]
        }));

        // Menyimpan data ke dalam database MySQL
        const sql = `INSERT INTO weather_data (lat, lon, timestamp, wind_u_surface, wind_u_800h, wind_u_300h, wind_v_surface, wind_v_800h, wind_v_300h, dewpoint_surface, dewpoint_800h, dewpoint_300h, rh_surface, rh_800h, rh_300h, pressure_surface) VALUES ?`;
        const values = [formattedData.map(row => [row.lat, row.lon, new Date(row.timestamp), row.wind_u_surface, row.wind_u_800h, row.wind_u_300h, row.wind_v_surface, row.wind_v_800h, row.wind_v_300h, row.dewpoint_surface, row.dewpoint_800h, row.dewpoint_300h, row.rh_surface, row.rh_800h, row.rh_300h, row.pressure_surface])];

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