import json

f=open("guest_stars.json")
table = json.load(f)

final = {}
for info in table:
    if info["id"] not in final:
        final[info["id"]] = info["date"].split("-")[0]

f.close()
out = open("yearOfAppearance.json", "w")
json.dump(final,out, indent=1)