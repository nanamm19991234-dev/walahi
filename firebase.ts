let serverHost = ""
let serverPath = "/iot.php"
let useSSL = false

namespace firebase {

    let uploadSuccess = false

    //============================
    // SET HOST
    //============================
    //% subcategory="Firebase"
    //% block="Set Server Host %host"
    export function setHost(host: string) {
        serverHost = host
            .replace("http://", "")
            .replace("https://", "")
            .replace("/", "")
            .trim()
    }

    //============================
    // USE SSL
    //============================
    //% subcategory="Firebase"
    //% block="Use SSL %ssl"
    export function setUseSSL(ssl: boolean) {
        useSSL = ssl
    }

    //============================
    // SET PATH
    //============================
    //% subcategory="Firebase"
    //% block="Set Server Path %path"
    export function setPath(path: string) {
        if (path.charAt(0) != "/") {
            path = "/" + path
        }
        serverPath = path
    }

    //============================
    // STATUS UPLOAD
    //============================
    //% subcategory="Firebase"
    //% block="Upload success"
    export function isSuccess(): boolean {
        return uploadSuccess
    }

    //============================
    // SEND SENSOR (ANGKA)
    //============================
    //% subcategory="Firebase"
    //% block="Send Sensor|name %name|value %value"
    export function sendSensor(name: string, value: number) {

        uploadSuccess = false
        if (!esp8266.isWifiConnected()) return
        if (serverHost == "") return

        let port = useSSL ? 443 : 80
        let proto = useSSL ? "SSL" : "TCP"

        if (!esp8266.sendCommand(
            "AT+CIPSTART=\"" + proto + "\",\"" + serverHost + "\"," + port,
            "OK",
            5000
        )) return

        let data = name + ":" + value
        let safeData = esp8266.formatUrl(data)
        let url = serverPath + "?data=" + safeData

        let request = "GET " + url + " HTTP/1.1\r\n"
        request += "Host: " + serverHost + "\r\n"
        request += "Connection: close\r\n\r\n"

        esp8266.sendCommand("AT+CIPSEND=" + request.length)
        esp8266.sendCommand(request)

        if (esp8266.getResponse("SEND OK", 3000) == "") return

        basic.pause(500)
        esp8266.sendCommand("AT+CIPCLOSE", "OK", 1000)

        uploadSuccess = true
    }

    //============================
    // SEND STRING (JSON / UID NFC)
    //============================
    //% subcategory="Firebase"
    //% block="Send Text|name %name|value %value"
    export function sendString(name: string, value: string) {

        uploadSuccess = false
        if (!esp8266.isWifiConnected()) return
        if (serverHost == "") return

        let port = useSSL ? 443 : 80
        let proto = useSSL ? "SSL" : "TCP"

        if (!esp8266.sendCommand(
            "AT+CIPSTART=\"" + proto + "\",\"" + serverHost + "\"," + port,
            "OK",
            5000
        )) return

        let data = name + ":" + value
        let safeData = esp8266.formatUrl(data)
        let url = serverPath + "?data=" + safeData

        let request = "GET " + url + " HTTP/1.1\r\n"
        request += "Host: " + serverHost + "\r\n"
        request += "Connection: close\r\n\r\n"

        esp8266.sendCommand("AT+CIPSEND=" + request.length)
        esp8266.sendCommand(request)

        if (esp8266.getResponse("SEND OK", 3000) == "") return

        basic.pause(500)
        esp8266.sendCommand("AT+CIPCLOSE", "OK", 1000)

        uploadSuccess = true
    }

    //============================
    // GET DATA
    //============================
    //% subcategory="Firebase"
    //% block="Get Data %path"
    export function getData(path: string): boolean {

        if (!esp8266.isWifiConnected()) return false
        if (serverHost == "") return false

        let port = useSSL ? 443 : 80
        let proto = useSSL ? "SSL" : "TCP"

        if (!esp8266.sendCommand(
            "AT+CIPSTART=\"" + proto + "\",\"" + serverHost + "\"," + port,
            "OK",
            5000
        )) return false

        // Format path for Firebase REST API
        let fullPath = serverPath + "/" + path;
        while (fullPath.indexOf("//") >= 0) {
            fullPath = fullPath.replace("//", "/");
        }
        
        // Firebase expects .json at the end of the URL path
        let url = fullPath + ".json"

        let request = "GET " + url + " HTTP/1.1\r\n"
        request += "Host: " + serverHost + "\r\n"
        request += "Connection: close\r\n\r\n"

        esp8266.sendCommand("AT+CIPSEND=" + request.length)
        esp8266.sendCommand(request)

        let response = esp8266.getResponse("CLOSED", 5000)

        esp8266.sendCommand("AT+CIPCLOSE", "OK", 1000)

        // Parse Firebase true/false responses
        if (response.indexOf("true") >= 0) return true
        if (response.indexOf("false") >= 0) return false
        
        // Fallback for simple 1 or 0 (might collide with HTTP headers if not careful)
        let lines = response.split("\n")
        let lastLine = lines[lines.length - 1].trim()
        if (lastLine == "CLOSED") {
            lastLine = lines[lines.length - 2] ? lines[lines.length - 2].trim() : ""
        }
        
        if (lastLine == "1" || response.indexOf("\"1\"") >= 0) return true
        if (lastLine == "0" || response.indexOf("\"0\"") >= 0) return false

        return false
    }

    //============================
    // SET DATA (ANY VALUE TO PATH)
    //============================
    //% subcategory="Firebase"
    //% block="Set Data|path %path|value %value"
    export function setData(path: string, value: string) {

        uploadSuccess = false
        if (!esp8266.isWifiConnected()) return
        if (serverHost == "") return

        let port = useSSL ? 443 : 80
        let proto = useSSL ? "SSL" : "TCP"

        if (!esp8266.sendCommand(
            "AT+CIPSTART=\"" + proto + "\",\"" + serverHost + "\"," + port,
            "OK",
            5000
        )) return

        // Format path for Firebase REST API
        let fullPath = serverPath + "/" + path;
        while (fullPath.indexOf("//") >= 0) {
            fullPath = fullPath.replace("//", "/");
        }
        
        let url = fullPath + ".json"

        // Kita gunakan PUT untuk replace, atau PATCH untuk update
        // HTTP PUT (REST API URL Firebase)
        let payload = ""
        // Cek jika number/boolean (jangan pakai quote) atau string (pakai quote)
        if (value == "true" || value == "false" || !isNaN(Number(value))) {
             payload = value;
        } else {
             payload = "\"" + value + "\"";
        }

        let request = "PUT " + url + " HTTP/1.1\r\n"
        request += "Host: " + serverHost + "\r\n"
        request += "Content-Type: application/json\r\n"
        request += "Content-Length: " + payload.length + "\r\n"
        request += "Connection: close\r\n\r\n"
        request += payload

        esp8266.sendCommand("AT+CIPSEND=" + request.length)
        esp8266.sendCommand(request)

        if (esp8266.getResponse("SEND OK", 3000) == "") return

        basic.pause(500)
        esp8266.sendCommand("AT+CIPCLOSE", "OK", 1000)

        uploadSuccess = true
    }
}
