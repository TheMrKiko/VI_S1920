import requests
import json
#f=open("../commonwork_bypeople.json")
f=open("../commonwork.json")
#out = open("commonwork_bypeople_nospace.json", "w")
out = open("commonwork_nospace.json", "w")
table = json.load(f)
json.dump(table,out, indent=1) 

out.close()
f.close()