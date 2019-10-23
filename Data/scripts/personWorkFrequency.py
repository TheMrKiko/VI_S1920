import json

# --
f=open("person_work_rating_raw.json")
persons = json.load(f)

final = {}
for person in persons:
    person_data = persons[person]
    years = {}
    max = 0
    for year in person_data:
        year_data = person_data[year]
        if (len(year_data) > max):
            max = len(year_data)

    for year in person_data:
        year_data = person_data[year]
        freq = int((100 * len(year_data))//max)
        years[year] = freq
    final[person] = years

f.close()
out = open("person_work_frequency.json", "w")
json.dump(final,out, indent=1)