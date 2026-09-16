from curl_cffi import requests
import re
import urllib.parse

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
query = "site:reddit.com/r/fitbod export workout data csv"
url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"

try:
    r = requests.get(url, impersonate='chrome120', headers=headers, timeout=15)
    print("Status:", r.status_code)
    matches = re.findall(r'<a class="result__snippet[^"]*"[^>]*>(.*?)</a>', r.text, re.S)
    for m in matches[:8]:
        clean = re.sub(r'<[^>]+>', '', m).strip()
        print("->", clean)
except Exception as e:
    print("Error:", e)

# Also check query: fitbod app "export workout"
query2 = "how to export workout data from fitbod app"
url2 = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query2)}"
try:
    r2 = requests.get(url2, impersonate='chrome120', headers=headers, timeout=15)
    matches2 = re.findall(r'<a class="result__snippet[^"]*"[^>]*>(.*?)</a>', r2.text, re.S)
    print("\n--- General results ---")
    for m in matches2[:8]:
        clean = re.sub(r'<[^>]+>', '', m).strip()
        print("=>", clean)
except Exception as e:
    print("Error 2:", e)
