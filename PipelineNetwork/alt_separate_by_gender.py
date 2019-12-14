def separate_by_gender(person_details_table, gender):
    
    temp = []
    
    if (gender == "/gender_all/"):
        temp = person_details_table 
    
    else:
        for actor in person_details_table:
            
            if (gender == "/gender_male/"):
                if (actor["gender"] == 2):
                    temp.append(actor)
            if (gender == "/gender_female/"):
                if (actor["gender"] == 1):
                    temp.append(actor)     
                    
    return temp

