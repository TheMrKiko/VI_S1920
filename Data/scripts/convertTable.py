import requests
import json

guest_stars_JSON = open("guest_stars.json")
output = open("gueststars_info.json","w")

guest_star_list = json.load(guest_stars_JSON)

#print(guest_star_list)
final = []
for e in guest_star_list:
    for actor in e["guest_stars"]:
        info = actor
        info["season"] = e["season"]
        info["episode"] = e["episode"]
        info["date"] = e["date"]
        final.append(info)


json.dump(final, output, indent=4)

#print(final)

guest_stars_JSON.close()
output.close()

