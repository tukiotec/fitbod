import urllib.request
import json
import html
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Search articles with various queries
queries = ['max effort', 'amrap', 'estimated strength', 'projected 1-rep max', 'progression']

results_map = {}

for q in queries:
    url = f'https://fitbod.zendesk.com/api/v2/help_center/articles/search.json?query={urllib.parse.quote(q)}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for a in data.get('results', []):
                aid = a.get('id')
                if aid not in results_map:
                    results_map[aid] = {
                        'title': a.get('title'),
                        'snippet': a.get('snippet'),
                        'url': a.get('html_url')
                    }
    except Exception as e:
        print(f"Error querying {q}: {e}")

print(f"Total unique articles found: {len(results_map)}")
for aid, info in results_map.items():
    clean_snip = html.unescape(re.sub(r'<[^>]+>', ' ', info['snippet'])).strip()
    print(f"[{aid}] {info['title']}: {clean_snip[:150]}...")
