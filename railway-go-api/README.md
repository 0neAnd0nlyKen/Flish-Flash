# railway-go-api
This contains the code necessary to bootstrap a simple REST api in go with minimal 3rd party dependencies.

## API Endpoints

### Games Metadata API

The API serves Flash game metadata and files loaded from `assets/games/games-metadata.json`.

#### Get All Games
```
GET /v1/games
```

Returns a list of all available games with basic information and links to metadata and preview endpoints.

**Response:**
```json
[
  {
    "slug": "2_billiards-2-play",
    "title": "Billiards 2 Play",
    "metadata": "/v1/games/2_billiards-2-play",
    "preview": "/v1/games/2_billiards-2-play/preview"
  },
  ...
]
```

#### Get Game Metadata
```
GET /v1/games/:slug
```

Returns full metadata for a specific game including title, creator, description, date, subject, emulator info, and SWF file path.

**Example:**
```
GET /v1/games/2_billiards-2-play
```

**Response:**
```json
{
  "metadata": {
    "identifier": "2_billiards-2-play",
    "title": "Billiards 2 Play",
    "creator": "...",
    "description": "...",
    "subject": ["Sports", "Billiards"],
    ...
  },
  "swf_file_path": "flash_games_download_updated/2_billiards-2-play/2_billiards_2_play.swf"
}
```

#### Get Game Preview Image
```
GET /v1/games/:slug/preview
```

Returns the preview/thumbnail image for a game. Looks for `__ia_thumb.jpg`, `preview.png`, or `preview.jpg` in the game directory.

**Example:**
```
GET /v1/games/2_billiards-2-play/preview
```

**Response:** JPEG or PNG image file

#### Get Game SWF File
```
GET /v1/games/:slug/swf
```

Returns the SWF (Flash) file for a game. Uses the `swf_file_path` from the game metadata to serve the actual game file.

**Example:**
```
GET /v1/games/2_billiards-2-play/swf
```

**Response:** application/x-shockwave-flash file (binary)

#### Health Check
```
GET /v1/healthcheck
```

Returns API health status.

## Usage Example

To load and play a game in a browser with Ruffle (Flash emulator):

```javascript
// Get game metadata
const metadata = await fetch('/v1/games/2_billiards-2-play').then(r => r.json());

// Get preview image
const preview = '/v1/games/2_billiards-2-play/preview';

// Get SWF file
const swfUrl = '/v1/games/2_billiards-2-play/swf';

// Load in Ruffle player
const ruffle = window.RufflePlayer.newest();
const player = ruffle.createPlayer();
player.load(swfUrl);
```

## CORS Support

CORS headers are enabled for localhost origins (`http://localhost`, `http://127.0.0.1`). Production deployments should configure CORS appropriately in the `withCORSRouter` function.
