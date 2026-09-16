import json
import urllib.request
import urllib.parse

# 1. Search directly in Zendesk for "export workout" or "export workout data"
queries = ["export workout data", "export csv", "export workout", "download workout"]
for q in queries:
    url = f"https://fitbod.zendesk.com/api/v2/help_center/articles/search.json?query={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            results = data.get('results', [])
            print(f"=== Query '{q}': {len(results)} results ===")
            for r in results:
                print(f"ID: {r['id']} | Title: {r['title']} | URL: {r['html_url']}")
    except Exception as e:
        print(f"Error {q}: {e}")

# Check article 30542136101527: "What Happens After Cancellation?"
# Fitbod: "You will not be charged once your trial ends. You will lose access to premium features... You can still log in and view past workouts, but logging new workouts will require a paid subscription."
