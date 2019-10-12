import json
f=open("cast_1.json")
out = open("cast_info.json", "w")

data = json.load(f)

final = []

for actor in data:
    for role in actor["cast"]:
        info = role
        info["idActor"] = actor["id"]

json.dump(final, out, indent=4)
