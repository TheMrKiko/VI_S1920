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
            if (actor["birthday"] != None):
                date_time_str = actor["birthday"] + ' 00:00:00'
                date = datetime.datetime.strptime(date_time_str, '%Y-%m-%d %H:%M:%S')
                
                if (age == "age_under_25/"):
                    #print((date - ts) + "\n\n\n")
                    if (date > prior_25):
                        temp.append(actor)
                            
                if (age == "age_between_25_and_55/"):
                    if ((date <= prior_25 ) & (date >= posterior_55)):
                        temp.append(actor) 
                            
                if (age == "age_over_55/"):
                    if (date < posterior_55 ):
                        temp.append(actor)       

    return temp
