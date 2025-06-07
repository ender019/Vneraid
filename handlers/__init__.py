from aiogram import Dispatcher

from handlers.base_handlers import base_router

dp = Dispatcher()
dp.include_router(base_router)