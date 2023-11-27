from typing import Union
from fastapi import FastAPI
from amqp_client import amqp_handler
from routes import router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

app = FastAPI()

# Load .env file
load_dotenv()

origins = [
    "*",
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.on_event('startup')
async def startup():
    print('Starting')
    try:
        await amqp_handler.init()
    except:
        print("RabbitMQ is not available, the host is probably not well configured")
        
