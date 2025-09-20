from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
import uvicorn

#custom files
import clean_data as d

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome! Use /get-data to fetch data."}

@app.get("/get-data")
def read_root():
    data = d.get_data()
    cleaned_dataframe = d.clean_data(data)
    # return jsonable_encoder(data)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=4000)