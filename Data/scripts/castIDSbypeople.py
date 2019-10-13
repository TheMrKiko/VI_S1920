import json
f = open("cast_withoutSVU.json")
out = open("castIDS.json","w")

table = json.load(f)

final = []

for actor in table:
    #print(actor)
    ids = [d["id"] for d in actor["cast"] if d["id"] != 2734]
    info = {}
    info["cast"] = sorted(ids)
    info["idActor"] = actor["idActor"]
    final.append(info)

json.dump(final,out, indent=4)

f.close()
out.close()