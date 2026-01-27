package main

import (
	"net/http"
	"os"
	"strings"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() *httprouter.Router {
	router := httprouter.New()

	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", app.healthcheckHandler)
	// router.HandlerFunc(http.MethodGet, "/v1/games/1/", withCORS(serveGame1))
	// router.HandlerFunc(http.MethodGet, "/v1/games/1/", withCORS(serveGame1))
	router.HandlerFunc(http.MethodGet, "/v1/games/1/swf", withCORS(serveGame1))

	return router
}

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

func serveGame1(w http.ResponseWriter, r *http.Request) {
	file, err := os.ReadFile("C:\\code\\go-nextjs\\railway-go-api\\assets\\games\\2_billiards-2-play\\2_billiards_2_play.swf")
	if err != nil {
		http.NotFound(w, r)
		return
	}

	w.Header().Set("Content-Type", "application/x-shockwave-flash")
	w.Write(file)
}
