import json
f=open("cast.json")
out = open("tv_movies.json", "w")

table = json.load(f)
final = {}

for role in table:
    if role["id"] != 2734:
        if role["id"] in final:
            final[role["id"]]["actors"].append(role["id_person"])
        else:
            final[role["id"]] = role
            final[role["id"]]["actors"] = [role["id_person"]]
            if "character" in final[role["id"]]:
                del final[role["id"]]["character"]
            if "credit_id" in final[role["id"]]:
                del final[role["id"]]["credit_id"]
            if "episode_count" in final[role["id"]]:
                del final[role["id"]]["episode_count"]
            del final[role["id"]]["id_person"]

f.close()
json.dump(final, out, indent=1)
print(len(final))