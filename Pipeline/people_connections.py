import json

def prepare_for_network(table):
    movies = []
    actors = []
    for info in table:
        movies.append(info)
        for a in table[info]:
            if a not in actors:
                actors.append(a)
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
    print("links",len(final["links"]))
    print("nodes",len(final["nodes"]))
    return final