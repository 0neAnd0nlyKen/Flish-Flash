package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/julienschmidt/httprouter"
)

type GameMetadata struct {
	Metadata    map[string]interface{} `json:"metadata"`
	SwfFilePath string                 `json:"swf_file_path"`
}

type GamesMetadataDB map[string]GameMetadata

var gamesMetadataDB GamesMetadataDB

// LoadGamesMetadata loads games-metadata.json from assets/games directory
func LoadGamesMetadata() error {
	metadataPath := filepath.Join(".", "assets", "games", "games-metadata.json")

	data, err := os.ReadFile(metadataPath)
	if err != nil {
		return fmt.Errorf("failed to read games-metadata.json: %w", err)
	}

	err = json.Unmarshal(data, &gamesMetadataDB)
	if err != nil {
		return fmt.Errorf("failed to parse games-metadata.json: %w", err)
	}

	return nil
}

// listGamesHandler returns a list of all available games
func (app *application) listGamesHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	games := make([]map[string]interface{}, 0, len(gamesMetadataDB))

	for slug, game := range gamesMetadataDB {
		gameInfo := map[string]interface{}{
			"slug":     slug,
			"title":    game.Metadata["title"],
			"metadata": fmt.Sprintf("/v1/games/%s", slug),
			"preview":  fmt.Sprintf("/v1/games/%s/preview", slug),
		}
		games = append(games, gameInfo)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(games)
}

// getGameMetadataHandler returns full metadata for a specific game
func (app *application) getGameMetadataHandler(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	slug := params.ByName("slug")

	game, exists := gamesMetadataDB[slug]
	if !exists {
		http.Error(w, "Game not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(game)
}

// getGamePreviewHandler serves the preview image for a game
func (app *application) getGamePreviewHandler(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	slug := params.ByName("slug")

	// Check if game exists
	_, exists := gamesMetadataDB[slug]
	if !exists {
		http.Error(w, "Game not found", http.StatusNotFound)
		return
	}

	// Look for preview image (__ia_thumb.jpg or preview.png)
	gameDir := filepath.Join(".", "assets", "games", slug)

	// Try common thumbnail/preview filenames
	previewCandidates := []string{
		filepath.Join(gameDir, "__ia_thumb.jpg"),
		filepath.Join(gameDir, "preview.png"),
		filepath.Join(gameDir, "preview.jpg"),
	}

	var previewPath string
	var contentType string

	for _, candidate := range previewCandidates {
		if _, err := os.Stat(candidate); err == nil {
			previewPath = candidate
			if filepath.Ext(candidate) == ".png" {
				contentType = "image/png"
			} else {
				contentType = "image/jpeg"
			}
			break
		}
	}

	if previewPath == "" {
		http.Error(w, "Preview image not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", contentType)
	http.ServeFile(w, r, previewPath)
}

// getGameSWFHandler serves the SWF file for a game
func (app *application) getGameSWFHandler(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	slug := params.ByName("slug")

	game, exists := gamesMetadataDB[slug]
	if !exists {
		http.Error(w, "Game not found", http.StatusNotFound)
		return
	}

	// Construct the SWF file path from the metadata
	swfPath := filepath.Join(".", "assets", game.SwfFilePath)

	// Check if file exists
	if _, err := os.Stat(swfPath); err != nil {
		http.Error(w, "SWF file not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/x-shockwave-flash")
	w.Header().Set("Content-Disposition", fmt.Sprintf("inline; filename=%q", filepath.Base(swfPath)))
	http.ServeFile(w, r, swfPath)
}

// Preferences represents the incoming preference payload from the frontend
type Preferences struct {
	Total        int `json:"Total"`
	Arcade       int `json:"Arcade"`
	Action       int `json:"Action"`
	Puzzle       int `json:"Puzzle"`
	Adventure    int `json:"Adventure"`
	Sports       int `json:"Sports"`
	DressUpGames int `json:"Dress_up_games"`
	Driving      int `json:"Driving"`
	Slacking     int `json:"Slacking"`
	Platformer   int `json:"Platformer"`
	Simulation   int `json:"Simulation"`
}

// postGamesHandler accepts a POST with preferences and returns an array of game slugs.
// For now it returns five duplicates of "2_billiards-2-play" as a placeholder.
func (app *application) postGamesHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var pref Preferences
	dec := json.NewDecoder(r.Body)
	if err := dec.Decode(&pref); err != nil {
		// If there's a decoding error, log and continue—use defaults.
		// Responding with Bad Request is also reasonable, but frontend may send empty body.
		// We'll log and continue to return the placeholder list.
		fmt.Printf("Warning: failed to decode preferences: %v\n", err)
	}

	// Placeholder response: 5 copies of the same slug
	result := make([]string, 3)
	for i := range result {
		result[i] = "2_billiards-2-play"
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(result); err != nil {
		http.Error(w, "failed to encode response", http.StatusInternalServerError)
		return
	}
}
