import json

#binary search code from https://www.geeksforgeeks.org/python-program-for-binary-search/
def binarySearch(arr, l, r, x): 
  
    while l <= r: 
  
        mid = (l + r)//2
          
        # Check if x is present at mid 
        if arr[mid] == x: 
            return mid 
  
        # If x is greater, ignore left half 
        elif arr[mid] < x: 
            l = mid + 1
  
        # If x is smaller, ignore right half 
        else: 
            r = mid - 1
      
    # If we reach here, then the element was not present 
    return -1

f = open("castIDS.json")
out = open("commonwork_bypeople.json","w")

table = json.load(f)

final = {}

for actor in table:
    for actor2 in table:
        if actor["idActor"] != actor2["idActor"]:
            for work in actor2["cast"]:
                result = binarySearch(actor["cast"], 0, len(actor["cast"])-1, work)
                #print("im out")
                if result != -1:
                    if actor["idActor"] not in final:
                        final[actor["idActor"]] = [(actor2["idActor"], work)]
                    else:
                        final[actor["idActor"]].append((actor2["idActor"], work))
                    if actor2["idActor"] not in final:
                        final[actor2["idActor"]] = [(actor["idActor"], work)]
                    else:
                        final[actor2["idActor"]].append((actor["idActor"], work))

json.dump(final,out, indent=4)

f.close()
out.close()