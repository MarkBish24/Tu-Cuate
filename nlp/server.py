from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Python Server is runnings!"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=4000)