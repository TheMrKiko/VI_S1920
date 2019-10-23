import requests
import json
f=open("guest_stars_raw.json", "w")

#ver num de eps da season
response = requests.get('https://api.themoviedb.org/3/tv/2734?api_key=470dbfcc682e70e8776e0f88623ac88a')
episodes = list(map(lambda x: x["episode_count"], response.json()["seasons"]))
print(episodes)

info = []
for s in range(1,21):
    for e in range(1,episodes[s]+1):
        episode_info = {}
        response = requests.get('https://api.themoviedb.org/3/tv/2734/season/'+ str(s) + '/episode/'+str(e)+'?api_key=470dbfcc682e70e8776e0f88623ac88a')
        episode_info["season"] = response.json()["season_number"]
        episode_info["episode"] = response.json()["episode_number"]
        episode_info["date"] = response.json()["air_date"]
        
        guest_stars = response.json()["guest_stars"]
        # for star in guest_stars:
        #     del star["credit_id"]
        #     del star["order"]
        #     del star["profile_path"]
            #star["gender"] = "Male" if star["gender"] == 0 else "Female"
        episode_info["guest_stars"] = guest_stars
        info.append(episode_info)

json.dump(info, f, indent=4)

f.close()