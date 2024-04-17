const { Sequelize, DataTypes } = require('sequelize');

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
    location_name: DataTypes.STRING,
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

// Fungsi untuk mengambil data cuaca dari database berdasarkan nama kota dan menyimpannya dalam array datas
async function fetchDataAndSaveToArray(city) {
    try {
        console.log(`Mengambil data cuaca di ${city} dari database...`);
        const data = await WeatherData.findOne({ where: { location_name: city }, order: [['timestamp', 'DESC']] });

        if (data) {
            // Menyimpan data ke dalam array datas
            datas.push(data.toJSON());
            console.log(`Data cuaca ${city} berhasil disimpan dalam array datas`);
            console.log("Array datas:", datas);
        } else {
            console.error(`Data cuaca untuk ${city} tidak ditemukan dalam database`);
        }
    } catch (error) {
        console.error(`Gagal mendapatkan data cuaca untuk ${city} dari database:`, error);
        throw error;
    }
}

// Array untuk menyimpan data cuaca
let datas = [];

// Panggil fungsi untuk mengambil data cuaca dari database dan menyimpannya dalam array datas saat formulir dikirim
document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Mencegah pengiriman formulir yang normal
    const cityName = document.getElementById('cityName').value;
    if(cityName.trim() !== '') {
        await fetchDataAndSaveToArray(cityName);
        console.log("Proses pengambilan data selesai");
    } else {
        console.error("Nama kota tidak boleh kosong!");
    }
});
