package main

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"

	_ "github.com/lib/pq"
)

type user struct {
	Id    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

var (
	activeGames = make(map[string]bool) // Tracks running games
	mutex       = &sync.Mutex{}
)

func requireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || len(authHeader) < 8 || authHeader[:7] != "Bearer " {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		token := authHeader[7:]
		// Optionally: validate token here (e.g., check against a known value or decode JWT)
		if token != "your-secret-token" { // Replace with your real validation logic
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}
		next(w, r)
	}
}

func main() {
	// db, err := sql.Open("postgres", "user=postgres password=postgres dbname=postgres sslmode=disable")
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// defer db.Close()

	// _, err = db.Exec("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT, email TEXT)")
	// if err != nil {
	// 	log.Fatal(err)
	// }

	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		//print bearer token
		authHeader := r.Header.Get("Authorization")
		if authHeader != "" {
			w.Write([]byte(authHeader))
		} else {
			w.Write([]byte("No Authorization "))
		}
	})
	// mux.HandleFunc("POST /api/go/login", login(db))
	// mux.HandleFunc("GET /api/go/users", requireAuth(getUsers(db)))
	// mux.HandleFunc("POST /api/go/users", requireAuth(createUser(db)))
	mux.HandleFunc("GET /games/", withCORS(serveGame))
	mux.HandleFunc("/terminate/", terminateGame)
	// mux.HandleFunc("GET /api/go/users/{id}", getUser(db))
	// mux.HandleFunc("PUT /api/go/users/{id}", updateUser(db))
	// mux.HandleFunc("DELETE /api/go/users/{id}", deleteUser(db))

	log.Println("Server started on :8080")
	http.ListenAndServe(":8080", mux)

}
func serveGame(w http.ResponseWriter, r *http.Request) {
	gameID := r.URL.Path[len("/games/"):]
	filePath := "./games/" + gameID + ".swf"

	// Example: hardcoded metadata for demonstration
	// gameMeta := map[string]struct {
	// 	Genres []string
	// 	Title  string
	// }{
	// 	"1": {Genres: []string{"platformer", "action"}, Title: "Classic Game 1"},
	// 	"2": {Genres: []string{"puzzle"}, Title: "Classic Game 2"},
	// 	"3": {Genres: []string{"strategy", "simulation"}, Title: "Classic Game 3"},
	// }

	// meta, ok := gameMeta[gameID]
	// if !ok {
	// 	http.NotFound(w, r)
	// 	return
	// }

	file, err := os.ReadFile(filePath)
	if err != nil {
		http.NotFound(w, r)
		return
	}

	// Encode SWF as base64
	encoded := make([]byte, base64.StdEncoding.EncodedLen(len(file)))
	base64.StdEncoding.Encode(encoded, file)

	resp := struct {
		File string `json:"file"`
		// Genres []string `json:"genres"`
		// ID     string   `json:"id"`
		// Title  string   `json:"title"`
	}{
		File: string(encoded),
		// Genres: meta.Genres,
		// ID:     gameID,
		// Title:  meta.Title,
	}

	w.Header().Set("Content-Type", "application/json")
	// json.NewEncoder(w).Encode(resp)
	json.NewEncoder(w).Encode([]interface{}{resp})
	// io.Copy(w, strings.NewReader(string(encoded)))

	// gameID := r.URL.Path[len("/games/"):]
	// filePath := "./games/" + gameID + ".swf"

	// // Track active game (Goroutine-safe)
	// mutex.Lock()
	// activeGames[gameID] = true
	// mutex.Unlock()

	// file, err := os.Open(filePath)
	// if err != nil {
	// 	http.NotFound(w, r)
	// 	return
	// }
	// defer file.Close()

	// w.Header().Set("Content-Type", "application/x-shockwave-flash")
	// io.Copy(w, file)
}

// Terminate game (simulate cleanup)
func terminateGame(w http.ResponseWriter, r *http.Request) {
	gameID := r.URL.Path[len("/terminate/"):]

	mutex.Lock()
	delete(activeGames, gameID)
	mutex.Unlock()

	w.WriteHeader(http.StatusOK)
}
func login(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var u user
		if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		// Check if the user exists in the database
		var id int
		err := db.QueryRow("SELECT id FROM users WHERE name = $1 AND email = $2", u.Name, u.Email).Scan(&id)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			} else {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}

func getUsers(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, name, email FROM users")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var users []user
		for rows.Next() {
			var u user
			if err := rows.Scan(&u.Id, &u.Name, &u.Email); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			users = append(users, u)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(users)
	}
}

func createUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var u user
		if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		// _, err := db.Exec("INSERT INTO users (example, example@example.com) VALUES (name, email)")
		_, err := db.Exec("INSERT INTO users (name, email) VALUES ($1, $2)", u.Name, u.Email)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
	}
}

// func getUser(db *sql.DB) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {

// 		id := mux.Vars(r)["id"]
// 		var u user
// 		if err := db.QueryRow("SELECT id, name, email FROM users WHERE id = $1", id).Scan(&u.Id, &u.Name, &u.Email); err != nil {
// 			if err == sql.ErrNoRows {
// 				http.NotFound(w, r)
// 			} else {
// 				http.Error(w, err.Error(), http.StatusInternalServerError)
// 			}
// 			return
// 		}
// 		w.Header().Set("Content-Type", "application/json")
// 		json.NewEncoder(w).Encode(u)
// 	}
// }
// func updateUser(db *sql.DB) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		id := mux.Vars(r)["id"]
// 		var u user
// 		if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
// 			http.Error(w, err.Error(), http.StatusBadRequest)
// 			return
// 		}
// 		_, err := db.Exec("UPDATE users SET name = $1, email = $2 WHERE id = $3", u.Name, u.Email, id)
// 		if err != nil {
// 			http.Error(w, err.Error(), http.StatusInternalServerError)
// 			return
// 		}
// 		w.WriteHeader(http.StatusNoContent)
// 	}
// }
// func deleteUser(db *sql.DB) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		id := mux.Vars(r)["id"]
// 		_, err := db.Exec("DELETE FROM users WHERE id = $1", id)
// 		if err != nil {
// 			http.Error(w, err.Error(), http.StatusInternalServerError)
// 			return
// 		}
// 		w.WriteHeader(http.StatusNoContent)
// 	}
// }

func withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin != "" && (strings.HasPrefix(origin, "http://localhost") || strings.HasPrefix(origin, "http://127.0.0.1")) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		}
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next(w, r)
	}
}
