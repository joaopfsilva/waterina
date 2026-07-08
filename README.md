# waterina

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status: unmaintained](https://img.shields.io/badge/status-unmaintained-lightgrey.svg)](#status)

Water your plants remotely from a Raspberry Pi. A small Node/Express HTTP API
receives a request, spawns a Python script that toggles a GPIO pin for a fixed
duration, and a relay-driven pump pushes water for that long.

Runs on the Pi itself — hit it from your phone, a scheduled cron, or a smart-home hub.

## Status

**This project is no longer maintained.** It's kept online as a small hardware
side-project archive. Issues and PRs are not being triaged, and no
responsibility is taken for bugs, hardware damage, or plant fatalities.
Fork it and adapt it if you find it useful.

## Stack

- **Node + Express** — HTTP API, port 3000
- **Python 3 + `RPi.GPIO`** — pump control, spawned per request
- **Raspberry Pi** with two GPIO-controlled relays

## Prerequisites

### Hardware

- Raspberry Pi with a 40-pin GPIO header (tested on Pi 3B+)
- 2 × low-voltage water pumps (5V or 12V DC submersible)
- 2 × relay module (or logic-level MOSFET) — the Pi's GPIO cannot drive a pump directly
- Power supply matching your pump voltage, separate from the Pi
- Silicone tubing, a water reservoir, and jumper wires

See [`circuit_diagram.jpeg`](circuit_diagram.jpeg) for the full wiring layout.

### Software

- Raspberry Pi OS (Bullseye or newer)
- Node.js 18+ and npm
- Python 3 with `RPi.GPIO` (preinstalled on Raspberry Pi OS)

## Wiring

| Component        | GPIO pin (BCM) |
| ---------------- | -------------- |
| Pump 1 relay IN  | 16             |
| Pump 2 relay IN  | 20             |

Each relay switches its own power line to the pump — the Pi only supplies the
control signal. The pump power supply must share a common ground with the Pi.

## Setup

```bash
git clone https://github.com/joaopfsilva/waterina.git
cd waterina
npm install
cp secrets.example.js secrets.js   # then edit and set your API key
npm start
```

On boot you'll see:

```
http://localhost:3000
```

## Usage

All endpoints require the `x-api-key` header.

Water plant 1 for its default 1-second burst:

```bash
curl -X POST http://<pi-ip>:3000/plants/1/water \
  -H "x-api-key: your-api-key"
```

Response:

```json
{ "code": 200, "message": "Plant 1 was successfully watered" }
```

Health check:

```bash
curl http://<pi-ip>:3000/ -H "x-api-key: your-api-key"
```

## Configuration

| File                       | Purpose                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `secrets.js`               | Your API key. Not committed. Copy from `secrets.example.js`.                        |
| `scripts/pump_system.py`   | Pin mapping (`PIN_PUMP_1`, `PIN_PUMP_2`) and `WATER_TIME` in seconds. Edit to taste. |

## How it works

```
POST /plants/:id/water
  → Express route checks the API key (timing-safe compare)
  → spawns  python ./scripts/pump_system.py :id
      → Python maps id → GPIO pin
      → sets pin HIGH for WATER_TIME seconds
      → sets pin LOW, calls GPIO.cleanup()
      → prints a JSON result on stdout
  → Node parses the JSON and returns 200 or 400 with the same message
```

## Troubleshooting

- **`RuntimeError: No access to /dev/mem`** — the user running Node must be in
  the `gpio` group: `sudo usermod -aG gpio $USER`, then log out and back in.
- **`python: command not found`** — Raspberry Pi OS may only ship `python3`.
  Change `spawn('python', …)` to `spawn('python3', …)` in `routes/routes.js`.
- **Pump runs on the relay but nothing comes out** — verify the pump power
  supply is on and the pump is primed (submerged in water).

## License

MIT — see [LICENSE](LICENSE).
