import fastapi, uvicorn

def avvio():
    app = fastapi.FastAPI()
    return app

app = avvio()
# homepage
@app.get("/")
async def root():
    return {"message": "Hello World"}

# endpoint
@app.get("/api")
async def api():
    return {"message": "Hello World 2"}

if __name__ == "__main__":
    uvicorn.run(app, host="8001", port=8001)