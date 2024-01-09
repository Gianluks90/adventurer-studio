from .dat_object import DataDeD
import json
import math

MAP = {}
COMPETENZA = 2

def parsinator(data, what="shedabase"):
    global MAP
    if what == "shedabase":
        MAP = json.loads(open("templates/shedabase.json", "r").read())
    output_objects, urls = binder(data, MAP)
    return output_objects, urls

def modificatore_caratteristiche(data):
    try:
        value = int(math.floor((data - 10) / 2, 0))
        value = str(value) if value >= 0 else "-" + str(abs(value))
    except:
        value = ""
    return value


def binder(data, map):
    global COMPETENZA
    go = controll(data)
    if not go:
        return [], []
    output_objects = []
    urls = []
    for data_to_put, map_content in map.items():
        user_data = data
        json_map_content = map_content.get("JSON")
        scheda_map_content = map_content.get("SCHEDA")
        where, what = json_map_content.get("WHERE"), json_map_content.get("WHAT")
        for whe, wha in zip(where, what):
            if wha == "dict":
                user_data = user_data.get(whe)
            elif "list" in wha:
                postition = int(wha.split("_")[1])
                try:
                    user_data = user_data[postition].get(whe)
                except:
                    user_data = ""
                    break
            elif wha == "modificatore":
                user_data = user_data.get(whe)
                user_data = modificatore_caratteristiche(user_data)
                wha = "text"
                break
            elif wha == "tiroSalvezza":
                user_data = tirosalvatore(data, data_to_put, user_data, whe)
                break
            else:
                user_data = user_data.get(whe)
                if wha == "number":
                    user_data = str(user_data)
                    wha = "text"
            last_whe = whe
            last_wha = wha
            content = user_data
        if data_to_put == "BONUSCOMPETENZA":
            COMPETENZA = int(content)
        new_object = DataDeD(name = data_to_put, data_type = last_wha, data_text = content)
        for attr, value in scheda_map_content.items():
            new_object.add_parameter(attr, value)
        output_objects.append(new_object)
        if last_wha == "url":
            urls.append(content)
    return output_objects, urls

def tirosalvatore(data, data_to_put, user_data, whe):
    user_data = user_data.get(whe)
    user_data = modificatore_caratteristiche(user_data)
    checker = data_to_put + "BOL"
    user_data_temp = data.get(checker).get("JSON")
    for whe_temp, wha_temp in zip(user_data_temp.get("WHERE"), user_data_temp.get("WHAT")):
        if wha_temp == "dict":
            user_data_temp = user_data_temp.get(whe_temp)
        elif "list" in wha_temp:
            postition = int(wha_temp.split("_")[1])
            try:
                user_data_temp = user_data_temp[postition].get(whe_temp)
            except:
                user_data_temp = 0
                break
        else:
            user_data_temp = user_data_temp.get(whe_temp)
            if user_data_temp:
                user_data_temp = COMPETENZA
            else:
                user_data_temp = 0
    user_data = int(user_data) + int(user_data_temp)
    user_data = str(user_data) if user_data >= 0 else "-" + str(abs(user_data))
    return user_data
    
def controll(data):
    if not isinstance(data, dict):
        return False
    if data is None:
        return False
    if len(data) == 0:
        return False
    return True