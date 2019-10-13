import requests
import json
import threading
import time

def thread_function(name, chunk, ids, n):
    print("Thread %s: starting", name)
    i = int(name)
    shows = open("ratings_raw_"+str(i)+".json", "w")
    final = []
    end = chunk*(i+1) if (n-1) != i else (chunk*(i+1)) + len(ids)%n

    for j in range(chunk*i, end):
        if not i:
            print("---- ", (j*100)//chunk, "%")
        notdone = True
        imdbid = ids[j]["imdb_id"]
        while notdone:
            try:
                response = requests.get('http://www.omdbapi.com/?i=' + str(imdbid) + '&apikey=7128c889')
                info = response.json()
                print(imdbid, " ---- ", info)
                final.append(info)
                notdone = False
            except:
                time.sleep(2)
                continue

    json.dump(final,shows, indent=4)

    shows.close()
    print("Thread %s: closing", name)
    


f=open("shows.json")
ids = json.load(f)

lenids = len(ids)
n = 4 #7
chunk = lenids//n
print("len ", lenids)

threads = list()
for index in range(n):
    x = threading.Thread(target=thread_function, args=(index,chunk,ids,n,))
    threads.append(x)
    x.start()

for index, thread in enumerate(threads):
    thread.join()

f.close()
