def separate_by_num_apps(person_details_table, num_apps):
    temp = []
    
    if (num_apps == "all_apps/"):
        temp = person_details_table 

    else:
        for actor in person_details_table:       
            if ("number_of_appearances" in actor):
                if (num_apps == "2_apps/"):
                    if  (actor["number_of_appearances"]  == 2):
                        temp.append(actor)
                            
                if (num_apps == "3_apps/"):
                    if (actor["number_of_appearances"]  == 3):
                        temp.append(actor)      

                if (num_apps == "4_apps/"):
                    if (actor["number_of_appearances"]  == 4):
                        temp.append(actor)
                            
                if (num_apps =="5_apps/"):
                    if (actor["number_of_appearances"]  == 5):
                        temp.append(actor)
                            
                if (num_apps == "6_apps/"):
                    if (actor["number_of_appearances"]  == 6):
                        temp.append(actor)

    return temp