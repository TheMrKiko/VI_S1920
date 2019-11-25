import json

person_details = open("person_detais.json")
year_of_appearance = open("yearOfAppearance.json")
number_of_appearance = open("moreThanOnce.json")

person_details_table = json.load(person_details)
year_of_appearance_table = json.load(year_of_appearance)
number_of_appearance_table = json.load(number_of_appearance)

for actor in person_details_table:
    for actor_id_year in year_of_appearance_table:
        if (str(actor["id"]) == actor_id_year):
            actor.update( {"year_of_appearance" : year_of_appearance_table[actor_id_year]})

for actor in person_details_table:
    for actor_id_apps in number_of_appearance_table:
        if (str(actor["id"]) == actor_id_apps):
            actor.update( {"number_of_appearances" : number_of_appearance_table[actor_id_apps]})

out = open("person_details.json", "w")

person_details.close()
year_of_appearance.close()
number_of_appearance.close()

json.dump(person_details_table, out, indent=1) 

