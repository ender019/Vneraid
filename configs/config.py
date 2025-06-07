import logging
import os

from dotenv import load_dotenv

class Config:
    TOKEN: str
    port: int

    def __init__(self):
        logging.basicConfig(level=logging.INFO)
        load_dotenv()

        self.TOKEN = os.getenv('BOT_TOKEN')
        self.PORT = os.getenv('PORT')