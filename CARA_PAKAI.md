# 🚀 CARA PAKAI - Super Simple!

## 📋 Yang Anda Butuhkan:
1. ✅ Micro:bit
2. ✅ ESP8266 WiFi Module
3. ✅ WiFi (SSID & Password)
4. ✅ Firebase Account (gratis!)

---

## 🔥 STEP 1: Buat Firebase Project

1. Buka: https://console.firebase.google.com
2. Klik **"Add project"** atau **"Tambah project"**
3. Beri nama project (contoh: `microbit-iot`)
4. Klik **Continue** → **Continue** → **Create project**
5. Tunggu sampai selesai, lalu klik **Continue**

---

## 🔑 STEP 2: Dapatkan Firebase Credentials

### A. Dapatkan API Key:
1. Di Firebase Console, klik **⚙️ (Settings)** → **Project settings**
2. Scroll ke bawah, cari **"Web API Key"**
3. **Copy** API Key-nya

### B. Dapatkan Database URL:
1. Di sidebar kiri, klik **"Realtime Database"**
2. Klik **"Create Database"**
3. Pilih lokasi (contoh: `asia-southeast1`)
4. Pilih **"Start in test mode"** → **Enable**
5. **Copy** URL database (contoh: `https://microbit-iot-default-rtdb.firebaseio.com`)

### C. Dapatkan Project ID:
1. Kembali ke **Project settings** (⚙️)
2. Lihat **"Project ID"** di bagian atas
3. **Copy** Project ID-nya

---

## 💻 STEP 3: Setup Code di MakeCode

1. Buka: https://makecode.microbit.org
2. Klik **"New Project"**
3. Klik **Extensions** (ikon ⚙️)
4. Masukkan: `https://github.com/emRival/PMJ-esp8266`
5. Klik extension **PMJ ESP8266**

---

## ✏️ STEP 4: Copy Code

Buka file **`SIMPLE.ts`** dan copy semua code-nya, lalu:

1. **Ganti baris 6-10** dengan data Anda:
```typescript
const WIFI = "NamaWiFiAnda"           // ← WiFi name
const PASS = "PasswordWiFi"           // ← WiFi password
const API = "AIzaSy..."               // ← Firebase API Key
const URL = "https://..."             // ← Firebase Database URL
const PROJECT = "microbit-iot"        // ← Firebase Project ID
```

2. **Paste** ke MakeCode (tab JavaScript)

3. **Download** ke micro:bit

---

## 🎮 STEP 5: Test!

### Test Lampu (Button A):
- Hubungkan LED ke **P1** dan **GND**
- Tekan **Button A**
- LED nyala/mati
- Cek Firebase → ada data `lampu`

### Test Kipas (Button B):
- Hubungkan potensiometer ke **P0**
- Tekan **Button B**
- Putar potensiometer
- Cek Firebase → ada data `kipas`

### Test Suhu (Shake):
- **Shake** micro:bit
- Cek Firebase → ada data `suhu`

### Test Auto-send:
- Tunggu 10 detik
- LED pojok kanan bawah blink
- Cek Firebase → data `suhu` dan `cahaya` update otomatis

---

## 📱 STEP 6: Lihat Data di Firebase

1. Buka Firebase Console
2. Klik **Realtime Database**
3. Lihat data di path `/iot`:
```
/iot
  ├─ lampu
  │   ├─ tipe: "switch"
  │   └─ value: 1
  ├─ kipas
  │   ├─ tipe: "dimmer"
  │   └─ value: 512
  ├─ suhu
  │   ├─ tipe: "sensor"
  │   ├─ value: 25
  │   └─ satuan: "C"
  └─ cahaya
      ├─ tipe: "sensor"
      ├─ value: 128
      └─ satuan: "lux"
```

---

## 🎨 Blocks di MakeCode

Cari di kategori **Firebase**:

### 1. Setup Firebase
```
setup Firebase
  API Key: [YOUR_API_KEY]
  Database URL: [YOUR_URL]
  Project ID: [YOUR_PROJECT]
```

### 2. Kirim Switch
```
Firebase send SWITCH
  name: "lampu"
  value: 1
```

### 3. Kirim Dimmer
```
Firebase send DIMMER
  name: "kipas"
  value: 512
```

### 4. Kirim Sensor
```
Firebase send SENSOR
  name: "suhu"
  value: 25
  unit: "C"
```

---

## ⚡ Quick Tips

✅ **WiFi harus 2.4GHz** (bukan 5GHz)  
✅ **ESP8266 butuh power 3.3V stabil**  
✅ **Test WiFi dulu** sebelum test Firebase  
✅ **Lihat LED indicator** di micro:bit:
   - ❤️ = Setup berhasil
   - LED pojok kiri atas = WiFi connected
   - LED pojok kanan bawah blink = Data terkirim

---

## 🆘 Troubleshooting

### Micro:bit tampilkan ☹️ (Sad face):
- ESP8266 tidak terdeteksi
- Cek koneksi TX/RX
- Cek power ESP8266

### Micro:bit tampilkan ✗ (No):
- WiFi tidak connect
- Cek SSID dan password
- Pastikan WiFi 2.4GHz

### Data tidak muncul di Firebase:
- Cek API Key, URL, Project ID
- Cek Firebase Rules (harus allow write)
- Reload Firebase Console

---

## 📞 Need Help?

- GitHub Issues: https://github.com/emRival/PMJ-esp8266/issues
- File: `CONTOH_MUDAH.ts` untuk contoh lebih lengkap
- File: `TROUBLESHOOTING.md` untuk error umum

---

**Selamat Mencoba! 🎉**
