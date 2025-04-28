package db

import (
	"context"
<<<<<<< HEAD
	"time"

	env "GOLANG_SERVER/components/env"
=======
	"errors"
	"time"

	env "GOLANG_SERVER/components/env"
	"GOLANG_SERVER/components/schema"
>>>>>>> Final_BN

	"go.mongodb.org/mongo-driver/bson"
)

<<<<<<< HEAD
func GetDeviceAddress() ([]string, error) {
	collection = client.Database(env.GetEnv("MONGO_DB")).Collection(env.GetEnv("MONGO_DEVICECOLLECTION"))
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second) // Create a context with timeout
	defer cancel()
	cursor, err := collection.Find(ctx, bson.M{})
=======
func GetDeviceAddress(userID string) ([]schema.GetDevice, error) {
	if userID == "" {
		return nil, errors.New("userID is required")
	}

	// เชื่อมต่อกับ MongoDB
	collection := client.Database(env.GetEnv("MONGO_DB")).Collection(env.GetEnv("MONGO_DEVICECOLLECTION"))
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// ค้นหาเอกสารทั้งหมดที่ตรงกับ userID
	cursor, err := collection.Find(ctx, bson.M{"userID": userID})
>>>>>>> Final_BN
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

<<<<<<< HEAD
	var deviceAddresses []string
	for cursor.Next(ctx) {
		var result struct {
			DeviceAddress string `bson:"deviceaddress"`
		}
		if err := cursor.Decode(&result); err != nil {
			return nil, err
		}
		deviceAddresses = append(deviceAddresses, result.DeviceAddress)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return deviceAddresses, nil
=======
	// สร้าง slice สำหรับเก็บผลลัพธ์
	var devices []schema.GetDevice
	for cursor.Next(ctx) {
		var device schema.GetDevice
		if err := cursor.Decode(&device); err != nil {
			return nil, err
		}

		// เพิ่มข้อมูลลงใน slice
		devices = append(devices, device)
	}

	// ตรวจสอบข้อผิดพลาดจาก cursor
	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return devices, nil
>>>>>>> Final_BN
}
