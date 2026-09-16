from curl_cffi import requests

# Let's inspect raw fitbod csv or code from github
urls = [
    "https://raw.githubusercontent.com/rhnfzl/fitbod-report/main/app.py",
    "https://raw.githubusercontent.com/joecummings/fitbod_data_exploration/master/fitbod_analysis.py",
    "https://raw.githubusercontent.com/joecummings/fitbod_data_exploration/master/WorkoutExport.csv"
]

for u in urls:
    try:
        r = requests.get(u, impersonate='chrome120', timeout=10)
        if r.status_code == 200:
            print(f"URL {u} SUCCESS (status {r.status_code}):")
            lines = r.text.splitlines()
            for line in lines[:20]:
                print(line)
            print("-" * 50)
    except Exception as e:
        print(f"Error {u}: {e}")
