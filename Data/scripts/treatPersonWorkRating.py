import json

# --
f=open("person_work_rating_raw.json")
persons = json.load(f)

final = {}
for person in persons:
    person_data = persons[person]

    years = {}
    for year in person_data:
        year_data = person_data[year]
        sum = 0
        for work in year_data:
            sum += work
        avg = int(sum//len(year_data))
        years[year] = avg
    final[person] = years

f.close()
out = open("person_work_rating.json", "w")
json.dump(final,out, indent=1)