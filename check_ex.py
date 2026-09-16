with open('src/data/exerciseCatalog.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'"name":\s*"([^"]+)"', text)
print(f"Total exercises: {len(matches)}")
for i, m in enumerate(matches, 1):
    print(f"{i}. {m}")
