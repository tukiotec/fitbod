import json

with open('g:/AppGym/fitbod_key_articles_detailed.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for aid in ['15948615409687', '29976088485143', '24739986755223', '37629269518103', '29976242163223', '360004826434']:
    if aid in data:
        item = data[aid]
        print(f"=== {aid}: {item['title']} ===")
        content = item['content'].encode('ascii', errors='replace').decode('ascii')
        print(content[:600])
        print("\n" + "-"*50 + "\n")
