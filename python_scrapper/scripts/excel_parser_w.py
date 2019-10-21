# -*- coding: utf-8 -*-
import os
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
    result = re.search(r'\d+', s)
    return int(result.group()) if result is not None else None


def remove_spaces(s):
    return re.sub(r"\s\s+", " ", str(s)).strip()


def process_workshop(workshop_df, answers, questions, question_aliases, survey_type):
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
                        answer[question['id']][survey_type] = parse_int(values[j])
                    elif question['t'] == 'm':
                        pass
                        # answer[question['id']][type] = get_multiple_choices(question, values[j])
                    else:
                        answer[question['id']][survey_type] = str(values[j])


def get_workshops():
    path = 'C:\\Users\\Nico\\Documents\\ITBA\\Beca\\Cambio Climatico\\Data\\scripts\\workshops'
    workshops = {}
    # r=root, d=directories, f = files
    for r, d, f in os.walk(path):
        for filename in f:
            separator_index = filename.index("_")
            workshop_name = filename[:separator_index]
            survey_type = filename[separator_index + 1:filename.index(".")]

            if workshop_name not in workshops:
                workshops[workshop_name] = {}

            workshops[workshop_name][survey_type] = os.path.join(r, filename)

    return workshops


def main():
    questions = {}
    question_aliases = {}
    with open('out_q.json', 'r', encoding='utf8') as f:
        json_questions = json.load(f)
        for question in json_questions['definitions']:
            questions[question['n']] = question
        question_aliases = json_questions['aliases']

    workshop_files = get_workshops()

    i = 0
    workshops = []
    for workshop_name, data in workshop_files.items():
        workshop = {
            'n': workshop_name,
            'id': i,
            'd': None
        }
        responses = workshop['r'] = {}
        workshops.append(workshop)

        for survey_type, filepath in data.items():
            df_w = pandas.read_excel(filepath, sheet_name=0)
            process_workshop(df_w, responses, questions, question_aliases, survey_type)
            i += 1

    with open('out_w_itba.json', 'w', encoding='utf8') as f:
        json.dump(workshops, f, indent=2, sort_keys=True, ensure_ascii=False)

    print('Done')


if __name__ == '__main__':
    main()

