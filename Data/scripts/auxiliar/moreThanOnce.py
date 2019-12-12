import requests
import json
f=open("../../cast_raw.json")
out = open("moreThanOnce.json", "w")
table = json.load(f)

final = []

for actor in table:
    apearances = 0

    for role in actor["cast"]:
        if role["id"] == 2734:
            apearances += role["episode_count"]
	
    if apearances > 0 and apearances <= 10:
        info = {}
        info[actor["idActor"]] = apearances
        final.append(info)
                 

json.dump(final,out, indent=4) 

out.close()
f.close()