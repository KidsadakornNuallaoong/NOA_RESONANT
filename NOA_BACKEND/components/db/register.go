package db

import (
	"context"
	"errors"
	"log"
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

	// userDetails
	userDetails := bson.M{
		"username": user.Username,
		"email":    user.Email,
		"password": user.Password,
	}
	// Check email in database
	filter := bson.M{"email": user.Email}
	// Check if user already exists
	var result schema.User
	err := collection.FindOne(ctx, filter).Decode(&result)
	if err != nil && err != mongo.ErrNoDocuments {
		return false, err // Return error if not found
	} else if err != nil {
		return false, errors.New("email already exists") // Return error if email already exists
	} else if result.Email == user.Email {
		log.Println("User updated successfully.")
		// Update the userDetails in the database
		_, err := collection.UpdateOne(ctx, filter, bson.M{"$set": userDetails})
		if err != nil {
			return false, err // Return error if failed to update
		}
	}
	return true, nil
}

// generateUserID generates a unique user ID
func generateUserID() string {
	return uuid.New().String() // Generate a new UUID
}
