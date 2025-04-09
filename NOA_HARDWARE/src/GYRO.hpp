#if !defined(GYRO_HPP)
#define GYRO_HPP

#include <iostream>
#include <vector>
#include <cstdint>
#include <string>

using namespace std;

#define BR_4800 0x0001 // Baud rate : 4800 bps
#define BR_9600 0x0002 // Baud rate : 9600 bps
#define BR_19200 0x0003 // Baud rate : 19200 bps
#define BR_38400 0x0004 // Baud rate : 38400 bps
#define BR_57600 0x0005 // Baud rate : 57600 bps
#define BR_115200 0x0006 // Baud rate : 115200 bps
#define BR_230400 0x0007 // Baud rate : 230400 bps

typedef struct {
    string DeviceAddress;
    string DateTime;
    int TimeStamp;
    struct {
        double Acceleration;
        double VelocityAngular;
        double VibrationSpeed;
        double VibrationAngle;
        double VibrationDisplacement;
        double VibrationDisplacementHighSpeed;
        double Frequency;
    } X, Y, Z;
    double Temperature;
    bool ModbusHighSpeed;
} DataSchema;

void GyroDisplay(DataSchema g){
    cout << "X Acceleration: " << g.X.Acceleration << "g (" << g.X.Acceleration * 9.8 << " m/s^2)" << endl;
    cout << "Y Acceleration: " << g.Y.Acceleration << "g (" << g.Y.Acceleration * 9.8 << " m/s^2)" << endl;
    cout << "Z Acceleration: " << g.Z.Acceleration << "g (" << g.Z.Acceleration * 9.8 << " m/s^2)" << endl;
    cout << "X Velocity Angular: " << g.X.VelocityAngular << " deg/s" << endl;
    cout << "Y Velocity Angular: " << g.Y.VelocityAngular << " deg/s" << endl;
    cout << "Z Velocity Angular: " << g.Z.VelocityAngular << " deg/s" << endl;
    cout << "X Vibration Speed: " << g.X.VibrationSpeed << " mm/s" << endl;
    cout << "Y Vibration Speed: " << g.Y.VibrationSpeed << " mm/s" << endl;
    cout << "Z Vibration Speed: " << g.Z.VibrationSpeed << " mm/s" << endl;
    cout << "X Vibration Angle: " << g.X.VibrationAngle << "┬░" << endl;
    cout << "Y Vibration Angle: " << g.Y.VibrationAngle << "┬░" << endl;
    cout << "Z Vibration Angle: " << g.Z.VibrationAngle << "┬░" << endl;
    cout << "Temperature: " << g.Temperature << "┬░C" << endl;
    cout << "X Vibration Displacement: " << g.X.VibrationDisplacement << " um" << endl;
    cout << "Y Vibration Displacement: " << g.Y.VibrationDisplacement << " um" << endl;
    cout << "Z Vibration Displacement: " << g.Z.VibrationDisplacement << " um" << endl;
    cout << "X Frequency: " << g.X.Frequency << " Hz" << endl;
    cout << "Y Frequency: " << g.Y.Frequency << " Hz" << endl;
    cout << "Z Frequency: " << g.Z.Frequency << " Hz" << endl;
}

template <typename T, typename U>
void TSLD(uint8_t DH, uint8_t DL, T &temp, U factor = 1) {
    if (factor < 1) {
        factor = 1;
    }

    temp = (((short)DH << 8) | DL);

    temp = (static_cast<double>(temp) / 32768.0) * factor;
}

template <typename T>
void S_TSLD(uint8_t DH, uint8_t DL, T &temp) {
    temp = (((short)DH << 8) | DL);
}

int16_t parseData(uint8_t DH, uint8_t DL) {
    return DH << 8 | DL;
}

void CRCcalculate(vector<uint8_t> data, uint8_t &CRCH, uint8_t &CRCL) {
    uint16_t CRC = 0xFFFF;
    uint16_t POLYNOMIAL = 0xA001;
    uint8_t LSB, i, j;

    for (i = 0; i < data.size(); i++) {
        CRC ^= data[i];
        for (j = 0; j < 8; j++) {
            LSB = CRC & 0x0001;
            CRC = CRC >> 1;
            if (LSB == 1) {
                CRC = CRC ^ POLYNOMIAL;
            }
        }
    }

    CRCL = (CRC & 0xFF00) >> 8;
    CRCH = CRC & 0x00FF;
}

void CRCcalculate(uint8_t *data, uint8_t &CRCH, uint8_t &CRCL) {
    uint16_t CRC = 0xFFFF;
    uint16_t POLYNOMIAL = 0xA001;
    uint8_t LSB, i, j;

    for (i = 0; i < 6; i++) {
        CRC ^= data[i];
        for (j = 0; j < 8; j++) {
            LSB = CRC & 0x0001;
            CRC = CRC >> 1;
            if (LSB == 1) {
                CRC = CRC ^ POLYNOMIAL;
            }
        }
    }

    CRCL = (CRC & 0xFF00) >> 8;
    CRCH = CRC & 0x00FF;
}

enum GCOM {
    BAUD = 0x0004,
    IICADDR = 0x001A,
    ACCELERATION = 0x0034,
    ACCELERATION_X = 0x0034,
    ACCELERATION_Y = 0x0035,
    ACCELERATION_Z = 0x0036,
    ANGULAR_VELOCITY = 0x0037,
    ANGULAR_VELOCITY_X = 0x0037,
    ANGULAR_VELOCITY_Y = 0x0038,
    ANGULAR_VELOCITY_Z = 0x0039,
    VIBRATION_SPEED = 0x003A,
    VIBRATION_SPEED_X = 0x003A,
    VIBRATION_SPEED_Y = 0x003B,
    VIBRATION_SPEED_Z = 0x003C,
    VIBRATION_ANGLE = 0x003D,  
    VIBRATION_ANGLE_X = 0x003D,
    VIBRATION_ANGLE_Y = 0x003E,
    VIBRATION_ANGLE_Z = 0x003F, 
    TEMPERATURE = 0x0040,
    VIBRATION_DISPLACEMENT = 0x0041,
    VIBRATION_DISPLACEMENT_X = 0x0041,
    VIBRATION_DISPLACEMENT_Y = 0x0042,
    VIBRATION_DISPLACEMENT_Z = 0x0043,
    VIBRATION_FREQUENCY = 0x0044,
    VIBRATION_FREQUENCY_X = 0x0044,
    VIBRATION_FREQUENCY_Y = 0x0045,
    VIBRATION_FREQUENCY_Z = 0x0046,
    HIGH_SPEED_MODE = 0x0047,
    HIGH_SPEED_MODE_X = 0x0047,
    HIGH_SPEED_MODE_Y = 0x0048,
    HIGH_SPEED_MODE_Z = 0x0049,
    CUTOFF_FREQUENCY_INTEGRATOR = 0x0063,
    CUTOFF_FREQUENCY_FRAGTION = 0x0064,
    DETECTION_PERIOD = 0x0065
};

enum READ_OR_WRITE {
    READ, WRITE
};

enum DataHL {
    NONE = 0x0000,
    DEF = 0x0001,
    SINGLE_AXIS = 0x0001,
    MULTI_AXIS = 0x0002,
    ALL_AXIS = 0x0003,
    UNLOCK = 0xB588,
};

class GYRO {
    private:
        #define RD 0x03
        #define WT 0x06
        uint8_t CRCH, CRCL;

        uint8_t Data_To_Send[6] = {0x50, 0x03, 0x00, 0x00, 0x00, 0x00};
    
    public:

        GYRO() = default;
        GYRO(uint8_t address) {
            this->Data_To_Send[0] = address;
        }
        ~GYRO() = default;
        void setDeviceAddress(uint8_t address) {
            this->Data_To_Send[0] = address;
        }

        void setCommand(uint8_t CMDH, uint8_t CMDL) {
            this->Data_To_Send[2] = CMDH;
            this->Data_To_Send[3] = CMDL;
        }

        void setCommand(uint16_t command) {
            this->Data_To_Send[2] = (command & 0xFF00) >> 8;
            this->Data_To_Send[3] = command & 0x00FF;
        }

        void setCommand(GCOM command) {
            this->Data_To_Send[2] = (command & 0xFF00) >> 8;
            this->Data_To_Send[3] = command & 0x00FF;
        }

        void setData(uint8_t DataH, uint8_t DataL) {
            this->Data_To_Send[4] = DataH;
            this->Data_To_Send[5] = DataL;
        }

        void setData(uint16_t data) {
            this->Data_To_Send[4] = (data & 0xFF00) >> 8;
            this->Data_To_Send[5] = data & 0x00FF;
        }

        void setData(DataHL data) {
            this->Data_To_Send[4] = (data & 0xFF00) >> 8;
            this->Data_To_Send[5] = data & 0x00FF;
        }
        
        vector<uint8_t> getCommand(READ_OR_WRITE command = READ) {
            CRCcalculate(Data_To_Send, CRCH, CRCL);

            return {
                Data_To_Send[0], static_cast<uint8_t>(command == WRITE ? WT : RD), Data_To_Send[2], Data_To_Send[3], Data_To_Send[4], Data_To_Send[5], CRCH, CRCL
            };
        }

        vector<uint8_t> SAVE() {
            Data_To_Send[1] = WT;
            Data_To_Send[2] = 0x00;
            Data_To_Send[3] = 0x00;
            Data_To_Send[4] = 0x00;
            Data_To_Send[5] = 0x00;
            CRCcalculate(Data_To_Send, CRCH, CRCL);

            return {
                Data_To_Send[0], WT, Data_To_Send[2], Data_To_Send[3], Data_To_Send[4], Data_To_Send[5], CRCH, CRCL
            };
        }

        vector<uint8_t> UNLOCK() {
            Data_To_Send[1] = WT;
            Data_To_Send[2] = 0x00;
            Data_To_Send[3] = 0x69;
            Data_To_Send[4] = 0xB5;
            Data_To_Send[5] = 0x88;
            CRCcalculate(Data_To_Send, CRCH, CRCL);

            return {
                Data_To_Send[0], WT, 0x00, 0x69, 0xB5, 0x88, CRCH, CRCL
            };
        }

        vector<uint8_t> RESTART() {
            Data_To_Send[1] = WT;
            Data_To_Send[2] = 0x00;
            Data_To_Send[3] = 0x00;
            Data_To_Send[4] = 0x00;
            Data_To_Send[5] = 0xFF;
            CRCcalculate(Data_To_Send, CRCH, CRCL);

            return {
                Data_To_Send[0], WT, Data_To_Send[2], Data_To_Send[3], Data_To_Send[4], Data_To_Send[5], CRCH, CRCL
            };
        }
};

#endif // GYRO_HPP
