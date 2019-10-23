import json

# get values from show
r=open("avg_rating.json")
ratings = json.load(r)

# translate id to imdb
s=open("shows.json")
shows = json.load(s)

imdb_ids = {}
for show in shows:
    if show["imdb_id"] != "" and show["imdb_id"] != None:
        imdb_ids[show["id"]] = show["imdb_id"]

# --
f=open("cast_raw.json")
table = json.load(f)

final = {}
for person in table:
    cast = person["cast"]
    years = {}
    for work in cast:
        if work["id"] not in imdb_ids:
            continue
        imdb_id = imdb_ids[work["id"]]
        if imdb_id not in ratings:
            continue
        rating = ratings[imdb_id]
        if work["media_type"] == "movie":
            if "release_date" not in work or work["release_date"] == "":
                continue
            year = int(work["release_date"].split("-")[0])
        else:
            if "first_air_date" not in work or work["first_air_date"] == "":
                continue
            year = int(work["first_air_date"].split("-")[0])
        if year in years:
            years[year].append(rating)
        else:
            years[year] = [rating]
    final[int(person["idActor"])] = years


f.close()
out = open("person_work_rating_raw.json", "w")
json.dump(final,out, indent=1)