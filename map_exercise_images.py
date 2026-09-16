import urllib.request
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})

with urllib.request.urlopen(req, timeout=15) as resp:
    data = json.loads(resp.read().decode())

print(f"Loaded {len(data)} exercises from database.")

# Map our catalog IDs to images
base_url = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/"

targets = [
    ("barbell_bench_press", "Barbell Bench Press - Medium Grip"),
    ("incline_dumbbell_press", "Incline Dumbbell Press"),
    ("cable_chest_fly", "Cable Incline Fly"),
    ("push_ups", "Pushups"),
    ("chest_dip", "Dips - Chest Version"),
    ("barbell_deadlift", "Barbell Deadlift"),
    ("lat_pulldown", "Cable Wide-Grip Lat Pulldown"),
    ("barbell_row", "Bent Over Two-Arm Long Barbell Row"),
    ("pull_up", "Pullups"),
    ("seated_cable_row", "Seated Cable Rows"),
    ("overhead_press", "Standing Military Press"),
    ("dumbbell_lateral_raise", "Side Lateral Raise"),
    ("face_pull", "Face Pull"),
    ("barbell_bicep_curl", "Barbell Curl"),
    ("dumbbell_hammer_curl", "Hammer Curls"),
    ("tricep_rope_pushdown", "Triceps Pushdown - Rope Attachment"),
    ("skull_crusher", "Decline Close-Grip Bench To Skull Crusher"),
    ("barbell_squat", "Barbell Full Squat"),
    ("dumbbell_walking_lunges", "Dumbbell Lunges"),
    ("leg_press", "Leg Press"),
    ("romanian_deadlift", "Romanian Deadlift"),
    ("seated_leg_curl", "Seated Leg Curl"),
    ("standing_calf_raise", "Standing Calf Raises"),
    ("hanging_leg_raise", "Hanging Leg Raise"),
    ("cable_woodchopper", "Standing Cable Wood Chop"),
    ("plank", "Plank")
]

mapped = {}
for cid, search_name in targets:
    found = None
    for ex in data:
        if search_name.lower() == ex['name'].lower() or search_name.lower() in ex['name'].lower():
            found = ex
            break
    if found and found.get('images'):
        img_paths = [base_url + p for p in found['images']]
        mapped[cid] = {
            "name": found['name'],
            "images": img_paths,
            "instructions": found.get('instructions', [])
        }
        print(f"✓ {cid} -> {len(img_paths)} images: {img_paths[0]}")
    else:
        print(f"✗ {cid} not found directly, searching fuzzy...")
        for ex in data:
            if any(w in ex['name'].lower() for w in search_name.lower().split()[:2]):
                mapped[cid] = {
                    "name": ex['name'],
                    "images": [base_url + p for p in ex.get('images', [])],
                    "instructions": ex.get('instructions', [])
                }
                print(f"  ~ fuzzy matched to: {ex['name']}")
                break

with open("g:/AppGym/mapped_exercise_visuals.json", "w", encoding="utf-8") as f:
    json.dump(mapped, f, indent=2, ensure_ascii=False)

print(f"\nTotal mapped: {len(mapped)} / {len(targets)}")
