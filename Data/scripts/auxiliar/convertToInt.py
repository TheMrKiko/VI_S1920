import json
#im sorry for this file :)

f2 = open("../../EpisodeRating.json")
table_ratings = json.load(f2)
f2.close()

for info in table_ratings:
    info["season"] = int(info["season"])
    info["episode"] = int(info["episode"])
    if info["imdb_rating"] == 'N/A':
        info["imdb_rating"] = None
    else:
        info["imdb_rating"] = float(info["imdb_rating"])

out = open("episode_rating.json","w")
json.dump(table_ratings, out, indent=1)
