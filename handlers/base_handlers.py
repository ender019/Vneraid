import logging

from aiogram import types, F, Router

base_router = Router()

# Обработчик текстовых сообщений (эхо)
@base_router.message(F.text)
async def echo_message(message: types.Message):
    await message.answer(f"Ты сказал: {message.text}")

# Обработчик неизвестных команд
@base_router.message()
async def unknown_commands(message: types.Message):
    await message.reply("Извини, я не понимаю команды. Попробуй /help")

@base_router.errors()
async def errors_handler(update: types.Update, exception: Exception):
    logging.exception(f"Ошибка при обработке {update}: {exception}")
    return True