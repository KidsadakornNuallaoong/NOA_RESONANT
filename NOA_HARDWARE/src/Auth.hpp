#if !defined(AUTH_HPP)
#define AUTH_HPP

#include <Arduino.h>
#include <string>
#include <sstream>
#include <iostream>

using namespace std;

typedef struct {
    String email;
    String password;
    String deviceID;

    String userID;
} AuthSchema;

#endif // AUTH_HPP
