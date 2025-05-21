import requests

url = "https://fs-backend-production-a2fe.up.railway.app/api/auth/login"

# Replace with real credentials you know exist
payload = {
    "email": "andres.roblesgilcandas.com",
    "password": "Famrg9461"
}

response = requests.post(url, json=payload)

print("Status Code:", response.status_code)
print("Response:", response.text)
