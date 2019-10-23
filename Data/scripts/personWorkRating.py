import json

f=open("cast_raw.json")
r=open("ratings.json")
s=open("shows.json")
table = json.load(f)
ratings = json.load(r)
shows = json.load(s)

imdb_ids = {}
for show in shows:
    if show["imdb_id"] != "":
        imdb_ids[show["id"]] = show["imdb_id"]

final = {}
for person in table:
    cast = person["cast"]
    for work in cast:
        imdb_id = imdb_ids[work["id"]]

f.close()
out = open("person_work_rating.json", "w")
json.dump(final,out, indent=1)