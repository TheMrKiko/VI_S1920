from alt_separate_by_gender import separate_by_gender
from alt_separate_by_age import separate_by_age
from alt_separate_by_svu_rating import separate_by_svu_rating
from alt_separate_by_num_apps import separate_by_num_apps
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
folder_names = {"gender" : ["/gender_male/", "/gender_female/", "/all/"], 
"age" : ["age_under_25/", "age_between_25_and_55/", "age_over_55/", "all/"],
"num_apps" : ["two_apps/","three_apps/", "four_apps/", "five_apps/", "six_apps/", "all/"], 
"svu_rating" : ["one_rating", "two_rating","three_rating", "four_rating", "five_rating", "all"]}

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
                    #filtered_table = separate_by_svu_rating(person_details_table, svu_rating)
                    
                    out = open("filtered_person_details.json", "w")
                    json.dump(filtered_table, out, indent=1) 

                    files = glob.iglob(os.path.join(original_path, "*ered_person_details.json"))
                    for file in files:
                        if os.path.isfile(file):
                            shutil.copy2(file, destined_path)
                        print(destined_path)
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