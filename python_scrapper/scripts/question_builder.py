from __future__ import print_function, unicode_literals

from PyInquirer import style_from_dict, Token, prompt, Separator
from pprint import pprint

CLI_STYLE = style_from_dict({
    Token.Separator: '#cc5454',
    Token.QuestionMark: '#673ab7 bold',
    Token.Selected: '#cc5454',  # default
    Token.Pointer: '#673ab7 bold',
    Token.Instruction: '',  # default
    Token.Answer: '#f44336 bold',
    Token.Question: '',
})

QUESTION_TYPES = {
    'text': 'text',
    'choice': 'choice'
}

QUESTION_ADD = [
    {
        'type': 'confirm',
        'message': 'Add new question?',
        'name': 'add',
        'default': True
    }
]

VALUE_ADD = [
    {
        'type': 'confirm',
        'message': 'Add new value?',
        'name': 'value_add',
        'default': True
    }
]

QUESTION_INPUT = [
    {
        'type': 'input',
        'message': 'What\'s its name?',
        'name': 'input',
        'validate': lambda answer: 'You have to enter a name.' \
            if len(answer.strip()) == 0 else True
    }
]

VALUE_VALUE_INPUT = [
    {
        'type': 'input',
        'message': 'What\'s its value?',
        'name': 'input',
        'validate': lambda answer: 'You have to enter an integer value.' \
            if get_int(answer) is not None else True
    }
]

QUESTION_TYPE = [
    {
        'type': 'list',
        'message': 'Select question type',
        'name': 'type',
        'choices': [
            {
                'name': QUESTION_TYPES['text']
            },
            {
                'name': QUESTION_TYPES['choice']
            }
        ],
    }
]

QUESTIONS = {
    'input': QUESTION_INPUT,
    'type': QUESTION_TYPE,
    'add': QUESTION_ADD,
    'value_add': VALUE_ADD,
    'value_input': VALUE_VALUE_INPUT
}


def get_int(text):
    try:
        return int(text.strip())
    except:
        return None


def ask_add():
    return prompt(QUESTIONS['add'], style=CLI_STYLE)['add'] == True


def ask_name():
    return prompt(QUESTIONS['input'], style=CLI_STYLE)['input']


def ask_type():
    return prompt(QUESTIONS['type'], style=CLI_STYLE)['type']


def ask_value_add():
    return prompt(QUESTIONS['value_add'], style=CLI_STYLE)['value_add'] == True


def ask_value_name():
    return prompt(QUESTIONS['input'], style=CLI_STYLE)['input']


def ask_value_value():
    return prompt(QUESTIONS['value_input'], style=CLI_STYLE)['input']


def build_value(value, name):
    return {
        get_int(value): name
    }


def ask_values():
    values = []
    while ask_value_add():
        value = ask_value_value()
        name = ask_value_name()
        values.append(build_value(value, name))

    return values


def build_question(name, qtype, values):
    return {
        'n': name,
        'f': False,
        'm': qtype == QUESTION_TYPES['choice'],
        'v': values
    }


def save(questions):
    pprint(questions)


def main():
    questions = []
    while ask_add():
        name = ask_name()
        qtype = ask_type()
        if qtype == QUESTION_TYPES['choice']:
            values = ask_values()
        else:
            values = []
        questions.append(build_question(name, qtype, values))

    save(questions)



if __name__ == '__main__':
    main()
