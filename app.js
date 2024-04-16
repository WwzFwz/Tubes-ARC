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
    location_name: DataTypes.STRING, // Tambah kolom untuk keterangan kota
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

// Daftar lokasi yang ingin diambil data cuacanya
const locations = [
    { name: 'Jakarta', lat: -6.2088, lon: 106.8456 },
    { name: 'Bandung', lat: -6.9175, lon: 107.6191 },
    { name: 'Malang', lat: -7.9778, lon: 112.6347 },
    { name: 'Surabaya', lat: -7.2575, lon: 112.7521 },
    { name: 'Makassar', lat: -5.1477, lon: 119.4327 },
    { name: 'Palu', lat: -0.9136, lon: 119.8707 },
    { name: 'Gorontalo', lat: 0.5433, lon: 123.0568 },
    { name: 'Medan', lat: 3.5952, lon: 98.6722 },
    { name: 'Kendari', lat: -3.9778, lon: 122.5156 }
];

// Fungsi untuk mengambil data cuaca dari API dan menyimpannya ke dalam database
async function fetchDataAndSaveToDatabase(location) {
    try {
        // Definisikan kunci API Anda di sini
        const API_KEY = "vYE7OJUE1u0vGVWwz4RsM4FG7mnXDsDN";

        const requestData = {
            lat: location.lat,
            lon: location.lon,
            model: "gfs",
            parameters: ["wind", "dewpoint", "rh", "pressure"],
            levels: ["surface", "800h", "300h"],
            key: API_KEY // Gunakan kunci API yang sudah Anda tentukan
        };

        console.log(`Mengambil data cuaca di ${location.name}...`);
        const response = await axios.post('https://api.windy.com/api/point-forecast/v2', requestData);
        console.log(`Respon dari API Windy untuk ${location.name}:`, response.data); // Log respons dari API Windy

        const weatherData = response.data;

        // Memformat data dari API ke dalam array yang sesuai dengan struktur tabel
        const formattedData = weatherData.ts.map((timestamp, index) => ({
            location_name: location.name, // Tambahkan keterangan kota
            lat: location.lat,
            lon: location.lon,
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
        console.log(`Data cuaca ${location.name} berhasil disimpan ke dalam database`);
    } catch (error) {
        console.error(`Gagal mendapatkan data cuaca untuk ${location.name}:`, error.message);
        throw error;
    }
}

// Fungsi untuk menjalankan fetchDataAndSaveToDatabase untuk setiap lokasi
async function fetchDataAndUpdateDatabaseHourly() {
    for (const location of locations) {
        await fetchDataAndSaveToDatabase(location);
    }
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
