import urllib.request
import json
import re

url = 'https://fitbod.zendesk.com/api/v2/help_center/en-us/articles/31812440426391.json'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        art = data.get('article', {})
        print('Title:', art.get('title'))
        body = art.get('body', '')
        clean = re.sub(r'<[^>]+>', ' ', body)
        clean = re.sub(r'\s+', ' ', clean).strip()
        with open('g:/AppGym/fitbod_beta_program_article.txt', 'w', encoding='utf-8') as f:
            f.write(clean)
        print('Wrote to fitbod_beta_program_article.txt successfully.')
except Exception as e:
    print('Error:', e)
