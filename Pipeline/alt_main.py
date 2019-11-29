from alt_separate_by_gender import separate_by_gender
from alt_separate_by_age import separate_by_age
from alt_separate_by_svu_rating import separate_by_svu_rating
from alt_separate_by_num_apps import separate_by_num_apps
from groupWorkFreqRating import freq_and_rating_by_group
from people_by_numapps import prepare_for_pie
import json
import os, shutil, glob

guest_stars = open("guest_stars_raw.json")
cast = open("castIDS.json")
commonwork_pairs = open("commonwork_bypeople_nospace.json")
person_details = open("person_details.json")

guest_stars_table = json.load(guest_stars)
cast_table = json.load(cast)
commonwork_pairs_table = json.load(commonwork_pairs)
person_details_table = json.load(person_details)

original_path = os.getcwd()
folder_names = {"gender" : ["/gender_male/", "/gender_female/", "/gender_all/"], 
"age" : ["age_under_21/", "age_between_21_and_50/", "age_over_50/", "age_all/"],
"num_apps" : ["2_apps/","3_apps/", "4_apps/", "5_apps/", "6_apps/", "all_apps/"], 
"svu_rating" : ["1_rating", "2_rating","3_rating", "4_rating", "5_rating", "6_rating", "7_rating","8_rating", "9_rating", "10_rating", "all_rating"]}

dividers = { 1 : "gender", 
2 : "age",
3 : "num_apps" , 
4 : "svu_rating"}

level = 0

def folder_creator(path, level):
    level = level + 1
    #this creates a new folder for each entry in folder_names["gender"]
    for new_folder in folder_names[dividers[level]]:
        try:
            fd_str = path + new_folder
            os.mkdir(fd_str)
        except OSError:  
            print ("OSError: Creation of the directory %s failed" % path)

        new_path = path + new_folder
        if (level < 4):
            folder_creator(new_path, level)
 
def divider():
    for gender in folder_names["gender"]:
        for age in folder_names["age"]:
            for num_apps in folder_names["num_apps"]:
                for svu_rating in folder_names["svu_rating"]:
                    destined_path = original_path + gender + age + num_apps + svu_rating
                    
                    filtered_table = person_details_table
                    filtered_table = separate_by_gender(person_details_table, gender)
                    filtered_table = separate_by_age(filtered_table, age)
                    filtered_table = separate_by_num_apps(filtered_table, num_apps)
                    filtered_table = separate_by_svu_rating(filtered_table, svu_rating)

                    pie_chart = prepare_for_pie(filtered_table)
                    
                    out = open(destined_path+"/filtered_person_details.json", "w")
                    json.dump(filtered_table, out, indent=1) 
                    out.close()

                    pie = open(destined_path+"/pie_chart_persondetails.json", "w")
                    json.dump(pie_chart, pie, indent=1) 
                    pie.close()

                    if len(filtered_table) != 0:
                        stats = freq_and_rating_by_group(filtered_table)
                    else:
                        stats = []
                    stats_file = open(destined_path +"/stats_freq_rating.json", "w")
                    json.dump(stats, stats_file, indent=1)

                    stats_file.close()
""" 
                    files = glob.iglob(os.path.join(original_path, "*ered_person_details.json"))
                    for filee in files:
                        
                        shutil.copy(filee, destined_path)
                        print(destined_path) """
"""  if os.path.isfile("filtered_person_details.json"):
                        shutil.copy(out, destined_path)         
                    
                    if os.path.exists("filtered_person_details.json"):
                        os.remove("filtered_person_details.json")
                    else:
                        print("The file \"out\" does not exist")"""


folder_creator(original_path, level)
divider()

person_details.close()
commonwork_pairs.close()
cast.close()
guest_stars.close()

"""  print(str(fd_str))
            for file in files:
                if os.path.isfile(file):
                    #shutil.copy(file, fd_str)
                    #print("copying files")
                    #print(str(file))
                    a = 1
                    a = a + 1 """