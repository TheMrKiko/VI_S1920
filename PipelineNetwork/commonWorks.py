import json

f=open("castIDS_network.json")
table = json.load(f)
print(len(table))
final = {}
for info in table:
    for show in info["cast"]:
        if show in final and show != 2734:
            if info["idActor"] in final[show]:
                #print(str(show) + " "+ str(info["idActor"]))
                continue
            final[show].append(info["idActor"])
        else:
            final[show] = [info["idActor"]]

final_out = {k:v for k,v in final.items() if len(v)>1}
print(len(final_out))
f.close()
out = open("commonworks.json", "w")
json.dump(final_out,out, indent=1)