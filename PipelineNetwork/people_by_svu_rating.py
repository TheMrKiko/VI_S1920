import json

def prepare_for_tree_map(table):
    final = {i:0 for i in range(1,11)}
    for person in table:
        if "mean_rating" in person:
            mean_rating = person["mean_rating"]
            if 1 < mean_rating <= 10:
                if mean_rating in final:
                    final[mean_rating] += 1
                else:
                    final[mean_rating] = 1
    dict_final = {}
    list_values = []
    for i in range(1,11):
        list_values.append({"name": i, "size": final[i]})
    dict_final.update({"name": "dummy"})
    dict_final.update({"children": list_values})


    return dict_final

# f = open("filtered_person_details.json")
# table = json.load(f)
# f.close()
# print(prepare_for_pie(table))