import urllib.request
import urllib.parse
import json
import re

queries = ['export', 'csv', 'backup', 'export workout', 'download data', 'expired']

all_found = {}
for q in queries:
    url = f"https://fitbod.zendesk.com/api/v2/help_center/articles/search.json?query={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            for r in data.get('results', []):
                aid = r['id']
                if aid not in all_found:
                    body = r.get('body', '')
                    clean_body = re.sub(r'<[^>]+>', ' ', body)
                    clean_body = re.sub(r'\s+', ' ', clean_body).strip()
                    all_found[aid] = {
                        'id': aid,
                        'title': r.get('title'),
                        'url': r.get('html_url'),
                        'body': clean_body
                    }
    except Exception as e:
        print(f"Error {q}: {e}")

print(f"Found {len(all_found)} articles total.")

# Look specifically for export articles
for aid, a in all_found.items():
    if any(k in a['title'].lower() for k in ['export', 'csv', 'data', 'backup', 'history']):
        print(f"[{aid}] {a['title']}")

with open('g:/AppGym/fitbod_export_articles.json', 'w', encoding='utf-8') as f:
    json.dump(all_found, f, indent=2, ensure_ascii=False)
