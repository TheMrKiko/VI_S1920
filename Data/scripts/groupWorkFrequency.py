import json

f=open("person_work_frequency.json")
s=open("yearOfAppearance.json")
table = json.load(f)
appearance_table = json.load(s)
final = {k:[] for k in range(-10,11)}
print(final)

for person in table:
    year_svu = appearance_table[person]
    for year_working in table[person]:
        key = int(year_working) - int(year_svu)
        if key != 0 and -10 <= key <= 10: #works on year of svu dont count
            freq = table[person][year_working]
            final[key].append(freq)

avg = {}
for key in final:
    if key != 0:
        print(key)
        num_works = len(final[key])
        total = sum(final[key])
        avg[key] = total / num_works


f.close()
s.close()
out = open("group_work_frequency.json", "w")
json.dump(avg,out, indent=1)
out.close()