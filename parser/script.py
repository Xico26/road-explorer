import json
import os
from collections import defaultdict
import re

VALID_PREFIXES = ('a', 'n', 'i', 'e', 'vl', 'vci', "vri", "pvg", "ve", "vr")

def is_valid_ref(ref: str) -> bool:
    return any(ref.startswith(p) for p in VALID_PREFIXES)

f = open("input/roads_new.geojson")

data = json.load(f)

roads = defaultdict(list)

for feature in data["features"]:
    ref = feature.get("properties", {}).get("ref")
    if ref:
        # split on original separators first
        parts = re.split(r'[;/]', ref)
        for part in parts:
            key = re.sub(r'[^a-z0-9\-]', '-', part.strip().lower())
            if key and is_valid_ref(key):
                roads[key].append(feature)

os.makedirs("output", exist_ok=True)

for ref, features in roads.items(): 
    out = {
        "type": "FeatureCollection",
        "features": features
    }
    new_file = open(f"output/{ref}.geojson", "w")
    json.dump(out, new_file)

index_file = open(f"output/index.json", "w")
keys = list(roads.keys())

sorted_list = sorted(keys)
json.dump(sorted_list, index_file)


print(f"written {len(roads)} roads")