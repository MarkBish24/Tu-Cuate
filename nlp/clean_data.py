import json
import pandas as pd
from pymongo import MongoClient
from pathlib import Path
from dotenv import load_dotenv
import os

def get_data():

    # get path to ENV info pass words
    env_path = Path('../.env') 
    load_dotenv(dotenv_path=env_path)

    mongo_url = os.getenv("MONGODB_URI")
    db_name = os.getenv("DB_NAME")

    # Open server and get data
    client = MongoClient(mongo_url)
    db = client[db_name]
    collection = db['spanish_attempts']

    data = list(collection.find())

    flattened_mistakes = []

    for doc in data:
        timestamp = doc.get('timestamp')
        original_sentence = doc.get('original')
        corrected_sentence = doc.get('corrected')

        for mistake in doc.get('mistakes', []):
            category_value = mistake.get('category', None)
            if isinstance(category_value, list):
                category_value = category_value[0] if category_value else None
            flattened_mistakes.append({
            'original_sentence': original_sentence,
            'corrected_sentence': corrected_sentence,
            'original_mistake': mistake.get('original'),
            'correction': mistake.get('correction'),
            'mistake_type': mistake.get('type'),
            'category': category_value,  # take first category
            'explanation': mistake.get('explanation'),
            'timestamp': timestamp
            })

    return flattened_mistakes

def clean_data(data):
    mistakes_df = pd.DataFrame(data)

    mistakes_df['original_sentence_cleaned'] = mistakes_df['original_sentence'].str.lower().str.strip()
    mistakes_df['corrected_sentence_cleaned'] = mistakes_df['corrected_sentence'].str.lower().str.strip()
    mistakes_df['original_mistake_cleaned'] = mistakes_df['original_mistake'].str.lower().str.strip()
    mistakes_df['correction_cleaned'] = mistakes_df['correction'].str.lower().str.strip()

    category_map = {
    'phrase flow': 'phraseFlow',
    'conjugation': 'conjugation',
    'gender/number agreement': 'genderNumberAgreement',
    'preposition': 'preposition',
    'vocabulary': 'vocabulary',
    'articles': 'articles',
    'pronouns': 'pronouns',
    'idiomatic expressions': 'idiomaticExpressions',
    'punctuation': 'punctuation'
    }

    mistakes_df['category_standard'] = mistakes_df['category'].map(category_map).fillna(mistakes_df['category'])

