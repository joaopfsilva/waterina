# waterina

Small Express + Python API to water plants remotely from a Raspberry Pi. Two GPIO-driven pumps controlled through an authenticated HTTP endpoint.

## Stack

- Node + Express — HTTP API
- Python + `RPi.GPIO` — pump control script, spawned per request
- Runs on port 3000

## Setup

```bash
npm install
cp secrets.example.js secrets.js  # then edit and set your API key
npm start
```

Wire the pumps to GPIO pins `16` (plant 1) and `20` (plant 2). Default water time is 1 second per request.

## API

All endpoints require the `x-api-key` header.

| Method | Path                    | Description                                   |
| ------ | ----------------------- | --------------------------------------------- |
| `GET`  | `/`                     | Health check                                  |
| `POST` | `/plants/:id/water`     | Water plant `:id` (`1` or `2`) for 1 second   |
