import os
import json
import random
import pandas as pd

def get_from_file():
    path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'names.json')
    print(path)
    with open(path, encoding='utf-8') as f:
        dphones = json.load(f)
        return dphones
    
def remove_not_active(dphones):
    return {k: v for k, v in dphones.items() if v.get('active', 0) == 1}


def add_name_for_prayer(prayer, userForPray):
    prayer['nameForPray'] = userForPray['name'] + ' בת ' + userForPray['momName']

def shuffle(phones, users):
    orig_phones = list(phones)
    isPossible = False
    for phone1 in orig_phones:
            for phone2 in phones:
                if users[phone1]['name'] != users[phone2]['name'] or users[phone1]['momName'] != users[phone2]['momName']:
                    isPossible = True
    
    if isPossible:
        while True:
            random.shuffle(phones)
            for phone1, phone2 in zip(orig_phones, phones):
                if users[phone1]['name'] == users[phone2]['name'] and users[phone1]['momName'] == users[phone2]['momName']:
                    continue
            break

def add_names_for_prayer(users):
    phones = list(users.keys())
    shuffle(phones, users)
    for i in range(len(phones) - 1):
        user = users[phones[i]]
        userForPray = users[phones[i+1]]
        add_name_for_prayer(user, userForPray)
    
    user = users[phones[len(phones) - 1]]
    userForPray = users[phones[0]]
    add_name_for_prayer(user, userForPray)
    
def write_to_file(data):
    df = pd.DataFrame.from_dict(data, orient='index')
    df['WhatsApp Number'] =  '+' + df.index # add phone columns
    df = df.rename(lambda name: '', axis='index') # remove row's name
    
    final_df = df[['WhatsApp Number', 'nameForPray']]
    file_name = 'final_names.xlsx'
    if os.path.exists(file_name):
        os.remove(file_name)
    final_df.to_excel(file_name,index=False)
    


if __name__ == '__main__':
    phones = get_from_file()
    active_phones = remove_not_active(phones)
    add_names_for_prayer(active_phones)
    write_to_file(active_phones)
