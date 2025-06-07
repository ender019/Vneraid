import logging

from aiogram import types, F, Router
from aiogram.filters.command import Command

command_router = Router()

# Обработчик команды /start
@command_router.message(Command("start"))
async def cmd_start(message: types.Message):
    logging.info("start")
    await message.answer(
        "Привет! Я простой бот на aiogram.\n"
        "Отправь мне любое сообщение, и я его повторю!\n"
        "Команды:\n"
        "/start - начать общение\n"
        "/help - помощь\n"
        "/info - информация о боте"
    )
    


# Обработчик команды /help
@command_router.message(Command("help"))
async def cmd_help(message: types.Message):
    await message.answer("Я могу:\n"
                         "- Отвечать на команды\n"
                         "- Повторять твои сообщения\n"
                         "Просто отправь мне текст!")

# Обработчик команды /info
@command_router.message(Command("info"))
async def cmd_info(message: types.Message):
    await message.answer(
        "🤖 Бот создан с помощью aiogram 3.x\n"
        "📚 Пример простого Telegram бота\n"
        "⭐ Основные функции:\n"
        "- Эхо-сообщения\n"
        "- Базовые команды"
    )