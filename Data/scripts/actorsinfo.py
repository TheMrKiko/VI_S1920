import requests
import json
f=open("gueststars_info.json")
cast = open("cast_1.json", "w")
table = json.load(f)

ids = set()
ids2 = {1474504, 1474506, 81867}
for actor in table:
    id = actor["id"]
    ids.add(id)
#print(ids)
final = []
for id in ids:
    response = requests.get('https://api.themoviedb.org/3/person/' + str(id) + '/combined_credits?api_key=470dbfcc682e70e8776e0f88623ac88a')
    info = {}
    info["cast"] = response.json()["cast"]
    info["idActor"] = id
    final.append(info)

json.dump(final,cast, indent=4) 

cast.close()
f.close()