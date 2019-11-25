import time
import datetime

def separate_by_age(person_details_table, age):
    temp = []
    
    prior_25 = datetime.datetime(1994, 11, 25)
    posterior_55 = datetime.datetime(1964, 11, 25)
    
    if (age == "all/"):
        temp = person_details_table 

    else:
        for actor in person_details_table:
            year_of_appearance = int(actor["year_of_appearance"])
            if (actor["birthday"] != None):
                date_time_str = actor["birthday"] + ' 00:00:00'
                date = datetime.datetime.strptime(date_time_str, '%Y-%m-%d %H:%M:%S')
                year_of_birth = date.year
                
                age_at_svu = year_of_appearance - year_of_birth

                if (age == "age_under_21/"):
                    #print((date - ts) + "\n\n\n")
                    if (age_at_svu < 21):
                        temp.append(actor)
                            
                if (age == "age_between_21_and_50/"):
                    if age_at_svu >= 21 and age_at_svu < 50 :
                        temp.append(actor) 
                            
                if (age == "age_over_50/"):
                    if (age_at_svu > 50 ):
                        temp.append(actor)       

    return temp
