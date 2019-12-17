import json

f = open("commonworks.json")
table = json.load(f)
pd = open("person_details_network.json")
pds_table = json.load(pd)
pd.close()
f.close()

filtered_actors = []
names = {}
for actor in pds_table:
    filtered_actors.append(actor["id"])
    names[actor["id"]] = actor["name"]
print("l",len(filtered_actors))

movies = []
actors = []
for info in table:
    movies.append(info)
    for a in table[info]:
        if a not in actors and a in filtered_actors:
            actors.append(a)
# print(movies)
# print(actors[:10])
final = {"nodes":[]}
'''
for m in movies:
    info = {"id":m, "group": 1}
    final["nodes"].append(info)
'''
for a in actors:
    info = {"id":a, "group": 2, "name": names[a]}
    final["nodes"].append(info)

'''
final["links"] = []
for movie in table:
    if len(table[movie]) < 20:
        info = {"id":movie, "group": 1}
        final["nodes"].append(info)
        for a in table[movie]:
            if a in actors:
                info = {"source": movie,
                        "target": a}
                final["links"].append(info)
'''
links = {}
ls = []
print(type(filtered_actors[0]))
for movie in table:
    if len(table[movie]) < 5:
        for actor1 in range(len(table[movie])):
            for actor2 in range(actor1+1, len(table[movie])):
                key = str(table[movie][actor1])+"-"+ str(table[movie][actor2]) if table[movie][actor1] < table[movie][actor2] else str(table[movie][actor2])+"-"+ str(table[movie][actor1])
                if key in links:
                    links[key] += 1
                else:
                    links[key] = 1
                    if table[movie][actor1] in actors and table[movie][actor2] in actors:
                        info = {"source": table[movie][actor1],
                                "target": table[movie][actor2]}
                        ls.append(info)
    # print("a",links)
    # print("b", ls)
    # exit(0)
final["links"] = ls

out = open("network.json", "w")
json.dump(final,out, indent=1)
out.close()
print(len(final["links"]))
print(len(final["nodes"]))
