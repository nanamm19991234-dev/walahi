/**
 * ============================================================================
 * PMJ ESP8266 - COMPREHENSIVE EXAMPLE
 * ============================================================================
 * 
 * This example demonstrates how to use all device types with Firebase:
 * - SWITCH (on/off devices like lights, relays)
 * - SENSOR (temperature, humidity, light, etc.)
 * - DIMMER (PWM devices like fans, LED brightness)
 * 
 * WARNING: Replace placeholder values with your actual credentials!
 * DO NOT commit your real API keys to public repositories!
 */

// ============================================================================
// STEP 1: INITIALIZE ESP8266
// ============================================================================

esp8266.init(SerialPin.P16, SerialPin.P15, BaudRate.BaudRate115200)
basic.pause(1000)

// ============================================================================
// STEP 2: CONNECT TO WIFI
// ============================================================================

basic.showString("WIFI")
esp8266.connectWiFi("YOUR_WIFI_SSID", "YOUR_WIFI_PASSWORD")
basic.pause(3000)

if (esp8266.isWifiConnected()) {
    basic.showIcon(IconNames.Yes)
} else {
    basic.showIcon(IconNames.No)
    basic.showString("FAIL")
}

// ============================================================================
// STEP 3: CONFIGURE FIREBASE
// ============================================================================
// Get your credentials from: https://console.firebase.google.com
// 1. Go to Project Settings
// 2. Copy your API Key
// 3. Copy your Database URL (format: https://YOUR-PROJECT.firebaseio.com)

basic.showString("FB")
esp8266.configureFirebase(
    "YOUR_FIREBASE_API_KEY",              // Replace with your API key
    "https://YOUR-PROJECT.firebaseio.com", // Replace with your database URL
    "YOUR-PROJECT-ID"                      // Replace with your project ID
)

// Set the path where data will be stored
esp8266.setFirebasePath("iot")

basic.showIcon(IconNames.Heart)
basic.pause(1000)
basic.clearScreen()

// ============================================================================
// EXAMPLE 1: SEND SWITCH DATA (Button A)
// ============================================================================
// Use for: Lights, Relays, Motors (ON/OFF devices)
// Data structure in Firebase:
// {
//   "iot": {
//     "lampu_teras": {"tipe": "switch", "value": 1}
//   }
// }

input.onButtonPressed(Button.A, function () {
    basic.showString("SW")

    // Send SWITCH ON (value = 1)
    esp8266.firebaseSendSwitch("lampu_teras", 1)

    if (esp8266.isFirebaseDataSent()) {
        basic.showIcon(IconNames.Yes)
    } else {
        basic.showIcon(IconNames.No)
    }
})

// ============================================================================
// EXAMPLE 2: SEND SENSOR DATA (Button B)
// ============================================================================
// Use for: Temperature, Humidity, Light sensor, etc.
// Data structure in Firebase:
// {
//   "iot": {
//     "suhu": {"tipe": "sensor", "value": 28, "satuan": "C"}
//   }
// }

input.onButtonPressed(Button.B, function () {
    basic.showString("SENS")

    // Read temperature and send to Firebase
    let temperature = input.temperature()
    esp8266.firebaseSendSensor("suhu", temperature, "C")

    if (esp8266.isFirebaseDataSent()) {
        basic.showIcon(IconNames.Yes)
        basic.showNumber(temperature)
    } else {
        basic.showIcon(IconNames.No)
    }
})

// ============================================================================
// EXAMPLE 3: SEND DIMMER DATA (Button A+B)
// ============================================================================
// Use for: PWM devices like fan speed, LED brightness
// Data structure in Firebase:
// {
//   "iot": {
//     "kipas": {"tipe": "dimmer", "value": 512, "batas_atas": 1024}
//   }
// }

input.onButtonPressed(Button.AB, function () {
    basic.showString("DIM")

    // Send dimmer value (0-1024)
    // Example: Medium speed (50% = 512)
    esp8266.firebaseSendDimmer("kipas", 512)

    if (esp8266.isFirebaseDataSent()) {
        basic.showIcon(IconNames.Yes)
    } else {
        basic.showIcon(IconNames.No)
    }
})

// ============================================================================
// EXAMPLE 4: READ DATA FROM FIREBASE (Shake)
// ============================================================================
// Read the current value of a device from Firebase

input.onGesture(Gesture.Shake, function () {
    basic.showString("READ")

    // Read switch value (returns 0 or 1)
    let lampStatus = esp8266.readFirebaseNumber("lampu_teras")

    if (lampStatus == 1) {
        basic.showIcon(IconNames.Yes)
        basic.showString("ON")
    } else if (lampStatus == 0) {
        basic.showString("OFF")
    } else {
        // Error or empty
        basic.showIcon(IconNames.Confused)
    }
})

// ============================================================================
// EXAMPLE 5: READ SENSOR VALUE (Logo Pressed)
// ============================================================================

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    basic.showString("TEMP")

    // Read temperature sensor from Firebase
    let temp = esp8266.readFirebaseNumber("suhu")

    basic.showNumber(temp)
    basic.showString("C")
})

// ============================================================================
// EXAMPLE 6: MULTIPLE DEVICES (Pin P0)
// ============================================================================
// Send multiple device data at once

input.onPinPressed(TouchPin.P0, function () {
    basic.showString("MULTI")

    // Send multiple devices
    esp8266.firebaseSendSwitch("lampu_teras", 1)
    basic.pause(500)

    esp8266.firebaseSendSwitch("lampu_kamar", 0)
    basic.pause(500)

    esp8266.firebaseSendSensor("suhu", input.temperature(), "C")
    basic.pause(500)

    basic.showIcon(IconNames.Yes)
})

// ============================================================================
// USAGE INSTRUCTIONS
// ============================================================================
/*

BEFORE USING:
1. Replace YOUR_WIFI_SSID and YOUR_WIFI_PASSWORD with your WiFi credentials
2. Get Firebase credentials from: https://console.firebase.google.com
3. Replace YOUR_FIREBASE_API_KEY with your API key
4. Replace YOUR-PROJECT with your Firebase project name

BUTTON MAPPING:
- Button A     = Send SWITCH data (lampu_teras ON)
- Button B     = Send SENSOR data (temperature)
- Button A+B   = Send DIMMER data (kipas speed)
- Shake        = Read SWITCH value
- Logo Press   = Read SENSOR value
- Pin P0       = Send MULTIPLE devices

FIREBASE DATA TYPES:

1. SWITCH (0 = OFF, 1 = ON)
   esp8266.firebaseSendSwitch("device_name", value)
   Use for: Lights, relays, motors
   
2. SENSOR (any number + unit)
   esp8266.firebaseSendSensor("device_name", value, "unit")
   Use for: Temperature, humidity, light sensor
   
3. DIMMER (0-1024)
   esp8266.firebaseSendDimmer("device_name", value)
   Use for: Fan speed, LED brightness, servo position

READING DATA:
- readFirebaseNumber("device_name") - Returns number (0 if error/empty)
- readFirebaseValue("device_name") - Also returns number

TROUBLESHOOTING:
1. If WiFi doesn't connect:
   - Check SSID and password
   - Ensure ESP8266 is powered properly
   - Try BaudRate 9600 if 115200 doesn't work

2. If Firebase doesn't work:
   - Verify API key is correct
   - Check database URL format
   - Ensure Firebase Rules allow read/write
   - Test with Firebase Console first

3. If data not sent:
   - Check WiFi is connected first
   - Wait between requests (500ms minimum)
   - Use isFirebaseDataSent() to verify

FIREBASE RULES (for testing):
{
  "rules": {
    ".read": true,
    ".write": true
  }
}

WARNING: Don't use open rules in production!

*/
