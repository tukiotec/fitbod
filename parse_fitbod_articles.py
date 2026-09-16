import json
import re

with open('g:/AppGym/fitbod_zendesk_search_results.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

print(f"Loaded {len(articles)} articles.")

# List all article titles
titles = [(k, v['title']) for k, v in articles.items()]
for aid, t in sorted(titles, key=lambda x: x[1]):
    print(f"[{aid}] {t}")

# Group by key themes
themes = {
    "recovery": [],
    "workout_generation": [],
    "1rm_progression": [],
    "equipment": [],
    "supersets_warmup": [],
    "goals_training_splits": []
}

for aid, a in articles.items():
    t = a['title'].lower()
    b = a['clean_body'].lower()
    
    if any(w in t or w in b for w in ['recovery', 'muscle recovery', 'fatigue', 'soreness']):
        themes['recovery'].append(a)
    if any(w in t for w in ['algorithm', 'workout', 'build', 'generate', 'generates', 'today\'s workout', 'refresh']):
        themes['workout_generation'].append(a)
    if any(w in t or w in b for w in ['1rm', 'one rep max', 'max effort', 'progression', 'progressive overload']):
        themes['1rm_progression'].append(a)
    if any(w in t for w in ['equipment', 'gym profile', 'gym', 'dumbbells', 'barbell']):
        themes['equipment'].append(a)
    if any(w in t for w in ['superset', 'circuit', 'warm up', 'warm-up', 'warmup', 'plate calculator']):
        themes['supersets_warmup'].append(a)
    if any(w in t for w in ['split', 'goal', 'training split', 'push/pull', 'bodyweight']):
        themes['goals_training_splits'].append(a)

print("\n--- Summary of Themes ---")
for k, v in themes.items():
    print(f"{k}: {len(v)} articles")

# Write out top specific articles for detailed reading
with open('g:/AppGym/fitbod_themes_summary.json', 'w', encoding='utf-8') as f:
    # Save titles and snippets
    summary_data = {k: [{'id': a['id'], 'title': a['title'], 'snippet': a['snippet'], 'body_preview': a['clean_body'][:500]} for a in v] for k, v in themes.items()}
    json.dump(summary_data, f, indent=2, ensure_ascii=False)
