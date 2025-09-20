import pandas as pd
import spacy
from sentence_transformers import SentenceTransformer, util
from tqdm import tqdm

from clean_data import get_data, clean_data

class MistakesDataset:
    def __init__(self):
        # Load and flatten data
        self.raw_data = get_data()
        # Clean and Standardize
        self.df = clean_data(self.raw_data)

    def get_dataframe(self):
        # return the cleaned Dataframe
        return self.df
    
    def get_categories(self):
        return self.categories
