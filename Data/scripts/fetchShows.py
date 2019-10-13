import requests
import json
import threading
import time

def thread_function(name, chunk, ids):
    print("Thread %s: starting", name)
    i = int(name)
    shows = open("shows_raw__"+str(i)+".json", "w")
    final = []

    for j in range(chunk*i, chunk*(i+1)):
        if i == 2:
            print("---- ", (j*100)//chunk, "%")
        notdone = True
        id, type = ids[j]
        while notdone:
            try:
                response = requests.get('https://api.themoviedb.org/3/'+ type +'/' + str(id) + '/external_ids?api_key=470dbfcc682e70e8776e0f88623ac88a')
                info = {}
                respjson = response.json()
                print(i," ", id)
                print(i, " ---- ", respjson)
                if "status_code" in respjson:
                    if int(respjson["status_code"]) == 34:
                        notdone=False
                        continue
                    else:
                        raise Exception("Gotta wait")
                
                info["imdb_id"] = respjson["imdb_id"] if "imdb_id" in respjson else "null"
                info["id"] = id
                final.append(info)
                notdone = False
            except:
                time.sleep(1)
                continue

    print("Thread %s: writ", name)

    json.dump(final,shows, indent=4)
    print("Thread %s: end", name)


    shows.close()


f=open("cast.json")
table = json.load(f)

idsUniq = set()
ids = []

for show in table:
    id = show["id"]
    if id not in idsUniq:
        idsUniq.add(id)
        val = (id, show["media_type"])
        ids.append(val)

lenids = len(ids)
n = 4
chunk = lenids//n
print("len ", lenids)
threads = list()
for index in range(n):
    x = threading.Thread(target=thread_function, args=(index,chunk,ids,))
    threads.append(x)
    x.start()
