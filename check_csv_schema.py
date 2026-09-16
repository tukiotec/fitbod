from curl_cffi import requests
import re
import urllib.parse

headers = {'User-Agent': 'Mozilla/5.0'}
query = "fitbod export workout data csv columns headers Date Exercise reps weight"
url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"

try:
    r = requests.get(url, impersonate='chrome120', headers=headers, timeout=15)
    matches = re.findall(r'<a class="result__snippet[^"]*"[^>]*>(.*?)</a>', r.text, re.S)
    for m in matches[:8]:
        clean = re.sub(r'<[^>]+>', '', m).strip()
        print("->", clean)
except Exception as e:
    print("Error:", e)
