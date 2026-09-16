import urllib.request
import re
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

def fetch(url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

urls = {
    "home": "https://fitbod.me/",
    "how_it_works": "https://fitbod.me/how-it-works/",
    "workout_app": "https://fitbod.me/workout-app/",
    "exercises": "https://fitbod.me/exercises/",
    "pricing": "https://fitbod.me/pricing/",
    "faq": "https://fitbod.me/faq/",
    "sitemap": "https://fitbod.me/sitemap.xml",
    "robots": "https://fitbod.me/robots.txt"
}

results = {}
for name, url in urls.items():
    print(f"Fetching {name} ({url})...")
    content = fetch(url)
    if content:
        results[name] = {
            "url": url,
            "length": len(content),
            "title": re.search(r'<title>(.*?)</title>', content, re.I).group(1) if re.search(r'<title>(.*?)</title>', content, re.I) else "",
        }
        with open(f"fitbod_{name}.html", "w", encoding="utf-8") as f:
            f.write(content)

print("Done fetching. Saved raw files.")
