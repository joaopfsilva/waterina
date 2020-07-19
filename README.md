# waterina
Waterina is a system to control remotely 2 water pumps and 2 moisture sensors (**TBD**), connected to a raspberry pi.

### Stack and Specs
- node + express -> API
- python + RPi.GPIO -> control the pumps
- port 3000
- default water time set to 1 second

### API endpoints
`/` -> just a friendly welcome message

`/plants/:id/water` -> water plant :id during X seconds

`/plants/` -> **TBD** show available plants

`/plants/:id/stats` -> **TBD** read moisture sensor to check if the plants needs water

`/plants/stats` -> **TBD** read all moisture sensors and check if any plant needs water


### Next Steps
 1. Connect the moisture sensors to the raspberry pi and start reading values.
 2. Create an interface (ReactJs or React Native).
 2. Create database (MySQL or PostgreSQL) to track water times and moisture sensors.
 3. Docker
 4. Possibility of a lot of ideas that will popup in mid-time.
