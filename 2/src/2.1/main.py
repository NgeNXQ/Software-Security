import requests

URL = "https://kpi.eu.auth0.com/oauth/token"

HEADERS = { "content-type": "application/x-www-form-urlencoded" }

PAYLOAD = {
    "audience": "https://kpi.eu.auth0.com/api/v2/",
    "grant_type": "client_credentials",
    "client_id": "JIvCO5c2IBHlAe2patn6l6q5H35qxti0",
    "client_secret": "ZRF8Op0tWM36p1_hxXTU-B0K_Gq_-eAVtlrQpY24CasYiDmcXBhNS6IJMNcz1EgB"
}

response = requests.post(URL, headers = HEADERS, data = PAYLOAD)

print(response.json())