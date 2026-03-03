const TX_PIN = SerialPin.P16
const RX_PIN = SerialPin.P15
const BAUDRATE = BaudRate.BaudRate115200

const WIFI_SSID = "my_ssid"
const WIFI_PWD = "my_password"

const THINGSPEAK_WRITE_API_KEY = "my_write_api_key"
const BLYNK_TOKEN = "my_blynk_token"

const TIMEZONE = 8



// Initialize the ESP8266 module.
// Show sad face if failed.
esp8266.init(TX_PIN, RX_PIN, BAUDRATE)
if (!esp8266.isESP8266Initialized()) {
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
}

// Connect to WiFi router.
// Show sad face if failed.
esp8266.connectWiFi(WIFI_SSID, WIFI_PWD)
if (!esp8266.isWifiConnected()) {
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
}

// Upload data to Thingspeak.
// Show sad face if failed.
esp8266.uploadThingspeak(THINGSPEAK_WRITE_API_KEY, 0, 1, 2, 3, 4, 5, 6, 7)
if (!esp8266.isThingspeakUploaded()) {
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
}

// Write to Blynk.
// Show sad face if failed.
esp8266.writeBlynk(BLYNK_TOKEN, "V0", "100")
if (!esp8266.isBlynkUpdated()) {
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
}

// Read from Blynk and show the value.
// Show sad face if failed.
let value = esp8266.readBlynk(BLYNK_TOKEN, "V0")
if (!esp8266.isBlynkUpdated()) {
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
} else {
    basic.showString(value)
    basic.pause(1000)
}

// Initialize internet time.
// Show sad face if failed.
esp8266.initInternetTime(TIMEZONE)
if (!esp8266.isInternetTimeInitialized()) {
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
}

// Update the internet time and show the time.
// Show sad face if failed.
esp8266.updateInternetTime()
if (!esp8266.isInternetTimeUpdated()) {
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
} else {
    basic.showString(esp8266.getHour() + ":" + esp8266.getMinute() + ":" + esp8266.getSecond())
}


// Firebase Configuration
const FIREBASE_API_KEY = "your_firebase_api_key"
const FIREBASE_DATABASE_URL = "https://your-project.firebaseio.com"
const FIREBASE_PROJECT_ID = "your-project-id"

// Configure Firebase connection.
esp8266.configureFirebase(FIREBASE_API_KEY, FIREBASE_DATABASE_URL, FIREBASE_PROJECT_ID)

// Example 1: Send sensor data using helper function
// Read temperature from micro:bit sensor
let temperature = input.temperature()
let lightLevel = input.lightLevel()

// Create JSON using helper function
let sensorJson = esp8266.createFirebaseJSON(
    "temperature", "" + temperature,
    "light", "" + lightLevel
)

// Send to Firebase
esp8266.sendFirebaseData("/sensors/microbit1", sensorJson)

// Show result
if (esp8266.isFirebaseDataSent()) {
    basic.showIcon(IconNames.Happy)
    basic.pause(1000)
} else {
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
}

// Example 2: Send custom JSON string
// You can also create JSON manually for more complex data
let customJson = "{\"device\":\"microbit\",\"temp\":" + temperature + ",\"timestamp\":1234567890}"
esp8266.sendFirebaseData("/devices/room1", customJson)

if (esp8266.isFirebaseDataSent()) {
    basic.showIcon(IconNames.Happy)
    basic.pause(1000)
} else {
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
}
