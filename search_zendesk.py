import urllib.request
import urllib.parse
import json
import re

queries = [
    'recovery',
    'algorithm',
    '1RM',
    'one rep max',
    'workout generation',
    'equipment',
    'warm up',
    'superset',
    'plate calculator',
    'periodization',
    'target muscle',
    'workout duration',
    'fitness goal',
    'custom workout'
]

all_results = {}

for q in queries:
    url = f"https://fitbod.zendesk.com/api/v2/help_center/articles/search.json?query={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            results = data.get('results', [])
            print(f'Query "{q}": {len(results)} articles found')
            for r in results:
                aid = r['id']
                if aid not in all_results:
                    # Clean body text
                    body = r.get('body', '')
                    clean_body = re.sub(r'<[^>]+>', ' ', body)
                    clean_body = re.sub(r'\s+', ' ', clean_body).strip()
                    all_results[aid] = {
                        'id': aid,
                        'title': r.get('title'),
                        'snippet': r.get('snippet'),
                        'clean_body': clean_body,
                        'html_url': r.get('html_url')
                    }
    except Exception as e:
        print(f'Error for query {q}: {e}')

print(f'Total unique articles collected: {len(all_results)}')
with open('g:/AppGym/fitbod_zendesk_search_results.json', 'w', encoding='utf-8') as f:
    json.dump(all_results, f, indent=2, ensure_ascii=False)
