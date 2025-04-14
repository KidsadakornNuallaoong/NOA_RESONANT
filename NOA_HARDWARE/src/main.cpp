#include <Arduino.h>
#include "GYRO.hpp"
#include <vector>
#include <WiFi.h>
#include <HTTPClient.h>
#include <string>
// for timestamp
#include <ctime>
#include <iomanip>
#include <sstream>
#include <iostream>
#include "key.hpp"
#include <PubSubClient.h>
#include <cstdint>
#include "SD_CARD_M.hpp"

// Function template for parseRes
template <typename T>
T parseRes(unsigned char lowByte, unsigned char highByte) {
    return (highByte << 8) | lowByte;
}

#define DADDR_DEF 0x50
#define MQTT_MAX_SIZE 1024

HardwareSerial RS485(2); // Use UART2

// Send data to server
HTTPClient http;

WiFiClient espClient;
PubSubClient client(espClient);

DataSchema D;

GYRO gyro(DADDR_DEF);

std::vector<uint8_t> cmd;

void GDisplay(DataSchema g){
    Serial.printf("Device Address: %s\n", g.DeviceAddress.c_str());
    Serial.printf("X: Acceleration: %.2f, Velocity Angular: %.2f, Vibration Speed: %.2f, Vibration Angle: %.2f, Vibration Displacement: %.2f, Vibration Displacement High Speed: %.2f, Frequency: %.2f\n", g.X.Acceleration, g.X.VelocityAngular, g.X.VibrationSpeed, g.X.VibrationAngle, g.X.VibrationDisplacement, g.X.VibrationDisplacementHighSpeed, g.X.Frequency);
    Serial.printf("Y: Acceleration: %.2f, Velocity Angular: %.2f, Vibration Speed: %.2f, Vibration Angle: %.2f, Vibration Displacement: %.2f, Vibration Displacement High Speed: %.2f, Frequency: %.2f\n", g.Y.Acceleration, g.Y.VelocityAngular, g.Y.VibrationSpeed, g.Y.VibrationAngle, g.Y.VibrationDisplacement, g.Y.VibrationDisplacementHighSpeed, g.Y.Frequency);
    Serial.printf("Z: Acceleration: %.2f, Velocity Angular: %.2f, Vibration Speed: %.2f, Vibration Angle: %.2f, Vibration Displacement: %.2f, Vibration Displacement High Speed: %.2f, Frequency: %.2f\n", g.Z.Acceleration, g.Z.VelocityAngular, g.Z.VibrationSpeed, g.Z.VibrationAngle, g.Z.VibrationDisplacement, g.Z.VibrationDisplacementHighSpeed, g.Z.Frequency);
    Serial.printf("Temperature: %.2f\n", g.Temperature);
    Serial.printf("Modbus High Speed: %s\n", g.ModbusHighSpeed ? "true" : "false");
}

void callback(char *topic, byte *payload, unsigned int length) {
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    for (int i = 0; i < length; i++) {
        Serial.print((char)payload[i]);
    }
    Serial.println();
}

String toJson(DataSchema g){
    String jsonString = "{";
    jsonString += "\"DeviceAddress\":\"" + String(DeviceADDR) + "\",";
    jsonString += "\"X\":{";
    jsonString += "\"Acceleration\":" + String(g.X.Acceleration) + ",";
    jsonString += "\"VelocityAngular\":" + String(g.X.VelocityAngular) + ",";
    jsonString += "\"VibrationSpeed\":" + String(g.X.VibrationSpeed) + ",";
    jsonString += "\"VibrationAngle\":" + String(g.X.VibrationAngle) + ",";
    jsonString += "\"VibrationDisplacement\":" + String(g.X.VibrationDisplacement) + ",";
    jsonString += "\"Frequency\":" + String(g.X.Frequency);
    jsonString += "},";
    jsonString += "\"Y\":{";
    jsonString += "\"Acceleration\":" + String(g.Y.Acceleration) + ",";
    jsonString += "\"VelocityAngular\":" + String(g.Y.VelocityAngular) + ",";
    jsonString += "\"VibrationSpeed\":" + String(g.Y.VibrationSpeed) + ",";
    jsonString += "\"VibrationAngle\":" + String(g.Y.VibrationAngle) + ",";
    jsonString += "\"VibrationDisplacement\":" + String(g.Y.VibrationDisplacement) + ",";\
    jsonString += "\"Frequency\":" + String(g.Y.Frequency);
    jsonString += "},";
    jsonString += "\"Z\":{";
    jsonString += "\"Acceleration\":" + String(g.Z.Acceleration) + ",";
    jsonString += "\"VelocityAngular\":" + String(g.Z.VelocityAngular) + ",";
    jsonString += "\"VibrationSpeed\":" + String(g.Z.VibrationSpeed) + ",";
    jsonString += "\"VibrationAngle\":" + String(g.Z.VibrationAngle) + ",";
    jsonString += "\"VibrationDisplacement\":" + String(g.Z.VibrationDisplacement) + ",";
    jsonString += "\"Frequency\":" + String(g.Z.Frequency);
    jsonString += "},";
    jsonString += "\"Temperature\":" + String(g.Temperature);
    jsonString += "}";

    return jsonString;
}

void task1(void *pvParameters) {
    double VAX, VAY, VAZ;

    while (true) {
        gyro.setCommand(ACCELERATION);
        gyro.setData(0x0013);
        cmd = gyro.getCommand(READ);
        // Send HEX command
        digitalWrite(DE_RE_PIN, HIGH); // Enable transmission
        delay(10);  // Allow time for RS485 to switch
        RS485.write(cmd.data(), cmd.size());
        digitalWrite(DE_RE_PIN, LOW); // Set to receive mode

        if (RS485.available()) {
            // Serial.print("Received: ");
            std::vector<uint8_t> receivedBytes;
            while (RS485.available()) {
                uint8_t receivedByte = RS485.read();
                receivedBytes.push_back(receivedByte);
            }

            if (receivedBytes.size() >= 9) {
                D.X.Acceleration = parseData(receivedBytes[3], receivedBytes[4]) / 32768.0 * 16;
                D.Y.Acceleration = parseData(receivedBytes[5], receivedBytes[6]) / 32768.0 * 16;
                D.Z.Acceleration = parseData(receivedBytes[7], receivedBytes[8]) / 32768.0 * 16;

                D.X.VelocityAngular = parseData(receivedBytes[9], receivedBytes[10]) / 32768.0 * 2000;
                D.Y.VelocityAngular = parseData(receivedBytes[11], receivedBytes[12]) / 32768.0 * 2000;
                D.Z.VelocityAngular = parseData(receivedBytes[13], receivedBytes[14]) / 32768.0 * 2000;

                D.X.VibrationSpeed = parseData(receivedBytes[15], receivedBytes[16]);
                D.Y.VibrationSpeed = parseData(receivedBytes[17], receivedBytes[18]);
                D.Z.VibrationSpeed = parseData(receivedBytes[19], receivedBytes[20]);

                D.X.VibrationAngle = parseData(receivedBytes[21], receivedBytes[22]) / 32768.0 * 180;
                D.Y.VibrationAngle = parseData(receivedBytes[23], receivedBytes[24]) / 32768.0 * 180;
                D.Z.VibrationAngle = parseData(receivedBytes[25], receivedBytes[26]) / 32768.0 * 180;

                D.Temperature = parseData(receivedBytes[27], receivedBytes[28]) / 100.0;

                D.X.VibrationDisplacement = parseData(receivedBytes[29], receivedBytes[30]);
                D.Y.VibrationDisplacement = parseData(receivedBytes[31], receivedBytes[32]);
                D.Z.VibrationDisplacement = parseData(receivedBytes[33], receivedBytes[34]);

                D.X.Frequency = parseData(receivedBytes[35], receivedBytes[36]);
                D.Y.Frequency = parseData(receivedBytes[37], receivedBytes[38]);
                D.Z.Frequency = parseData(receivedBytes[39], receivedBytes[40]);
            }
        }

        GDisplay(D);

        if (WiFi.status() == WL_CONNECTED) {
            String jsonString = toJson(D);

            // * mqtt pub
            if (!client.connected()) {
                client.connect(DeviceADDR.c_str(), (MQTT_USER.isEmpty() ? mqtt_uname : MQTT_USER.c_str()), (MQTT_PASS.isEmpty() ? mqtt_pass : MQTT_PASS.c_str()));
            }

            client.publish("vibration", jsonString.c_str());
            Serial.println("Data sent to MQTT");
            
        } else {
            Serial.println("WiFi Disconnected!");

            //  reconnect
            WiFi.begin(SSID, PASSWORD);
            Serial.print("Reconnecting to WiFi");
            while (WiFi.waitForConnectResult() != WL_CONNECTED) {
                Serial.print(".");
                delay(100);
            }
            Serial.println("");
            Serial.println("Reconnected to the WiFi network");
        }
    }
}

void task2(void *pvParameters) {
    for (;;) {
        // if (WiFi.status() == WL_CONNECTED) {
        //     String jsonString = toJson(D);

        //     // http.begin("http://172.20.10.3:8000/store");
        //     // http.addHeader("Content-Type", "application/json");

        //     // int httpResponseCode = http.POST(jsonString);

        //     // if (httpResponseCode > 0) {
        //     //     String response = http.getString();
        //     //     Serial.println(httpResponseCode);
        //     //     Serial.println(response);
        //     // } else {

        //     //     Serial.println("Error on sending POST request");
        //     // }


        //     // * mqtt pub
        //     if (!client.connected()) {
        //         client.connect("ESP32Client", mqtt_uname, mqtt_pass);
        //     }

        //     client.publish("vibration", jsonString.c_str());
        //     Serial.println("Data sent to MQTT");

        //     delay(50);
        // } else {
        //     Serial.println("WiFi Disconnected!");

        //     //  reconnect
        //     WiFi.begin(SSID, PASSWORD);
        //     if (WiFi.waitForConnectResult() != WL_CONNECTED) {
        //         Serial.println("WiFi Failed!");
        //         while (1) {
        //             delay(100);
        //         }
        //     }
        // }
    }
}

void setup() {
    Serial.begin(115200);

    /// * setup SPI
    SPI.begin(SD_CLK, SD_MISO, SD_MOSI, SD_CS);
    while (!SD.begin(SD_CS, SPI)) {
        Serial.println("Card Mount Failed");
        delay(100);
    }
    Serial.println("SD card mounted successfully");

    uint8_t cardType = SD.cardType();
    while (cardType == CARD_NONE) {
        Serial.println("No SD card attached");
        delay(100);
    }
    Serial.println("SD card initialized successfully");
    Serial.print("Card Type: ");
    switch (cardType) {
        case CARD_MMC:
        Serial.println("MMC");
        break;
        case CARD_SD:
        Serial.println("SDSC");
        break;
        case CARD_SDHC:
        Serial.println("SDHC");
        break;
        default:
        Serial.println("UNKNOWN");
    }

    File file = SD.open("/config.txt");
    if (!file) {
        Serial.println("Failed to open file for reading");
        return;
    }

    // * if file is empty loop until it's not
    while (file.available() == 0) {
        Serial.println("File is empty");
        delay(100);
    }

    Serial.println("Reading file");
    Serial.println("SIZE: " + String(file.size()) + " bytes");
    Serial.println("LENGTH: " + String(file.available()));

    while (file.available()){
        line = file.readStringUntil('\n');
        line.trim();

        if (line.startsWith("DEVICE_ADDR=")) {
            DeviceADDR = stringGuard(line.substring(12));
        } else if (line.startsWith("SSID=")) {
            SSID = stringGuard(line.substring(5));
        } else if (line.startsWith("PASSWORD=")) {
            PASSWORD = stringGuard(line.substring(9));
        } else if (line.startsWith("MQTT_SERVER=")) {
            MQTT_SERVER = stringGuard(line.substring(12));
        } else if (line.startsWith("MQTT_USER=")) {
            MQTT_USER = stringGuard(line.substring(10));
        } else if (line.startsWith("MQTT_PASS=")) {
            MQTT_PASS = stringGuard(line.substring(10));
        } else if (line.startsWith("MQTT_TOPIC=")) {
            MQTT_TOPIC = stringGuard(line.substring(11));
        } else if (line.startsWith("MQTT_PORT=")) {
            MQTT_PORT = stringGuard(line.substring(10)).toInt();
        }
    }
    
    file.close();
    
    Serial.println("Loaded configuration");

    while (DeviceADDR.isEmpty()) {
        Serial.println("Device Address is empty, please set it first");
        delay(100);
    }

    // * setup WIFI
    WiFi.begin(SSID, PASSWORD);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(100);
    }
    Serial.println("");
    Serial.println("Connected to the WiFi network");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    // * connect to mqtt
    client.setServer((MQTT_SERVER.isEmpty() ? mqtt_server : MQTT_SERVER.c_str()), MQTT_PORT);
    client.setCallback(callback);
    client.setBufferSize(MQTT_MAX_SIZE);

    RS485.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN); // Adjust baud rate if needed

    pinMode(DE_RE_PIN, OUTPUT);
    digitalWrite(DE_RE_PIN, LOW); // Set to receive mode

    // gyro.setCommand(VIBRATION_ANGLE);
    // gyro.setData(ALL_AXIS);
    D.DeviceAddress = std::string(String(DADDR_DEF, HEX).c_str());
    gyro.setDeviceAddress(DADDR_DEF);

    // create task 1
    xTaskCreatePinnedToCore(
        task1, /* Function to implement the task */
        "Task1", /* Name of the task */
        10000,  /* Stack size in words */
        NULL,  /* Task input parameter */
        1,  /* Priority of the task */
        NULL,  /* Task handle. */
        0
    ); /* Core where the task should run */

    // create task 2
    xTaskCreatePinnedToCore(
        task2, /* Function to implement the task */
        "Task2", /* Name of the task */
        10000,  /* Stack size in words */
        NULL,  /* Task input parameter */
        1,  /* Priority of the task */
        NULL,  /* Task handle. */
        1
    ); /* Core where the task should run */
}

void loop() {
    delay(10);
}