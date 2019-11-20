import json
f = open("../cast_1.json")
out = open("cast_withoutSVU.json","w")

table = json.load(f)

for actor in table:
    #print(actor)
    actor["cast"][:] = [d for d in actor["cast"] if d["id"] != 2734]

json.dump(table,out, indent=4)

f.close()
out.close()