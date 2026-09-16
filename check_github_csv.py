from curl_cffi import requests
import re
import urllib.parse

query = "site:github.com fitbod WorkoutExport.csv"
url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"

try:
    r = requests.get(url, impersonate='chrome120', timeout=15)
    matches = re.findall(r'<a class="result__snippet[^"]*"[^>]*>(.*?)</a>', r.text, re.S)
    for m in matches[:6]:
        clean = re.sub(r'<[^>]+>', '', m).strip()
        print("->", clean)
except Exception as e:
    print("Error:", e)
