def separate_by_svu_rating(person_details_table, svu_rating):
    temp = []
    
    if (svu_rating == "all_rating"):
        temp = person_details_table
        return temp
    
  
    for actor in person_details_table:
        if (svu_rating == "1_rating"):
            if  (actor["mean_rating"]  == 1):
                temp.append(actor)

        elif (svu_rating == "2_rating"):
            if  (actor["mean_rating"]  == 2):
                temp.append(actor)
                    
        elif (svu_rating == "3_rating"):
            if (actor["mean_rating"]  == 3):
                print("fodasSSe")
                temp.append(actor)      

        elif (svu_rating == "4_rating"):
            if (actor["mean_rating"]  == 4):
                print("fodase")
                temp.append(actor)
                    
        elif (svu_rating =="5_rating"):
            if (actor["mean_rating"]  == 5):
                temp.append(actor)
                    
        elif (svu_rating == "6_rating"):
            if (actor["mean_rating"]  == 6):
                temp.append(actor)
        
        elif (svu_rating == "7_rating"):
            if (actor["mean_rating"]  == 7):
                temp.append(actor)      

        elif (svu_rating == "8_rating"):
            if (actor["mean_rating"]  == 8):
                temp.append(actor)
                    
        elif (svu_rating =="9_rating"):
            if (actor["mean_rating"]  == 9):
                temp.append(actor)
                    
        elif (svu_rating == "10_rating"):
            if (actor["mean_rating"]  == 10):
                temp.append(actor)

    return temp

 