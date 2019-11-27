def separate_by_svu_rating(person_details_table, svu_rating):
    temp = []
    
    if (svu_rating == "all_rating"):
        temp = person_details_table
        return temp
    
  
    for actor in person_details_table:       
        if (svu_rating == "two_rating"):
            if  (actor["mean_rating"]  == 2):
                temp.append(actor)
                    
        elif (svu_rating == "three_rating"):
            if (actor["mean_rating"]  == 3):
                print("fodasSSe")
                temp.append(actor)      

        elif (svu_rating == "four_rating"):
            if (actor["mean_rating"]  == 4):
                print("fodase")
                temp.append(actor)
                    
        elif (svu_rating =="five_rating"):
            if (actor["mean_rating"]  == 5):
                temp.append(actor)
                    
        elif (svu_rating == "six_rating"):
            if (actor["mean_rating"]  == 6):
                temp.append(actor)
        
        elif (svu_rating == "seven_rating"):
            if (actor["mean_rating"]  == 7):
                temp.append(actor)      

        elif (svu_rating == "eight_rating"):
            if (actor["mean_rating"]  == 8):
                temp.append(actor)
                    
        elif (svu_rating =="nine_rating"):
            if (actor["mean_rating"]  == 9):
                temp.append(actor)
                    
        elif (svu_rating == "ten_rating"):
            if (actor["mean_rating"]  == 10):
                temp.append(actor)

    return temp

 