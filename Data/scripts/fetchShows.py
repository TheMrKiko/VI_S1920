import requests
import json
import threading
import time

def thread_function(name, chunk, ids):
    print("Thread %s: starting", name)
    i = int(name)
    shows = open("shows_raw_"+str(i)+".json", "w")
    final = []

    for j in range(chunk*i, chunk*(i+1)):
        if not i:
            print("---- ", (j*100)//chunk, "%")
        notdone = True
        id, type = ids[j]
        print(id, type)
        while notdone:
            try:
                response = requests.get('https://api.themoviedb.org/3/'+ type +'/' + str(id) + '/external_ids?api_key=470dbfcc682e70e8776e0f88623ac88a')
                info = {}
                info["imdb_id"] = response.json()["imdb_id"]
                info["id"] = id
                final.append(info)
                notdone = False
            except:
                time.sleep(2)
                continue

    json.dump(final,shows, indent=4)

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

lenids = len(idsUniq)
n = 4 #7
chunk = lenids//n
print("len ", lenids)
threads = list()
for index in range(n):
    x = threading.Thread(target=thread_function, args=(index,chunk,ids,))
    threads.append(x)
    x.start()

for index, thread in enumerate(threads):
    thread.join()

f.close()
