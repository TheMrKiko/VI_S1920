import json
out = open("shows.json", "w")

final = []

for i in range(4):
    f=open("shows_raw_" + str(i) + ".json")
    data = json.load(f)
    final += data
    f.close()

json.dump(final, out, indent=4)
print(len(final))