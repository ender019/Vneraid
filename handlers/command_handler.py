#handlers/command_handler.py
import logging

from aiogram import types, F, Router
from aiogram.client.session import aiohttp
from aiogram.enums import ChatType
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
        "/info - информация о боте\n"
    )

# Обработчик команды /help
@command_router.message(Command("help"))
async def cmd_help(message: types.Message):
    help_text = ("Я могу:\n"
                 "- Отвечать на команды\n"
                 "- Повторять твои сообщения\n"
                 "- Распознавать голосовые сообщения\n\n"
                 "Команды:\n"
                 "/start - начать общение\n"
                 "/help - помощь\n"
                 "/info - информация о боте\n"
                 "/mute - замутить пользователя\n"
                 "/delete - удалить сообщение\n"
                 "/delete_user - удалить пользователя")

    # Добавляем команду верификации только в личных сообщениях
    if message.chat.type == ChatType.PRIVATE:
        help_text += "\n/verificate - верификация пользователя"

    await message.answer(help_text)

# Обработчик команды /info
@command_router.message(Command("info"))
async def cmd_info(message: types.Message):
    await message.answer(
        "🤖 Бот создан с помощью aiogram 3.x\n"
        "📚 Пример простого Telegram бота\n"
        "⭐ Основные функции:\n"
        "- Эхо-сообщения\n"
        "- Распознавание голосовых сообщений\n"
        "- Базовые команды модерации"
    )



# Обработчик команды /mute
@command_router.message(Command("mute"))
async def cmd_mute(message: types.Message):
    if message.reply_to_message:
        user_to_mute = message.reply_to_message.from_user
        # Создаем клавиатуру с кнопкой "Мут на 10 сек"
        keyboard = types.InlineKeyboardMarkup(inline_keyboard=[
            [types.InlineKeyboardButton(
                text="Мут на 10 сек",
                callback_data=f"mute_{user_to_mute.id}"
            )]
        ])
        await message.reply(
            f"Хотите замутить пользователя {user_to_mute.full_name}?",
            reply_markup=keyboard
        )
    else:
        await message.reply("Используйте эту команду в ответ на сообщение пользователя, которого нужно замутить!")

# Обработчик команды /delete
@command_router.message(Command("delete"))
async def cmd_delete(message: types.Message):
    if message.reply_to_message:
        try:
            await message.bot.delete_message(
                chat_id=message.chat.id,
                message_id=message.reply_to_message.message_id
            )
            await message.reply("Сообщение удалено ✅")
        except Exception as e:
            await message.reply(f"Ошибка при удалении: {str(e)}")
    else:
        await message.reply("Используйте эту команду в ответ на сообщение, которое нужно удалить!")


# Обработчик команды /delete_user
@command_router.message(Command("delete_user"))
async def cmd_delete_user(message: types.Message):
    if message.reply_to_message:
        user_to_delete = message.reply_to_message.from_user

        # Создаем клавиатуру для подтверждения удаления
        keyboard = types.InlineKeyboardMarkup(inline_keyboard=[
            [types.InlineKeyboardButton(
                text="✅ Да, удалить пользователя",
                callback_data=f"delete_user_{user_to_delete.id}"
            )],
            [types.InlineKeyboardButton(
                text="❌ Отмена",
                callback_data="cancel_delete"
            )]
        ])

        await message.reply(
            f"Вы уверены, что хотите удалить пользователя {user_to_delete.full_name}?",
            reply_markup=keyboard
        )
    else:
        await message.reply("Используйте эту команду в ответ на сообщение пользователя, которого нужно удалить!")


@command_router.message(Command("verificate"), F.chat.type == ChatType.PRIVATE)
async def cmd_verificate(message: types.Message):
    """Обработка команды верификации пользователя"""
    user_id = str(message.from_user.id)
    url = "https://192.168.52.48:9002/bot/verificate"
    payload = {"user_id": user_id}

    try:
        # Отправляем PUT-запрос с игнорированием SSL-ошибок (для тестового окружения)
        async with aiohttp.ClientSession() as session:
            async with session.put(
                    url,
                    json=payload,
                    ssl=False  # Отключаем проверку SSL для локального тестирования
            ) as response:

                if response.status == 200:
                    await message.answer("✅ Ваша верификация прошла успешно!")
                else:
                    error_text = await response.text()
                    await message.answer(f"⚠️ Ошибка верификации: {response.status} - {error_text}")

    except aiohttp.ClientConnectorError:
        await message.answer("🚫 Не удалось подключиться к серверу верификации")
    except Exception as e:
        await message.answer(f"🔥 Критическая ошибка: {str(e)}")
        logging.exception(f"Verification error: {e}")