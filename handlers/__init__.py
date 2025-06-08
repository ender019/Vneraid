from aiogram import Dispatcher
from .command_handler import command_router
from .base_handlers import base_router
from .callback_handlers import callback_router  # новый импорт
from .group_handlers import group_router

dp = Dispatcher()
dp.include_router(command_router)
dp.include_router(callback_router)  # добавляем обработчик колбэков
dp.include_router(base_router)
dp.include_router(group_router)