import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

# Step 1: Generate Authorization URL
AUTH_URL = (
    f"https://accounts.zoho.in/oauth/v2/auth?"
    f"response_type=code&client_id={CLIENT_ID}&"
    f"scope=ZohoBooks.fullaccess.ALL&"
    f"redirect_uri={REDIRECT_URI}&"
    f"access_type=offline"
)

print("🔗 Open this URL in your browser and authorize access:")
print(AUTH_URL)

# Step 2: Exchange Authorization Code for Access Token
AUTH_CODE = input("Enter the authorization code from the URL: ").strip()

TOKEN_URL = "https://accounts.zoho.in/oauth/v2/token"
payload = {
    "grant_type": "authorization_code",
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "redirect_uri": REDIRECT_URI,
    "code": AUTH_CODE,
}

try:
    response = requests.post(TOKEN_URL, data=payload)
    response.raise_for_status()  # Raise an error for bad status codes
    token_data = response.json()

    if "access_token" in token_data:
        print("\n✅ Access Token Generated Successfully!\n")
        print(token_data)
    else:
        print("\n❌ Error Generating Token:", token_data)

except requests.exceptions.RequestException as e:
    print(f"\n❌ HTTP Request Failed: {e}")