import os
import requests
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from dotenv import load_dotenv

# Load API credentials from .env
load_dotenv()

ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
ORG_ID = os.getenv("ORG_ID")
API_DOMAIN = "https://www.zohoapis.in"  # Updated API domain for India

def fetch_invoices():
    """Fetch invoices from Zoho Books API and return as a DataFrame."""
    url = f"{API_DOMAIN}/books/v3/invoices?organization_id={ORG_ID}"
    headers = {
        "Authorization": f"Zoho-oauthtoken {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Check for HTTP errors
        data = response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ HTTP Request Failed: {e}")
        return None
    except requests.exceptions.JSONDecodeError:
        print("❌ Failed to parse response. Possible server error.")
        return None

    # Handle API errors
    if "code" in data and data["code"] != 0:
        if data.get("message") == "invalid_token":
            print("❌ Error: Your access token is invalid or expired. Please regenerate it.")
        else:
            print(f"❌ API Error: {data.get('message', 'Unknown error')}")
            
        return None

    # Convert invoice data to a DataFrame
    if "invoices" in data and data["invoices"]:
        invoices_df = pd.DataFrame(data["invoices"])
        invoices_df["date"] = pd.to_datetime(invoices_df["date"])
        invoices_df["total"] = invoices_df["total"].astype(float)

        # Aggregate revenue by date
        invoices_df = invoices_df.groupby("date", as_index=False)["total"].sum()
        return invoices_df
    else:
        print("✅ No invoices found.")
        return None

# Fetch invoices
invoices = fetch_invoices()

# Generate a simple revenue visualization
if invoices is not None and not invoices.empty:
    plt.figure(figsize=(10, 5))
    sns.lineplot(data=invoices, x="date", y="total", marker="o")
    plt.title("Revenue Over Time")
    plt.xlabel("Date")
    plt.ylabel("Revenue (₹)")
    plt.xticks(rotation=45)
    plt.grid(True)  # Added grid lines for readability
    plt.show()