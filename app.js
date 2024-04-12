const express = require('express');
const axios = require('axios');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

// Inisialisasi Sequelize
const sequelize = new Sequelize('tugas', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

// Model untuk tabel 'weather_data'
const WeatherData = sequelize.define('weather_data', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lat: DataTypes.FLOAT,
    lon: DataTypes.FLOAT,
    timestamp: DataTypes.DATE,
    wind_u_surface: DataTypes.FLOAT,
    wind_u_800h: DataTypes.FLOAT,
    wind_u_300h: DataTypes.FLOAT,
    wind_v_surface: DataTypes.FLOAT,
    wind_v_800h: DataTypes.FLOAT,
    wind_v_300h: DataTypes.FLOAT,
    dewpoint_surface: DataTypes.FLOAT,
    dewpoint_800h: DataTypes.FLOAT,
    dewpoint_300h: DataTypes.FLOAT,
    pressure_surface: DataTypes.FLOAT
});

// Fungsi untuk mengambil data cuaca dari API dan menyimpannya ke dalam database
async function fetchDataAndSaveToDatabase() {
    try {
        // Definisikan kunci API Anda di sini
        const API_KEY = "lacxivUSMHwrOiSInubdIEuIrv5DoJEH";

        const requestData = {
            lat: 49.809,
            lon: 16.787,
            model: "gfs",
            parameters: ["wind", "dewpoint", "rh", "pressure"],
            levels: ["surface", "800h", "300h"],
            key: API_KEY // Gunakan kunci API yang sudah Anda tentukan
        };

        console.log('Mengirim permintaan ke API Windy...');
        const response = await axios.post('https://api.windy.com/api/point-forecast/v2', requestData);
        console.log('Respon dari API Windy:', response.data); // Log respons dari API Windy

        const weatherData = response.data;

        // Memformat data dari API ke dalam array yang sesuai dengan struktur tabel
        const formattedData = weatherData.ts.map((timestamp, index) => ({
            lat: requestData.lat,
            lon: requestData.lon,
            timestamp: new Date(timestamp),
            wind_u_surface: weatherData["wind_u-surface"][index],
            wind_u_800h: weatherData["wind_u-800h"][index],
            wind_u_300h: weatherData["wind_u-300h"][index],
            wind_v_surface: weatherData["wind_v-surface"][index],
            wind_v_800h: weatherData["wind_v-800h"][index],
            wind_v_300h: weatherData["wind_v-300h"][index],
            dewpoint_surface: weatherData["dewpoint-surface"][index],
            dewpoint_800h: weatherData["dewpoint-800h"][index],
            dewpoint_300h: weatherData["dewpoint-300h"][index],
            pressure_surface: weatherData["pressure-surface"][index]
        }));

        console.log(`Menyimpan ${formattedData.length} entri ke dalam database...`);
        await WeatherData.bulkCreate(formattedData);
        console.log('Data cuaca berhasil disimpan ke dalam database');
    } catch (error) {
        console.error('Gagal mendapatkan data cuaca:', error.message);
        throw error;
    }
}

// Fungsi untuk menjalankan fetchDataAndSaveToDatabase setiap satu jam
function fetchDataAndUpdateDatabaseHourly() {
    // Panggil fetchDataAndSaveToDatabase pertama kali saat server dijalankan
    fetchDataAndSaveToDatabase();
    // Set interval untuk menjalankan fungsi setiap satu jam
    setInterval(fetchDataAndSaveToDatabase, 3600000); // 3600000 milidetik = 1 jam
}

// Panggil fungsi untuk memulai pengambilan data dan pembaruan database setiap satu jam
fetchDataAndUpdateDatabaseHourly();

// Sinkronkan model dengan database dan jalankan server
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Gagal melakukan sinkronisasi tabel:', err);
        process.exit(1);
    });
