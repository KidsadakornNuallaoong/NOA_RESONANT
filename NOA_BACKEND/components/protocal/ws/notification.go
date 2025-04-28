package ws

import (
	"bufio"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

// Global Map สำหรับ userID → WebSocket connection
var (
	fileLock sync.Mutex // 🔥 Lock สำหรับการอ่านเขียน notification.json
)

func HandleHistory(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("userID")
	if userID == "" {
		http.Error(w, "Missing userID", http.StatusBadRequest)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("[HISTORY] Upgrade failed:", err)
		return
	}
	defer conn.Close()

	log.Printf("[HISTORY] User %s connected", userID)

	// อ่าน notification.json ครั้งแรก
	notifications, err := readNotifications("notification.json")
	if err != nil {
		log.Printf("[ERROR] Failed to read notification.json: %v", err)
		return
	}

	// ส่งข้อมูลเริ่มต้นไปยัง client
	for _, line := range notifications {
		var notification map[string]interface{}
		if err := json.Unmarshal([]byte(line), &notification); err != nil {
			log.Printf("[ERROR] Failed to parse notification: %v", err)
			continue
		}

		if notificationUserID, ok := notification["userID"].(string); ok && notificationUserID == userID {
			err = conn.WriteMessage(websocket.TextMessage, []byte(line))
			if err != nil {
				log.Printf("[HISTORY] Write message failed: %v", err)
				return
			}
			log.Printf("[HISTORY] Sent notification to user %s: %s", userID, line)
		}
	}

	// ใช้ Ticker เพื่อตรวจสอบการเปลี่ยนแปลงของ notification.json
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			// อ่าน notification.json ใหม่
			notifications, err := readNotifications("notification.json")
			if err != nil {
				log.Printf("[ERROR] Failed to read notification.json: %v", err)
				continue
			}

			// เก็บข้อมูลที่ยังไม่ได้ส่ง
			var remainingNotifications []string

			// ส่งข้อมูลใหม่ไปยัง client
			for _, line := range notifications {
				var notification map[string]interface{}
				if err := json.Unmarshal([]byte(line), &notification); err != nil {
					log.Printf("[ERROR] Failed to parse notification: %v", err)
					remainingNotifications = append(remainingNotifications, line) // เก็บข้อมูลที่ parse ไม่ได้
					continue
				}

				if notificationUserID, ok := notification["userID"].(string); ok && notificationUserID == userID {
					err = conn.WriteMessage(websocket.TextMessage, []byte(line))
					if err != nil {
						log.Printf("[HISTORY] Write message failed: %v", err)
						return // client หลุด → ออกจากฟังก์ชัน
					}
					log.Printf("[HISTORY] Sent notification to user %s: %s", userID, line)
				} else {
					// เก็บข้อมูลที่ไม่ใช่ของ user นี้
					remainingNotifications = append(remainingNotifications, line)
				}
			}

			// เขียนข้อมูลที่เหลือกลับไปที่ notification.json
			if err := writeNotifications("notification.json", remainingNotifications); err != nil {
				log.Printf("[ERROR] Failed to update notification.json: %v", err)
			}

		case <-time.After(60 * time.Second):
			log.Printf("[HISTORY] Connection timeout for user %s", userID)
			return
		}
	}
}

func readNotifications(filename string) ([]string, error) {
	fileLock.Lock()
	defer fileLock.Unlock()

	file, err := os.Open(filename)
	if err != nil {
		// ถ้าไฟล์ไม่เจอ = ไม่มี notification ก็ไม่ error
		if errors.Is(err, os.ErrNotExist) {
			return []string{}, nil
		}
		return nil, err
	}
	defer file.Close()

	var notifications []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		notifications = append(notifications, scanner.Text())
	}
	if err := scanner.Err(); err != nil {
		return nil, err
	}
	return notifications, nil
}

func writeNotifications(filename string, notifications []string) error {
	fileLock.Lock()
	defer fileLock.Unlock()

	data := strings.Join(notifications, "\n")
	return os.WriteFile(filename, []byte(data), 0644)
}
