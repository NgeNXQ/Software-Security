import json
import requests

URL = "https://kpi.eu.auth0.com/api/v2/users"

HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjVCZTlBZFhrMERaUjhmR1dZYjdkViJ9.eyJpc3MiOiJodHRwczovL2twaS5ldS5hdXRoMC5jb20vIiwic3ViIjoiSkl2Q081YzJJQkhsQWUycGF0bjZsNnE1SDM1cXh0aTBAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8va3BpLmV1LmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNzI3NjUwNzA3LCJleHAiOjE3Mjc3MzcxMDcsInNjb3BlIjoicmVhZDp1c2VycyBjcmVhdGU6dXNlcnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJhenAiOiJKSXZDTzVjMklCSGxBZTJwYXRuNmw2cTVIMzVxeHRpMCJ9.fXnVM6clYkUp3HsYBPnvzsOgBWxP6rejao7depzsPu5wlQApwtnxuTsptevvY-YFfJjS9imIS9JQpV_T317nKSo9HGrpeZQy2E_2xiMl4ht1SLvjXQD9z-nDMUvaw0uz93uYgwCGCr5U1reBkaxhMmNLCjeOHXueyCMZUnsaVuuZg32S_apaRAOPgmx5ump4-4aBtu4Axk-o2WBxFEs6aPzMtOwu7zF3wCTZ5juHzH-rukKBrKXCl7CJmOX-q5JQjOe0DC5ZUwu9PfThsYju6Fer4vymJqdL7Swyz6chaC-83DdR90pecSh4lY2RLB5z2B12JOr0P0U9U_-KUl1QQg"
}

PAYLOAD = json.dumps({
    "email": "denis.babich@mail.com",
    "user_metadata": {},
    "blocked": False,
    "email_verified": False,
    "app_metadata": {},
    "given_name": "Denys",
    "family_name": "Babich",
    "name": "Denys",
    "nickname": "Ngenx",
    "picture": "https://i.etsystatic.com/26254942/r/il/f54dcc/4754579609/il_300x300.4754579609_aps7.jpg",
    "connection": "Username-Password-Authentication",
    "password": "BabichDenysPassword123@",
    "verify_email": False,
})

response = requests.request("POST", URL, headers = HEADERS, data = PAYLOAD)

print(response.text)
print(response.status_code)