package main

import (
	"net/http"
	"strings"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() *httprouter.Router {
	router := httprouter.New()

	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", app.healthcheckHandler)
	router.GET("/v1/games", withCORSRouter(app.listGamesHandler))
	router.GET("/v1/games/:slug", withCORSRouter(app.getGameMetadataHandler))
	router.GET("/v1/games/:slug/preview", withCORSRouter(app.getGamePreviewHandler))
	router.GET("/v1/games/:slug/swf", withCORSRouter(app.getGameSWFHandler))

	return router
}

// func withCORS(next http.HandlerFunc) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		origin := r.Header.Get("Origin")
// 		if origin != "" && (strings.HasPrefix(origin, "http://localhost") || strings.HasPrefix(origin, "http://127.0.0.1")) {
// 			w.Header().Set("Access-Control-Allow-Origin", origin)
// 			w.Header().Set("Vary", "Origin")
// 			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
// 			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
// 		}
// 		if r.Method == "OPTIONS" {
// 			w.WriteHeader(http.StatusNoContent)
// 			return
// 		}
// 		next(w, r)
// 	}
// }

func withCORSRouter(next httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
		origin := r.Header.Get("Origin")
		if origin != "" && (strings.HasPrefix(origin, "http://localhost") || strings.HasPrefix(origin, "http://127.0.0.1") || strings.HasPrefix(origin, "https://")) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		}
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next(w, r, params)
	}
}

// func serveGame1(w http.ResponseWriter, r *http.Request) {
// 	file, err := os.ReadFile("C:\\code\\go-nextjs\\railway-go-api\\assets\\games\\2_billiards-2-play\\2_billiards_2_play.swf")
// 	if err != nil {
// 		http.NotFound(w, r)
// 		return
// 	}

// 	w.Header().Set("Content-Type", "application/x-shockwave-flash")
// 	w.Write(file)
// }
