package db

import (
	"context"
	"errors"
	"time"

	env "GOLANG_SERVER/components/env"
	schema "GOLANG_SERVER/components/schema"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// Store Email and Password to mongoDB collection user
func StoreUser(user schema.User) (bool, error) {
	collection := client.Database(env.GetEnv("MONGO_DB")).Collection(env.GetEnv("MONGO_USERCOLLECTION")) // Get collection user
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)                             // Create a context with timeout
	defer cancel()                                                                                       // Defer cancel the context

	// Generate user ID
	user.ID = generateUserID()

	// Check if user already exists
	filter := bson.M{"email": user.Email}
	var result schema.User
	err := collection.FindOne(ctx, filter).Decode(&result)
	if err == nil {
		return false, errors.New("user already exists")
	} else if err != mongo.ErrNoDocuments { // If error is not "No Documents"
		return false, err // Return error
	} else {
		_, err := collection.InsertOne(ctx, user) // Insert user to collection
		if err != nil {
			return false, err
		}
	}

	return true, nil
}

// generateUserID generates a unique user ID
func generateUserID() string {
	return uuid.New().String() // Generate a new UUID
}
