import json

person_details = open("person_details.json")
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
    if ("number_of_appearances" in actor):    
        del actor["number_of_appearances"]

for actor in person_details_table:
    for actor_id_apps in number_of_appearance_table:
        actor_id_str ="\'" +  str(actor["id"]) + "\'"
        
        actor_app_id = str(actor_id_apps)
       
        if (actor_id_str in actor_app_id):
            #print(actor_id_str)
            #print(actor_app_id)
            apps =  actor_id_apps[str(actor["id"])]
            if 2 <= apps <=6:
                actor.update( {"number_of_appearances" : apps})
            else:
                person_details_table.remove(actor)

    
temp = person_details_table.copy()   
print(len(person_details_table))
for actor in temp:
    if (actor["birthday"] == None or actor["gender"] == 0):
        print(actor["birthday"])
        print(actor["gender"]) 
        person_details_table.remove(actor)
print(len(person_details_table))
out = open("person_details_network.json", "w")

person_details.close()
year_of_appearance.close()
number_of_appearance.close()

json.dump(person_details_table, out, indent=1)
