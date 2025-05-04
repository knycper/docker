import requests
import time

print("czekam 3s na test")

time.sleep(3)

response = requests.get("http://app:3000")

print("odpowiedz z zapytania: ", response)