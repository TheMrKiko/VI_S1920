import json

f = open("../guest_stars.json")
table_episodes = json.load(f)
f.close()

f2 = open("../episode_rating.json")
table_ratings = json.load(f2)
f2.close()

final = {}
for appearance in table_episodes:
    actor = appearance["id"]
    print(actor)
    for rating in table_ratings:
        if appearance["season"] == rating["season"] and appearance["episode"] == rating["episode"]:
            ep = { rating["imdb_id"] : rating["imdb_rating"]}
            if actor in final:
                final[actor]["episodes"].append(ep)
            else:
                final[actor] = {}
                final[actor]["episodes"] = [ep]

for actor in final:
    total = 0
    for episode in final[actor]["episodes"]:
        rating = list(episode.values())[0]
        if rating is None:
            print("oi")
            final[actor]["mean_rating"] = None
            continue
        total += rating
    mean = total / len(final[actor]["episodes"])

    #rating from 1 to 5
    mean = round(mean)

    final[actor]["mean_rating"] = mean

out = open("person_episode_rating.json", "w")
json.dump(final,out,indent=1)