# -*- coding: utf-8 -*-
import pandas
import json
import re


def remove_spaces(s):
    return re.sub(r"\s\s+", " ", str(s)).strip()


def main():
    xlsx = pandas.ExcelFile('questions2.xlsx')
    df = pandas.read_excel(xlsx, 'definitions', header=None)
    df_a = pandas.read_excel(xlsx, 'aliases', header=None)

    questions = []
    index = 0
    for i in df.iterrows():
        values = i[1].tolist()
        question = {
            'id': index,
            'n': remove_spaces(values[0]),
            'f': True if values[1] == 1 else False,
            'a': True
        }

        if values[2] == 1:
            question['t'] = 'c'
            valid_values = question['v'] = []
            for j in range(3, len(values), 2):
                if not pandas.isna(values[j]) and not pandas.isna(values[j+1]):
                    d = {
                        'v': int(values[j]),
                        'd': remove_spaces(values[j+1])
                    }
                    valid_values.append(d)
        elif values[2] == 2:
            question['t'] = 'm',
            valid_values = question['v'] = []
            for j in range(3, len(values)):
                if not pandas.isna(values[j]):
                    valid_values.append(remove_spaces(values[j])),
        else:
            question['t'] = 't'
            question['v'] = None

        index += 1
        questions.append(question)

    aliases = {}
    for i in df_a.iterrows():
        values = i[1].tolist()
        question = remove_spaces(values[0])
        for j in range(0, len(values)):
            if not pandas.isna(values[j]) and type(values[j]) == type(str()):
                aliases[remove_spaces(values[j])] = question

    data = {
        'definitions': questions,
        'aliases': aliases
    }
    with open('out_q.json', 'w', encoding='utf8') as f:
        json.dump(data, f, indent=2, sort_keys=True, ensure_ascii=False)

    print('Done')


if __name__ == '__main__':
    main()
