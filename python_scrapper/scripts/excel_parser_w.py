# -*- coding: utf-8 -*-
from datetime import date
import pandas
import json
import re


# def get_multiple_choices(question, answer):
#     final_answer = []
#     answer = remove_spaces(answer)
#     for valid_answer in question['v']:
#
#
#     return final_answer

def parse_int(s):
    return int(re.search(r'\d+', s).group())


def remove_spaces(s):
    return re.sub(r"\s\s+", " ", str(s)).strip()


def process_workshop(workshop_df, answers, questions, question_aliases, type):
    index = 0
    question_indexes = {}
    for i in workshop_df.head(0):
        clean_i = remove_spaces(i)
        if clean_i in question_aliases:
            question_indexes[index] = questions[question_aliases[clean_i]]
        else:
            print('Question not found: ' + clean_i)
        index += 1

    new_people = []
    for i in workshop_df.iterrows():
        values = i[1].tolist()

        person_id = ''
        for j in range(1, 4):
            person_id += str(values[j]).upper()

        person_id_suffix = 1
        aux_person_id = person_id
        while aux_person_id in new_people:
            aux_person_id = person_id + '_' + str(person_id_suffix)
            person_id_suffix += 1
        person_id = aux_person_id
        new_people.append(person_id)

        if person_id in answers:
            answer = answers[person_id]
        else:
            answer = answers[person_id] = {}
        for j in range(0, len(values)):
            if j in question_indexes:
                question = question_indexes[j]
                if not question['id'] in answer:
                    answer[question['id']] = {
                        'PRE': None,
                        'POST': None
                    }
                if not pandas.isna(values[j]):
                    if question['t'] == 'c':
                        answer[question['id']][type] = parse_int(values[j])
                    elif question['t'] == 'm':
                        pass
                        # answer[question['id']][type] = get_multiple_choices(question, values[j])
                    else:
                        answer[question['id']][type] = str(values[j])


def main():
    df_q = pandas.read_excel('questions2.xlsx', 'aliases', header=None)
    df_w_pre = pandas.read_excel('WCE_pre.xlsx', 'responses')
    df_w_post = pandas.read_excel('WCE_post.xlsx', 'responses')

    questions = {}
    workshop = {
        'n': 'ITBA10-WCE',
        'id': 0,
        'd': {
            'y': 2019,
            'm': 5,
            'd': 10
        }
    }
    responses = workshop['r'] = {}

    with open('out_q.json', 'r', encoding='utf8') as f:
        json_questions = json.load(f, )
        for question in json_questions:
            questions[question['n']] = question

    question_aliases = {}
    for i in df_q.iterrows():
        values = i[1].tolist()
        question = remove_spaces(values[0])
        for j in range(0, len(values)):
            if not pandas.isna(values[j]) and type(values[j]) == type(str()):
                question_aliases[remove_spaces(values[j])] = question

    process_workshop(df_w_pre, responses, questions, question_aliases, 'PRE')
    process_workshop(df_w_post, responses, questions, question_aliases, 'POST')

    with open('out_w_wce.json', 'w', encoding='utf8') as f:
        json.dump([workshop], f, indent=2, sort_keys=True, ensure_ascii=False)

    print('Done')


if __name__ == '__main__':
    main()

