import json
import time
import datetime

person_details = open("person_details_network.json")
castIDS = open("castIDS.json")
tv_movies = open("tv_movies.json")

person_details_table = json.load(person_details)
castIDS_table = json.load(castIDS)
tv_movies_dict = json.load(tv_movies)
films_to_remove = []

for actor in person_details_table:
    year_of_appearance = actor["year_of_appearance"]
    for actors_films in castIDS_table:
        if (actor["id"] == actors_films["idActor"]):
            films = actors_films["cast"]
            for film in films:
                if (str(film) in tv_movies_dict):
                    film_details = tv_movies_dict[str(film)]
                    if ("release_date" in film_details):
                        air_date = film_details["release_date"]
                    if ("first_air_date" in film_details):
                        air_date = film_details["first_air_date"]
                    if (air_date != ""):   
                        date_time_str = air_date + ' 00:00:00'
                        date = datetime.datetime.strptime(date_time_str, '%Y-%m-%d %H:%M:%S')
                        if ((int(year_of_appearance) - 10) > (date.year)):
                            films.remove(film)
                            films_to_remove.append(film)
                    else: 
                        films.remove(film)
                        films_to_remove.append(film)
            actors_films.update({"cast" : films})

for movie in films_to_remove:
    keep = False
    for actors_films in castIDS_table:
        if (movie in actors_films["cast"]):
            keep = True
    if (keep == False):
        films_to_remove.remove(movie)

films_to_remove = list(dict.fromkeys(films_to_remove))

for film in films_to_remove:
    if (str(film) in tv_movies_dict):
        del tv_movies_dict[str(film)]

person_details.close()
castIDS.close()
tv_movies.close()

out_cast = open("castIDS_network.json", "w")
json.dump(castIDS_table, out_cast, indent=1)

out_tv_movies = open("tv_movies_network.json", "w")
json.dump(tv_movies_dict, out_tv_movies, indent=1)