import requests

url = "http://localhost:8000/api/v1/titles/9"

response = requests.get(url)

print(response.json())
