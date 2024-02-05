from .dat_object import DataDeD
import json
import math

MAP_VAL = {"MODFORZA" : 0,
        "MODDESTREZZA" : 0,
        "MODCOSTITUZIONE" : 0,
        "MODINTELLIGENZA" : 0,
        "MODSAGGEZZA" : 0,
        "MODCARISMA" : 0}

MAP = {}

MAPPINA = {"COMPETENZAACROBAZIA" : "MODDESTREZZA",
            "COMPETENZAADDESTRAREANIMALI" : "MODCARISMA",
            "COMPETENZAARCANO" : "MODINTELLIGENZA",
            "COMPETENZAATLETICA" : "MODFORZA",
            "COMPETENZAFURTIVITA" : "MODDESTREZZA",
            "COMPETENZAINDAGARE" : "MODINTELLIGENZA",
            "COMPETENZAINGANNO" : "MODCARISMA",
            "COMPETENZAINTUIZIONE" : "MODSAGGEZZA",
            "COMPETENZAINTIMIDIRE" : "MODCARISMA",
            "COMPETENZAINTRATTENERE" : "MODCARISMA",
            "COMPETENZAMEDICINA" : "MODSAGGEZZA",
            "COMPETENZANATURA" : "MODINTELLIGENZA",
            "COMPETENZAPERCEZIONE" : "MODSAGGEZZA",
            "COMPETENZAPERSUASIONE" : "MODCARISMA",
            "COMPETENZARAPIDITADIMANO" : "MODDESTREZZA",
            "COMPETENZARELIGIONE" : "MODINTELLIGENZA",
            "COMPETENZASOPRAVVIVENZA" : "MODSAGGEZZA",
            "COMPETENZASTORIA" : "MODINTELLIGENZA"}


COMPETENZA = 2

def parsinator(data, what="schedabase"):
    global MAP
    if what == "shedabase":
        MAP = json.loads(open("templates/schedabase/map_base.json", "r").read())
    output_objects, urls = binder(data, MAP)
    page_order = [(0, "normal","base/base1.png"), (1, "normal","base/base2.png"), (2, "normal","base/base3.png")]
    return output_objects, urls, page_order

def modificatore_caratteristiche(data):
    try:
        value = int(math.floor((int(data) - 10) / 2))
        value = str(value) if value >= 0 else "-" + str(abs(value))
    except Exception as e:
        value = ""
        print(str(e))
    return value


def binder(data, map):
    global COMPETENZA, MAP_VAL
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
                    user_data = user_data.get(whe)[postition]
                except:
                    user_data = ""
                    break
            elif wha == "modificatore":
                user_data = user_data.get(whe)
                user_data = modificatore_caratteristiche(user_data)
                MAP_VAL[data_to_put] = int(user_data)
                wha = "text"
            elif wha == "tiroSalvezza":
                user_data = tirosalvatore(data_to_put, user_data, whe, data)
                wha = "text"
            elif wha == "boolean":
                user_data = user_data.get(whe)
                if user_data:
                    user_data = "."
                    wha = "text"
                else:
                    user_data = ""
            elif wha == "competenza":
                user_data = abilita(data_to_put, user_data, whe)
                wha = "text"
            elif wha == "boolmaestria":
                user_data = user_data.get(whe)
                if user_data:
                    user_data = "*"
                    wha = "text"
                else:
                    user_data = ""
            elif wha == "dadivita":
                user_data = dadivita( user_data.get(whe))
                wha = "text"
            elif wha == "dadivitarimasti":
                user_data = dadivita_rimasti( user_data.get(whe))
                wha = "text"
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
        if not content or content == "None":
            content = ""
        if content == "":
            continue
        new_object = DataDeD(name = data_to_put, data_type = last_wha, data_text = content)
        for attr, value in scheda_map_content.items():
            new_object.add_parameter(attr, value)
        if "size" not in scheda_map_content.keys():
            new_object.add_parameter("size", 12)
        output_objects.append(new_object)
        if last_wha == "url":
            urls.append(content)
    return output_objects, urls

def dadivita(data : list):
    """estrae stringa dadi vita totali"""
    stringa = ""
    for entries in data:
        stringa = stringa + str(entries.get("quantita")) + entries.get("tipologia") + " "
    return stringa

def dadivita_rimasti(data : list):
    """estrae stringa dadi vita rimasti"""
    stringa = ""
    for entries in data:
        stringa = stringa + str(entries.get("quantita") - entries.get("usati")) + entries.get("tipologia") + " "
    return stringa

        

def tirosalvatore(data_to_put, user_data, whe, data):
    user_data = user_data.get(whe)
    user_data = modificatore_caratteristiche(user_data) 
    checker = data_to_put + "BOL"
    user_data_temp = data
    where_temp, wha_temp = MAP.get(checker).get("JSON").get("WHERE"), MAP.get(checker).get("JSON").get("WHAT")
    for whe_temp, wha_temp in zip(where_temp, wha_temp):
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

def mod_car(data_to_put):
    WICH = MAPPINA.get(data_to_put)
    return MAP_VAL.get(WICH)


def abilita(data_to_put, user_data, whe):
    competence = user_data.get(whe)
    base_value = mod_car(data_to_put) 
    if competence:
        base_value = base_value + COMPETENZA
    maestria = "maestria" + whe.capitalize()
    maestria_check = user_data.get(maestria)
    if maestria_check:
        base_value = base_value + 2
    return str(base_value)

def controll(data):
    if not isinstance(data, dict):
        return False
    if data is None:
        return False
    if len(data) == 0:
        return False
    return True