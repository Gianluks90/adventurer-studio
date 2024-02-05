import fastapi
import uvicorn
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from functions.fast_ask import *
import uuid
from functions.pdf_writer import write_txt_to_pdf_new as pdf_writer
from functions.data_parse import parsinator
import gc

app = fastapi.FastAPI(middleware=[Middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"])])

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/api")
async def api():
    return {"message": "Hello World 2"}


@app.post("/api/schedabase/", response_model=dict)
async def results_post(data: dict):
    ido = str(uuid.uuid4()).replace("-", "").replace(" ", "")
    
    if not isinstance(data, dict):
        return fastapi.responses.JSONResponse(
            status_code=400, content={"error": "Invalid JSON"}
        )
    
    status_data = status_getter(data)
    data, urls, page_order = parsinator(data, "shedabase")
    path = pdf_writer(data, document=1, urls=urls, id=ido, status=status_data, page_order=page_order)
    
    # delete unnecessary variables
    del data, urls, ido, status_data
    gc.collect()
    
    # Download file
    return fastapi.responses.FileResponse(path, filename="Personaggio.pdf")


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)
