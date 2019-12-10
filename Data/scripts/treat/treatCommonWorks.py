import json

f = open("../../commonworks.json")
table = json.load(f)

movies = []
actors = []
for info in table:
    movies.append(info)
    for a in table[info]:
        if a not in actors:
            actors.append(a)
f.close()
# print(movies)
# print(actors[:10])
final = {"nodes":[]}
for m in movies:
    info = {"id":m, "group": 1}
    final["nodes"].append(info)

for a in actors:
    info = {"id":a, "group": 2}
    final["nodes"].append(info)

final["links"] = []
for movie in table:
    for a in table[movie]:
        info = {"source": movie,
                "target": a}
        final["links"].append(info)

out = open("network.json", "w")
json.dump(final,out, indent=1)
out.close()
print(len(final["links"]))
print(len(final["nodes"]))
