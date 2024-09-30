import json
import http.client
from typing import Tuple

def get_access_token(url: str, payload: str) -> str:
    connection = http.client.HTTPSConnection(url)
    headers = {'content-type': "application/json"}
    connection.request("POST", "/oauth/token", payload, headers)
    data = connection.getresponse().read()
    return json.loads(data.decode("utf-8"))['access_token']

def create_user(url: str, access_token: str, payload: str) -> Tuple[str, int]:
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }

    connection = http.client.HTTPSConnection(url)
    connection.request("POST", "/api/v2/users", payload, headers)
    result = connection.getresponse()
    data = result.read()

    return data.decode("utf-8"), result.status

if __name__ == "__main__":
    url = "dev-hfzb6seuth5jesyp.eu.auth0.com"

    payload_token = json.dumps({
        "client_id": "MvGakD6bdVR0GezUBWgcEbBqtjegQopG",
        "client_secret": "D796h3AHQg-JJxsa2OiMmfbJ3tcW9qSowOY-FaDWQ0vxVdsGuLln1xNz45lUtWRo",
        "audience": "https://dev-hfzb6seuth5jesyp.eu.auth0.com/api/v2/",
        "grant_type": "client_credentials"
    })

    access_token = get_access_token("dev-hfzb6seuth5jesyp.eu.auth0.com", payload_token)

    payload_user = json.dumps({
        "email": "denis.babich@test.com",
        "user_metadata": {},
        "blocked": False,
        "email_verified": False,
        "app_metadata": {},
        "given_name": "Denys",
        "family_name": "Babich",
        "name": "Denys",
        "nickname": "TestUser",
        "picture": "https://i.etsystatic.com/26254942/r/il/f54dcc/4754579609/il_300x300.4754579609_aps7.jpg",
        "connection": "Username-Password-Authentication",
        "password": "BabichDenysPassword123@",
        "verify_email": False,
    })

    response_data, status_code = create_user(url, access_token, payload_user)

    print(f"Response Data: {response_data}")
    print(f"Status Code: {status_code}")