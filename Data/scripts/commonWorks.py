import json

f=open("cast.json")
table = json.load(f)

final = {}
for info in table:
    if info["id"] in final and info["id"] != 2734:
        if info["id_person"] in final[info["id"]]:
            print(str(info["id"]) + " "+ str(info["id_person"]))
            continue
        final[info["id"]].append(info["id_person"])
    else:
        final[info["id"]] = [info["id_person"]]
final_out = {k:v for k,v in final.items() if len(v)>1}
f.close()
out = open("commonworks.json", "w")
json.dump(final_out,out, indent=1)