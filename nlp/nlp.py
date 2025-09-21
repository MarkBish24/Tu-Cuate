import pandas as pd
import spacy
from sentence_transformers import SentenceTransformer, util


from clean_data import get_data, clean_data

class MistakesDataset:
    def __init__(self):
        # load spanish nlp model
        self.nlp = spacy.load('es_core_news_sm')

        # load similarity model 
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

        #weights for similarity score
        self.weight_mistake = 0.75
        self.weight_sentence = 0.25

        # What it does in the initalization funtion
        # self.raw_data = get_data()
        self.raw_data = None

        # Clean and Standardize
        # self.base_df = clean_data(self.raw_data)
        self.base_df = None

        # self.category_summary = self.compute_category_summary(self.base_df)
        self.category_summary = None

    def initialize(self, data):
        # Load and clean data
        self.set_raw_data(data)
        self.set_base_df(clean_data(self.raw_data))
        self.set_category_summary(self.compute_category_summary(self.base_df))

    def set_raw_data(self, data):
        self.raw_data = data
    def set_base_df(self, df):
        self.base_df = df
    def set_category_summary(self, computed_categories):
        self.category_summary = computed_categories


    def get_dataframe(self, as_json=True):
        # return the cleaned Dataframe
        if as_json:
            return self.base_df.to_json(orient="records")
        return self.base_df
    
    def get_category_summary(self, as_json=True):
        # return a grouped version of the categories
        if as_json:
            return self.category_summary.to_json(orient="records")
        return self.category_summary
    
    def compute_category_summary(self, dataframe):

        #Encoding for only the original sentence
        embeddings_orig = self.model.encode(dataframe['original_sentence_cleaned'].tolist(), convert_to_tensor=True)
        embeddings_corr = self.model.encode(dataframe['corrected_sentence_cleaned'].tolist(), convert_to_tensor=True)

        dataframe['sentence_similarity'] = [util.cos_sim(o, c).item() for o, c in zip(embeddings_orig, embeddings_corr)]

        # Encode only the original mistake and its correction
        embeddings_orig = self.model.encode(dataframe['original_mistake_cleaned'].tolist(), convert_to_tensor=True)
        embeddings_corr = self.model.encode(dataframe['correction_cleaned'].tolist(), convert_to_tensor=True)

        dataframe['mistake_similarity'] = [util.cos_sim(o, c).item() for o, c in zip(embeddings_orig, embeddings_corr)]


        #create a score where both the sentence and the mistake are involved
        dataframe['difficulty_score'] = (
            (1 - dataframe['mistake_similarity']) * self.weight_mistake +
            (1 - dataframe['sentence_similarity']) * self.weight_sentence
        )


        category_grouped = dataframe.groupby('category_standard')

        category_summary = category_grouped.agg(
            count=('difficulty_score', 'count'),
            avg_difficulty=('difficulty_score', 'mean')
        ).reset_index()

        #compute an emphasis score
        category_summary['emphasis_score'] = category_summary['count'] * category_summary['avg_difficulty']

        #normalize to 0-1
        category_summary['emphasis_score'] /= category_summary['emphasis_score'].max()

        return category_summary
