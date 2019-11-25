import json

f1=open("../person_work_frequency.json")
f2=open("../yearOfAppearance.json")
f3=open("../person_work_rating.json")

frequency_table = json.load(f1)
appearance_table = json.load(f2)
rating_table = json.load(f3)

f1.close()
f2.close()
f3.close()

final = {k:[] for k in range(-10,11) if k != 0}
for person in frequency_table:
    year_svu = appearance_table[person]
    for year_working in frequency_table[person]:
        key = int(year_working) - int(year_svu)
        if key != 0 and -10 <= key <= 10: #works on year of svu dont count
            freq = frequency_table[person][year_working]
            rating = rating_table[person][year_working]
            if freq == 0:
                print("oi", person)
            final[key].append({"freq": freq, "rating" : rating})

avg = []
print("ss", final.keys())
for year in final:
    if year != 0:
        print(year, len(final[year]))
        num_works = len(final[year])
        totalFreq = 0
        totalRating = 0
        for work in final[year]:
            totalFreq += work["freq"]
            totalRating += work["rating"]
        avgFreq = totalFreq / num_works
        avgRat = totalRating / num_works

        avg.append({"year": year, "freq": avgFreq, "rating" : avgRat })
        # print(key)
        # num_works = len(final[key])
        # total = sum(final[key])
        # avg[key] = total / num_works

out = open("group_stats.json", "w")
json.dump(avg,out, indent=1)
out.close()