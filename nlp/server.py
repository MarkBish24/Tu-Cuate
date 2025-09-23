from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
import uvicorn
import pandas as pd

#custom files
import clean_data as d
from nlp import MistakesDataset

app = FastAPI()

mistakes_dataset = MistakesDataset()

@app.get("/")
def read_root():
    return {"message": "Welcome! Use /get-data to fetch data."}

@app.get("/get-data")
def get_data(days: str = Query("all", description="Select days: 1, 7, 30 or 'all'")):
    if mistakes_dataset.base_df is None:
        mistakes_dataset.initialize(d.get_data())

    dataframe = mistakes_dataset.get_dataframe(as_json=False)
    if days != 'all':
        try: 
            days_int = int(days)
            cutoff = pd.Timestamp.now() - pd.Timedelta(days=days_int)
            dataframe['timestamp'] = pd.to_datetime(dataframe['timestamp'])
            dataframe = dataframe[dataframe['timestamp'] >= cutoff]
        except ValueError:
            return JSONResponse(content={"error": "Invalid days value"}, status_code=400)
        
    # Convert timestamp to ISO format string for JSON
    df = dataframe.copy()  # avoid SettingWithCopyWarning
    df['timestamp'] = df['timestamp'].astype(str)

    category_summary = mistakes_dataset.get_category_summary(as_json=False)
    # Return JSON
    return JSONResponse(content={
        "data": df.to_dict(orient="records"),
        "categories": category_summary.to_dict(orient="records")
    })

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=4000)