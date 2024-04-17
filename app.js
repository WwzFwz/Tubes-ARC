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
    { name: 'Surabaya', lat: -7.2575, lon: 112.7521 },
    { name: 'Medan', lat: 3.5952, lon: 98.6722 },
    { name: 'Bandung', lat: -6.9175, lon: 107.6191 },
    { name: 'Makassar', lat: -5.1477, lon: 119.4327 },
    { name: 'Semarang', lat: -6.9932, lon: 110.4203 },
    { name: 'Palembang', lat: -2.9761, lon: 104.7755 },
    { name: 'Depok', lat: -6.4025, lon: 106.7942 },
    { name: 'Tangerang', lat: -6.178, lon: 106.63 },
    { name: 'Surakarta', lat: -7.5598, lon: 110.8547 },
    { name: 'Padang', lat: -0.9471, lon: 100.4172 },
    { name: 'Bandar Lampung', lat: -5.4254, lon: 105.258 },
    { name: 'Bekasi', lat: -6.2383, lon: 106.9756 },
    { name: 'Banjarmasin', lat: -3.3194, lon: 114.5907 },
    { name: 'Pekanbaru', lat: 0.5071, lon: 101.4476 },
    { name: 'Denpasar', lat: -8.6525, lon: 115.2193 },
    { name: 'Malang', lat: -7.9778, lon: 112.6347 },
    { name: 'Yogyakarta', lat: -7.8014, lon: 110.3648 },
    { name: 'Pontianak', lat: -0.0236, lon: 109.34 },
    { name: 'Samarinda', lat: -0.4876, lon: 117.1452 },
    { name: 'Balikpapan', lat: -1.2675, lon: 116.8289 },
    { name: 'Jambi', lat: -1.6113, lon: 103.6158 },
    { name: 'Mataram', lat: -8.5831, lon: 116.1036 },
    { name: 'Bogor', lat: -6.5944, lon: 106.7892 },
    { name: 'Cimahi', lat: -6.8724, lon: 107.5423 },
    { name: 'Pekalongan', lat: -6.8886, lon: 109.6756 },
    { name: 'Padang', lat: -0.9471, lon: 100.4172 },
    { name: 'Tasikmalaya', lat: -7.3272, lon: 108.2208 },
    { name: 'Banjar', lat: -7.3691, lon: 108.5343 },
    { name: 'Magelang', lat: -7.4698, lon: 110.2178 },
    { name: 'Sukabumi', lat: -6.9181, lon: 106.9267 },
    { name: 'Serang', lat: -6.1127, lon: 106.1504 },
    { name: 'Kupang', lat: -10.1785, lon: 123.607 },
    { name: 'Karawang', lat: -6.3031, lon: 107.2897 },
    { name: 'Palu', lat: -0.9136, lon: 119.8707 },
    { name: 'Kendari', lat: -3.9778, lon: 122.5156 },
    { name: 'Tegal', lat: -6.8694, lon: 109.1402 },
    { name: 'Binjai', lat: 3.6204, lon: 98.5004 },
    { name: 'Purwokerto', lat: -7.428, lon: 109.2362 },
    { name: 'Pematangsiantar', lat: 2.9595, lon: 99.0687 },
    { name: 'Cirebon', lat: -6.7323, lon: 108.5519 },
    { name: 'Kediri', lat: -7.8166, lon: 112.0116 },
    { name: 'Bengkulu', lat: -3.8006, lon: 102.2655 },
    { name: 'Banda Aceh', lat: 5.5469, lon: 95.3238 },
    { name: 'Palangka Raya', lat: -2.2067, lon: 113.9177 },
    { name: 'Langsa', lat: 4.4761, lon: 97.968 },
    { name: 'Kendari', lat: -3.9778, lon: 122.5156 },
    { name: 'Solok', lat: -0.7893, lon: 100.6522 },
    { name: 'Ternate', lat: 0.8009, lon: 127.3846 },
    { name: 'Prabumulih', lat: -3.4333, lon: 104.2302 },
    { name: 'Bontang', lat: 0.1241, lon: 117.4761 },
    { name: 'Lubuklinggau', lat: -3.2887, lon: 102.8614 },
    { name: 'Salatiga', lat: -7.3328, lon: 110.4926 },
    { name: 'Singkawang', lat: 0.9128, lon: 109.0094 },
    { name: 'Blitar', lat: -8.1013, lon: 112.168 },
    { name: 'Kendal', lat: -7.0271, lon: 110.1821 },
    { name: 'Bitung', lat: 1.4552, lon: 125.1889 },
    { name: 'Pariaman', lat: -0.6367, lon: 100.1209 },
    { name: 'Tanjung Pinang', lat: 0.9226, lon: 104.4537 },
    { name: 'Madiun', lat: -7.6298, lon: 111.5238 },
    { name: 'Lhokseumawe', lat: 5.1801, lon: 97.1507 },
    { name: 'Banjarbaru', lat: -3.4167, lon: 114.8333 },
    { name: 'Pangkal Pinang', lat: -2.1333, lon: 106.1333 },
    { name: 'Subulussalam', lat: 2.649, lon: 98.8663 },
    { name: 'Pasuruan', lat: -7.6467, lon: 112.8998 },
    { name: 'Tanjungbalai', lat: 2.9664, lon: 99.7988 },
    { name: 'Magelang', lat: -7.4698, lon: 110.2178 },
    { name: 'Denpasar', lat: -8.6525, lon: 115.2193 },
    { name: 'Sidoarjo', lat: -7.4478, lon: 112.7183 },
    { name: 'Dumai', lat: 1.6833, lon: 101.45 },
    { name: 'Samarinda', lat: -0.4876, lon: 117.1452 },
    { name: 'Mojokerto', lat: -7.4726, lon: 112.4301 },
    { name: 'Baturaja', lat: -4.1333, lon: 104.1667 },
    { name: 'Bima', lat: -8.4667, lon: 118.7167 },
    { name: 'Sorong', lat: -0.8833, lon: 131.25 },
    { name: 'Tanjung Redeb', lat: 2.05, lon: 117.3167 },
    { name: 'Sumedang', lat: -6.85, lon: 107.9167 },
    { name: 'Sibolga', lat: 1.75, lon: 98.7833 },
    { name: 'Lhokseumawe', lat: 5.1801, lon: 97.1507 },
    { name: 'Manado', lat: 1.487, lon: 124.8455 },
    { name: 'Pasuruan', lat: -7.6467, lon: 112.8998 },
    { name: 'Palopo', lat: -2.9833, lon: 120.2 },
    { name: 'Kotabumi', lat: -4.8333, lon: 104.8833 },
    { name: 'Lubuk Pakam', lat: 3.55, lon: 98.8333 },
    { name: 'Padang Sidempuan', lat: 1.3833, lon: 99.25 },
    { name: 'Luwuk', lat: -0.95, lon: 122.7833 },
    { name: 'Rantepao', lat: -2.9667, lon: 119.9 },
    { name: 'Kutacane', lat: 3.4667, lon: 97.8667 },
    { name: 'Sengkang', lat: -4.1333, lon: 120.0333 },
    { name: 'Langsa', lat: 4.4761, lon: 97.968 },
    { name: 'Pangkalanbuun', lat: -2.6833, lon: 111.6167 },
    { name: 'Banjar', lat: -7.3691, lon: 108.5343 },
    { name: 'Praya', lat: -8.7167, lon: 116.2833 },
    { name: 'Teluk Nibung', lat: 4.2167, lon: 100.6333 },
    { name: 'Kutacane', lat: 3.4667, lon: 97.8667 },
    { name: 'Tarakan', lat: 3.3, lon: 117.6333 },
    { name: 'Cilacap', lat: -7.7167, lon: 109.0167 },
    { name: 'Martapura', lat: -3.4167, lon: 114.8333 },
    { name: 'Tanjungpandan', lat: -2.75, lon: 107.65 },
    { name: 'Bukittinggi', lat: -0.3, lon: 100.3667 },
    { name: 'Baturaja', lat: -4.1333, lon: 104.1667 },
    { name: 'Martapura', lat: -3.4167, lon: 114.8333 },
    { name: 'Purwakarta', lat: -6.5569, lon: 107.4396 },
    { name: 'Praya', lat: -8.7167, lon: 116.2833 },
    { name: 'Prigen', lat: -7.6431, lon: 112.5954 },
    { name: 'Sungaipenuh', lat: -2.0833, lon: 101.3833 },
    { name: 'Tanjungbalai', lat: 2.9664, lon: 99.7988 },
    { name: 'Padang Sidempuan', lat: 1.3833, lon: 99.25 },
    { name: 'Payakumbuh', lat: -0.2167, lon: 100.6333 },
    { name: 'Solok', lat: -0.7893, lon: 100.6522 },
    { name: 'Baturaja', lat: -4.1333, lon: 104.1667 },
    { name: 'Metro', lat: -5.1131, lon: 105.3067 },
    { name: 'Banyuwangi', lat: -8.2251, lon: 114.3695 },
    { name: 'Sungailiat', lat: -1.85, lon: 106.1333 },
    { name: 'Luwuk', lat: -0.95, lon: 122.7833 },
    { name: 'Bengkulu', lat: -3.8006, lon: 102.2655 },
    { name: 'Ruteng', lat: -8.6, lon: 120.4667 },
    { name: 'Sijunjung', lat: -0.7, lon: 100.95 },
    { name: 'Bengkulu', lat: -3.8006, lon: 102.2655 },
    { name: 'Praya', lat: -8.7167, lon: 116.2833 },
    { name: 'Praya', lat: -8.7167, lon: 116.2833 },
    { name: 'Tanjungbalai', lat: 2.9664, lon: 99.7988 },
    { name: 'Pasuruan', lat: -7.6467, lon: 112.8998 },
    { name: 'Lubuk Pakam', lat: 3.55, lon: 98.8333 },
    { name: 'Tanjung Pinang', lat: 0.9226, lon: 104.4537 },
    { name: 'Kendal', lat: -7.0271, lon: 110.1821 },
    { name: 'Pariaman', lat: -0.6367, lon: 100.1209 },
    { name: 'Manado', lat: 1.487, lon: 124.8455 },
    { name: 'Tanjung Pinang', lat: 0.9226, lon: 104.4537 },
    { name: 'Bontang', lat: 0.1241, lon: 117.4761 },
    { name: 'Cirebon', lat: -6.7323, lon: 108.5519 },
    { name: 'Pekanbaru', lat: 0.5071, lon: 101.4476 },
    { name: 'Denpasar', lat: -8.6525, lon: 115.2193 },
    { name: 'Samarinda', lat: -0.4876, lon: 117.1452 },
    { name: 'Mojokerto', lat: -7.4726, lon: 112.4301 },
    { name: 'Baturaja', lat: -4.1333, lon: 104.1667 },
    { name: 'Bima', lat: -8.4667, lon: 118.7167 },
    { name: 'Sorong', lat: -0.8833, lon: 131.25 },
    { name: 'Tanjung Redeb', lat: 2.05, lon: 117.3167 },
    { name: 'Sumedang', lat: -6.85, lon: 107.9167 },
    { name: 'Sibolga', lat: 1.75, lon: 98.7833 },
    { name: 'Lhokseumawe', lat: 5.1801, lon: 97.1507 },
    { name: 'Manado', lat: 1.487, lon: 124.8455 },
    { name: 'Pasuruan', lat: -7.6467, lon: 112.8998 },
    { name: 'Palopo', lat: -2.9833, lon: 120.2 },
    { name: 'Kotabumi', lat: -4.8333, lon: 104.8833 },
    { name: 'Lubuk Pakam', lat: 3.55, lon: 98.8333 },
    { name: 'Padang Sidempuan', lat: 1.3833, lon: 99.25 },
    { name: 'Luwuk', lat: -0.95, lon: 122.7833 },
    { name: 'Rantepao', lat: -2.9667, lon: 119.9 },
    { name: 'Kutacane', lat: 3.4667, lon: 97.8667 },
    { name: 'Sengkang', lat: -4.1333, lon: 120.0333 },
    { name: 'Langsa', lat: 4.4761, lon: 97.968 },
    { name: 'Pangkalanbuun', lat: -2.6833, lon: 111.6167 },
    { name: 'Banjar', lat: -7.3691, lon: 108.5343 },
    { name: 'Praya', lat: -8.7167, lon: 116.2833 },
    { name: 'Teluk Nibung', lat: 4.2167, lon: 100.6333 },
    { name: 'Kutacane', lat: 3.4667, lon: 97.8667 },
    { name: 'Tarakan', lat: 3.3, lon: 117.6333 },
    { name: 'Cilacap', lat: -7.7167, lon: 109.0167 },
    { name: 'Martapura', lat: -3.4167, lon: 114.8333 },
    { name: 'Tanjungpandan', lat: -2.75, lon: 107.65 },
    { name: 'Bukittinggi', lat: -0.3, lon: 100.3667 },
    { name: 'Baturaja', lat: -4.1333, lon: 104.1667 },
    { name: 'Martapura', lat: -3.4167, lon: 114.8333 },
    { name: 'Purwakarta', lat: -6.5569, lon: 107.4396 },
    { name: 'Praya', lat: -8.7167, lon: 116.2833 },
    { name: 'Prigen', lat: -7.6431, lon: 112.5954 },
    { name: 'Sungaipenuh', lat: -2.0833, lon: 101.3833 },
    { name: 'Tanjungbalai', lat: 2.9664, lon: 99.7988 },
    { name: 'Padang Sidempuan', lat: 1.3833, lon: 99.25 },
    { name: 'Payakumbuh', lat: -0.2167, lon: 100.6333 },
    { name: 'Solok', lat: -0.7893, lon: 100.6522 },
    { name: 'Baturaja', lat: -4.1333, lon: 104.1667 },
    { name: 'Metro', lat: -5.1131, lon: 105.3067 },
    { name: 'Banyuwangi', lat: -8.2251, lon: 114.3695 },
    { name: 'Sungailiat', lat: -1.85, lon: 106.1333 },
    { name: 'Luwuk', lat: -0.95, lon: 122.7833 },
    { name: 'Bengkulu', lat: -3.8006, lon: 102.2655 },
    { name: 'Ruteng', lat: -8.6, lon: 120.4667 },
    { name: 'Sijunjung', lat: -0.7, lon: 100.95 },
    { name: 'Bengkulu', lat: -3.8006, lon: 102.2655},
    { name: 'Ambon', lat: -3.6954, lon: 128.1832 },
    { name: 'Ternate', lat: 0.7922, lon: 127.363 },
    { name: 'Sorong', lat: -0.8833, lon: 131.25 },
    { name: 'Palu', lat: -0.8917, lon: 119.8707 },
    { name: 'Merauke', lat: -8.4667, lon: 140.3333 },
    { name: 'Jayapura', lat: -2.533, lon: 140.7 },
    { name: 'Biak', lat: -1.1617, lon: 136.0833 },
    { name: 'Sibolga', lat: 1.75, lon: 98.7833 },
    { name: 'Bukittinggi', lat: -0.3031, lon: 100.3689 },
    { name: 'Banda Aceh', lat: 5.5501, lon: 95.3239 },
    { name: 'Manokwari', lat: -0.8617, lon: 134.0622 },
    { name: 'Kupang', lat: -10.1737, lon: 123.5838 },
    { name: 'Waingapu', lat: -9.6567, lon: 120.2641 },
    { name: 'Amahai', lat: -3.3333, lon: 128.9167 },
    { name: 'Sorong', lat: -0.8761, lon: 131.2558 },
    { name: 'Sampit', lat: -2.5333, lon: 112.95 },
    { name: 'Kendari', lat: -3.9778, lon: 122.5156 },
    { name: 'Tarakan', lat: 3.3, lon: 117.6333 },
    { name: 'Mamuju', lat: -2.6775, lon: 118.8725 },
    { name: 'Manado', lat: 1.487, lon: 124.8455 },
    { name: 'Jambi City', lat: -1.6, lon: 103.6167 },
    { name: 'Nabire', lat: -3.3667, lon: 135.4833 },
    { name: 'Tanete', lat: -3.95, lon: 119.7333 },
    { name: 'Bima', lat: -8.4667, lon: 118.7167 },
    { name: 'Tual', lat: -5.6667, lon: 132.75 },
    { name: 'Tanjung Pinang', lat: 0.9226, lon: 104.4537 },
    { name: 'Bengkulu', lat: -3.8006, lon: 102.2655 },
    { name: 'Palopo', lat: -2.9833, lon: 120.2 },
    { name: 'Makale', lat: -3.0981, lon: 119.8424 },
    { name: 'Sorong', lat: -0.8563, lon: 131.264 },
    { name: 'Bangka', lat: -2.0193, lon: 106.1095 },
    { name: 'Waingapu', lat: -9.6567, lon: 120.2641 },
    { name: 'Sampit', lat: -2.5333, lon: 112.95 },
    { name: 'Sampit', lat: -2.5333, lon: 112.95 },
    { name: 'Sibolga', lat: 1.75, lon: 98.7833 },
    { name: 'Bukittinggi', lat: -0.3031, lon: 100.3689 },
    { name: 'Sorong', lat: -0.8761, lon: 131.2558 },
    { name: 'Kendari', lat: -3.9778, lon: 122.5156 },
    { name: 'Tarakan', lat: 3.3, lon: 117.6333 },
    { name: 'Mamuju', lat: -2.6775, lon: 118.8725 },
    { name: 'Manado', lat: 1.487, lon: 124.8455 },
    { name: 'Jambi City', lat: -1.6, lon: 103.6167 },
    { name: 'Nabire', lat: -3.3667, lon: 135.4833 },
    { name: 'Tanete', lat: -3.95, lon: 119.7333 },
    { name: 'Bima', lat: -8.4667, lon: 118.7167 },
    { name: 'Tual', lat: -5.6667, lon: 132.75 },
    { name: 'Tanjung Pinang', lat: 0.9226, lon: 104.4537 },
    { name: 'Bengkulu', lat: -3.8006, lon: 102.2655 },
    { name: 'Palopo', lat: -2.9833, lon: 120.2 },
    { name: 'Makale', lat: -3.0981, lon: 119.8424 },
    { name: 'Sorong', lat: -0.8563, lon: 131.264 },
    { name: 'Bangka', lat: -2.0193, lon: 106.1095 },
    { name: 'Sampit', lat: -2.5333, lon: 112.95 },
    { name: 'Sibolga', lat: 1.75, lon: 98.7833 },
    { name: 'Bukittinggi', lat: -0.3031, lon: 100.3689 },
    { name: 'Sorong', lat: -0.8761, lon: 131.2558 },
    { name: 'Kendari', lat: -3.9778, lon: 122.5156 },
    { name: 'Tarakan', lat: 3.3, lon: 117.6333 },
    { name: 'Mamuju', lat: -2.6775, lon: 118.8725 },
    { name: 'Manado', lat: 1.487, lon: 124.8455 },
    { name: 'Jambi City', lat: -1.6, lon: 103.6167 },
    { name: 'Nabire', lat: -3.3667, lon: 135.4833 },
    { name: 'Tanete', lat: -3.95, lon: 119.7333 },
    { name: 'Bima', lat: -8.4667, lon: 118.7167 },
    { name: 'Tual', lat: -5.6667, lon: 132.75 },
    { name: 'Tanjung Pinang', lat: 0.9226, lon: 104.4537 },
    { name: 'Bengkulu', lat: -3.8006, lon: 102.2655 },
    { name: 'Palopo', lat: -2.9833, lon: 120.2 },
    { name: 'Makale', lat: -3.0981, lon: 119.8424 },
    { name: 'Sorong', lat: -0.8563, lon: 131.264 },
    { name: 'Bangka', lat: -2.0193, lon: 106.1095 },
    { name: 'Sampit', lat: -2.5333, lon: 112.95 },
    { name: 'Sibolga', lat: 1.75, lon: 98.7833 },
    { name: 'Bukittinggi', lat: -0.3031, lon: 100.3689 },
    { name: 'Sorong', lat: -0.8761, lon: 131.2558 },
    { name: 'Kendari', lat: -3.9778, lon: 122.5156 },
    { name: 'Tarakan', lat: 3.3, lon: 117.6333 },
    { name: 'Mamuju', lat: -2.6775, lon: 118.8725 },
    { name: 'Manado', lat: 1.487, lon: 124.8455 },
    { name: 'Jambi City', lat: -1.6, lon: 103.6167 },
    { name: 'Nabire', lat: -3.3667, lon: 135.4833 },
    { name: 'Tanete', lat: -3.95, lon: 119.7333 },
    { name: 'Bima', lat: -8.4667, lon: 118.7167 },
    { name: 'Tual', lat: -5.6667, lon: 132.75 },
    { name: 'Tanjung Pinang', lat: 0.9226, lon: 104.4537 },
    { name: 'Bengkulu', lat: -3.8006, lon: 102.2655 },
    { name: 'Palopo', lat: -2.9833, lon: 120.2 },
    { name: 'Makale', lat: -3.0981, lon: 119.8424 },
    { name: 'Sorong', lat: -0.8563, lon: 131.264 },
    { name: 'Bangka', lat: -2.0193, lon: 106.1095 },
    { name: 'Sampit', lat: -2.5333, lon: 112.95 },
    { name: 'Sibolga', lat: 1.75, lon: 98.7833 },
    { name: 'Bukittinggi', lat: -0.3031, lon: 100.3689 },
    { name: 'Sorong', lat: -0.8761, lon: 131.2558 },
    { name: 'Kendari', lat: -3.9778, lon: 122.5156 },
    { name: 'Tarakan', lat: 3.3, lon: 117.6333 },
    { name: 'Mamuju', lat: -2.6775, lon: 118.8725 }
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
