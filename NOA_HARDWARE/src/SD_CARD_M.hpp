#if !defined(SD_CARD_M)
#define SD_CARD_M

#include <SPI.h>
#include <SD.h>
#include <FS.h>

// * SD Card setup
#define SD_CS 39
#define SD_MOSI 35
#define SD_MISO 37
#define SD_CLK 36

// remove " from string
String stringGuard(String str) {
    str.replace("\"", "");
    return str;
}

String line = "";
String message;


#endif // SD_CARD_M
