import json

person_details = open("person_details.json")
person_rating = open("person_work_rating.json")
person_frequency = open("person_work_frequency.json")

person_details_table = json.load(person_details)
person_rating_table = json.load(person_rating)
person_frequency_table = json.load(person_frequency)

freq_plus_rating_dict = {}

for person in person_details_table:
    for person_id in person_frequency_table:
        if (person_id == str(person["id"])):
            
            frequency_info = person_frequency_table[person_id]
            rating_info = person_rating_table[person_id] 
            list_fr = []
            year_of_appearance = person["year_of_appearance"]
           
            for i in range(0,21):
                year = i - 10
                year_abs = str(int(year_of_appearance) + year)
                dict_fr ={}
                dict_fr.update({"year" : year})
                if ((year_abs in frequency_info) and (year_abs in rating_info)):
                    dict_fr.update({"freq" : frequency_info[year_abs]})
                    dict_fr.update({"rating" : rating_info[year_abs]})
                else:
                    dict_fr.update({"freq" : 0})
                    dict_fr.update({"rating" : 0})
                list_fr.append(dict_fr)
              
            freq_plus_rating_dict.update({ person_id : list_fr})
            

out = open("freq_plus_rating.json", "w")


person_details.close()
person_rating.close()
person_frequency.close()

json.dump(freq_plus_rating_dict, out, indent=1)
