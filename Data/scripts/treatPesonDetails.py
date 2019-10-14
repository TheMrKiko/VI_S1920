import json
out = open("person_detais.json", "w")

final = []

for i in range(4):
    f=open("persons_raw__" + str(i) + ".json")
    data = json.load(f)
    final += data
    f.close()

json.dump(final, out, indent=4)
print(len(final))