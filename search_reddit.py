import urllib.request
import urllib.parse
import re
import html
import sys

sys.stdout.reconfigure(encoding='utf-8')

def search_ddg(query):
    url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(query)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            snippets = re.findall(r'<a class="result__snippet[^>]*>(.*?)</a>', content, re.DOTALL)
            print(f"=== Results for: {query} ===")
            for s in snippets[:6]:
                clean = html.unescape(re.sub(r'<[^>]+>', ' ', s)).strip()
                clean = re.sub(r'\s+', ' ', clean)
                print('-', clean)
    except Exception as e:
        print('Error:', e)

search_ddg('site:reddit.com/r/fitbod "max effort day" frequency')
search_ddg('site:reddit.com/r/fitbod "max effort" how often')
search_ddg('site:reddit.com/r/fitbod "max effort day" trigger')
