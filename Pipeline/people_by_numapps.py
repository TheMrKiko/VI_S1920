import json

def prepare_for_pie(table):
    final = {}
    for person in table:
        if "number_of_appearances" in person:
            apps = person["number_of_appearances"]
            if apps <= 6:
                if apps in final:
                    final[apps] += 1
                else:
                    final[apps] = 1
    return final

# f = open("filtered_person_details.json")
# table = json.load(f)
# f.close()
# print(prepare_for_pie(table))