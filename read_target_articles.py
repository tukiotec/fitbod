import json

with open('g:/AppGym/fitbod_zendesk_search_results.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

key_ids = [
    '360004429814', # How Fitbod Creates Your Workout
    '16254175592215', # Fitbod's Algorithm - Q&A
    '360006269014', # Muscle Recovery
    '360033675553', # Max Effort Day
    '29486697282711', # Sets, Reps, and Weight Fields Explained
    '360033133174', # Reps in Reserve (RiR)
    '360006337634', # Warm-Up Sets
    '360007700013', # Plate Calculator
    '360006427813', # Circuits & Supersets
    '15948615409687', # Fitness Goals
    '29976088485143', # Fitness Experience
    '24739986755223', # Weekly Set Targets
    '37629269518103', # Injuries and Limitations
    '29976242163223', # Exercise Variability
    '360004826434', # How Fitbod Calculates Calories
    '30542136101527', # How the Trial Works
]

extracted = {}
for kid in key_ids:
    if kid in articles:
        extracted[kid] = {
            'id': kid,
            'title': articles[kid]['title'],
            'content': articles[kid]['clean_body']
        }
    else:
        print(f"Warning: {kid} not found")

with open('g:/AppGym/fitbod_key_articles_detailed.json', 'w', encoding='utf-8') as f:
    json.dump(extracted, f, indent=2, ensure_ascii=False)

print(f"Successfully extracted {len(extracted)} key articles!")
