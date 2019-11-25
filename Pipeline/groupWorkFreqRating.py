import json

def freq_and_rating_by_group(person_details_table):
    f1=open("person_work_frequency.json")
    # f2=open("person_details.json")
    f3=open("person_work_rating.json")

    frequency_table = json.load(f1)
    # person_details_table = json.load(f2)
    rating_table = json.load(f3)

    f1.close()
    # f2.close()
    f3.close()

    final = {k:[] for k in range(-10,11) if k != 0}
    #print("ooiiidfdf", person_details_table)
    for info in person_details_table:
        for person in frequency_table:
            if int(person) == info["id"]:
                year_svu = info["year_of_appearance"]
                for year_working in frequency_table[person]:
                    key = int(year_working) - int(year_svu)
                    if key != 0 and -10 <= key <= 10: #works on year of svu dont count
                        freq = frequency_table[person][year_working]
                        rating = rating_table[person][year_working]
                        if freq == 0:
                            #print("oi", person)
                        final[key].append({"freq": freq, "rating" : rating})

    avg = []
    #print("ss", final.values())
    for year in final:
        if year != 0:
            #print(year, len(final[year]))
            num_works = len(final[year])
            totalFreq = 0
            totalRating = 0
            for work in final[year]:
                totalFreq += work["freq"]
                totalRating += work["rating"]
            if num_works != 0:
                avgFreq = totalFreq / num_works
                avgRat = totalRating / num_works
            else:
                avgFreq = 0
                avgRat = 0

            avg.append({"year": year, "freq": avgFreq, "rating" : avgRat })
            # print(key)
            # num_works = len(final[key])
            # total = sum(final[key])
            # avg[key] = total / num_works

    # out = open("group_stats.json", "w")
    # json.dump(avg,out, indent=1)
    # out.close()
    return avg