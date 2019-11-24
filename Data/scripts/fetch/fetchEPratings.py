import json
import requests

#percorrer este ultimo array com os ids da imdb para ir buscar os seus ratings
#pedir a nova key do francisco
# response = requests.get('http://www.omdbapi.com/?i=' + str('tt7195356') + '&apikey=7128c889')
# print(response.json())

f = open("../../EpisodeIMDBID.json")

table = json.load(f)
f.close()

final = []
for season in table:
    for episode in table[season]:
        imdb_id = str(list(episode.values())[0])
        ep_number = str(list(episode.keys())[0])
        
        
        response = requests.get('http://www.omdbapi.com/?i=' + str(imdb_id) + '&apikey=7128c889')
        rating = response.json()["imdbRating"]

        info = {}
        info["season"] = season
        info["episode"] = ep_number
        info["imdb_id"] = imdb_id
        info["imdb_rating"] = rating
        final.append(info)
    

out = open("EpisodeRating.json", "w")
json.dump(final,out, indent=1)
out.close()
