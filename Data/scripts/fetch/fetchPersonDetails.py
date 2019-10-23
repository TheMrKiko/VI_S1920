import requests
import json
import threading
import time

def thread_function(name, chunk, ids, n):
    print("Thread %s: starting", name)
    i = int(name)
    shows = open("persons_raw__"+str(i)+".json", "w")
    final = []

    end = chunk*(i+1) if (n-1) != i else (chunk*(i+1)) + len(ids)%n

    for j in range(chunk*i, end):
        if i == 2:
            print("---- ", (j*100)//chunk, "%")
        notdone = True
        id = ids[j]
        while notdone:
            try:
                response = requests.get('https://api.themoviedb.org/3/person'+'/' + str(id) + '?api_key=470dbfcc682e70e8776e0f88623ac88a')
                info = response.json()
                print(i," ", id)
                print(i, " ---- ", info)
                if "status_code" in info:
                    if int(info["status_code"]) == 34:
                        notdone=False
                        continue
                    else:
                        raise Exception("Gotta wait")
                
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
    id = show["id_person"]
    if id not in idsUniq:
        idsUniq.add(id)

lenids = len(idsUniq)
n = 4
chunk = lenids//n
print("len ", lenids)
threads = list()
for index in range(n):
    x = threading.Thread(target=thread_function, args=(index,chunk,list(idsUniq),n,))
    threads.append(x)
    x.start()

for index, thread in enumerate(threads):
    thread.join()

f.close()
