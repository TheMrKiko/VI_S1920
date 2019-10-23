import json
f=open("cast_raw.json")
out = open("cast.json", "w")

data = json.load(f)

final = []

for actor in data:
    for role in actor["cast"]:
        info = role
        info["id_person"] = actor["idActor"]
        final.append(info)


json.dump(final, out, indent=4)
