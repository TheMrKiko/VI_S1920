import json

f = open("../../person_episode_rating.json")
f2 = open("../../../Pipeline/person_details.json")

person_ratings = json.load(f)
person_details = json.load(f2)

f.close()
f2.close()
#print(person_ratings["180997"])
for person in person_details:
    id = str(person["id"])
    info = person_ratings[id]
    print(person)
    person["episodes"] = info["episodes"]
    person["mean_rating"] = info["mean_rating"]    

out = open("person_details.json", "w")
json.dump(person_details,out,indent=1)
