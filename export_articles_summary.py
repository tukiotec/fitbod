import json

with open('g:/AppGym/fitbod_key_articles_detailed.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

with open('g:/AppGym/fitbod_detailed_notes.md', 'w', encoding='utf-8') as out:
    for kid, item in data.items():
        out.write(f"# [{kid}] {item['title']}\n\n")
        out.write(item['content'])
        out.write("\n\n" + "="*80 + "\n\n")

print("Exported to fitbod_detailed_notes.md successfully.")
