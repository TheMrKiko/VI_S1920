import json
r=open("ratings.json")
ratings = json.load(r)

avg_rating = {}
for work in ratings:
    if not "imdbID" in work:
        continue
    id = work["imdbID"]
    rating = work["Ratings"]
    if not len(rating):
        continue
    n = 0
    sum = 0
    for r in rating:
        n+=1
        source = r["Source"]
        val = r["Value"]
        if source == "Internet Movie Database":
            l = val.split("/")[0]
            a = int(float(l)*10)
            sum += a
        elif source == "Rotten Tomatoes":
            l = val.split("%")[0]
            a = int(float(l))
            sum += a
        elif source == "Metacritic":
            l = val.split("/")[0]
            a = int(float(l))
            sum += a

    avg_rating[id] = int(sum//n)

out = open("avg_rating.json", "w")
json.dump(avg_rating,out, indent=1)