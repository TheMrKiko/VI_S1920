import json
import requests

f = open("../guest_stars_raw.json")

table = json.load(f)
f.close()
eps = {}
for info in table:
    if info["season"] not in eps:
        eps[info["season"]] = []
    if  info["episode"] not in eps[info["season"]]:
        eps[info["season"]].append(info["episode"])

print(eps)
imdb_ids = {}
for season in eps:
    imdb_ids[season] = []
    for ep in eps[season]:
        response = requests.get('https://api.themoviedb.org/3/tv/2734/season/'+ str(season) + '/episode/'+str(ep)+'/external_ids?api_key=470dbfcc682e70e8776e0f88623ac88a')
        imdb_ids[season].append({ep : response.json()["imdb_id"]})

out = open("SVUepisoderatings.json", "w")
json.dump(imdb_ids,out, indent=1)
#print(imdb_ids)

#percorrer este ultimo array com os ids da imdb para ir buscar os seus ratings
#pedir a nova key do francisco
#response = requests.get('http://www.omdbapi.com/?i=' + str('tt7195356') + '&apikey=7128c889')
#print(response.json)