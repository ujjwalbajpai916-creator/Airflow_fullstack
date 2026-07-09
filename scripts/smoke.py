import json
from urllib.request import urlopen

endpoints = [
    ('List flights', 'http://127.0.0.1:5000/api/flights/'),
    ('Search flights', 'http://127.0.0.1:5000/api/flights/search?from=DEL&to=BOM&passengers=1'),
    ('Tracker AF101', 'http://127.0.0.1:5000/api/tracker?flight=AF101'),
]

for title, url in endpoints:
    try:
        data = json.load(urlopen(url))
        print('===', title, '===')
        print(json.dumps(data, indent=2))
    except Exception as e:
        print('===', title, 'ERROR ===')
        print(str(e))
