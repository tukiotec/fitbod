import urllib.request
import json
import html
import re
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

def fetch_and_save(article_id, filename):
    url = f'https://fitbod.zendesk.com/api/v2/help_center/en-us/articles/{article_id}.json'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        art = data.get('article', {})
        body = art.get('body', '')
        clean = html.unescape(body)
        title = art.get('title', '')
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"# {title}\n\n")
            f.write(clean)
        print(f"Saved {title} to {filename}")

fetch_and_save(360033675553, 'fitbod_max_effort_day.html')
fetch_and_save(16254175592215, 'fitbod_algorithm_qa.html')
fetch_and_save(360004429814, 'fitbod_how_creates_workout.html')
