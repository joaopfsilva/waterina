import RPi.GPIO as GPIO
import time
import sys
import json

PIN_PUMP_1 = 16
PIN_PUMP_2 = 20
WATER_TIME = 1 #seconds

def setup_pump_system(pin_id):
  GPIO.setmode(GPIO.BCM)

  GPIO.setwarnings(True)
  GPIO.setup(pin_id, GPIO.OUT)
  GPIO.output(pin_id, GPIO.LOW)

def turn_off_pumps(pin_id):
  try:
    GPIO.output(pin_id, GPIO.LOW)
    GPIO.cleanup()
  except RuntimeError as e:
    sys.stdout.write(json.dumps({'result': 'NOK', 'message': e}))

def map_plant_id_to_pin(plant_id):
  return { 1: PIN_PUMP_1, 2: PIN_PUMP_2 }.get(int(plant_id), None)

def water_plant(plant_id):
  pin_id = map_plant_id_to_pin(plant_id)

  if pin_id == None:
    sys.stdout.write(json.dumps({'result': 'NOK', 'message': 'Invalid plant id: {}'.format(plant_id)}))
  else:
    try:
      setup_pump_system(pin_id)
      GPIO.output(pin_id, GPIO.HIGH)
      time.sleep(WATER_TIME)
      GPIO.output(pin_id, GPIO.LOW)
      sys.stdout.write(json.dumps({'result': 'OK', 'message': 'Plant {} was successfully watered'.format(plant_id)}))
    except:
      sys.stdout.write(json.dumps({'result': 'NOK', 'message': 'Something went wrong'}))
    finally:
      turn_off_pumps(pin_id)


plant_id = sys.argv[1]
response = water_plant(plant_id)
sys.stdout.flush()
