#handlers/base_handlers
import logging
from aiogram import types, F, Router
from aiogram.enums import ChatType

from parsers.message_parser import parse_update_to_message_dto, parse_message_to_dto
from services.message_service import send_message_to_service

base_router = Router()


@base_router.message()
async def handle_all_messages(message: types.Message):
    try:
        print(f"\n⚡ Получено сообщение: {message.text if message.text else message}")

        # Парсинг сообщения в DTO
        try:
            message_dto = parse_message_to_dto(message)
            print(f"✅ Успешно распарсено в DTO: {message_dto}")
        except Exception as e:
            print(f"❌ Ошибка парсинга: {str(e)}")
            logging.error(f"Parsing error: {str(e)}")
            return

        # Отправка на сервис и обработка результата
        spam_flag = await send_message_to_service(message_dto, message)

        # Обработка спама
        if spam_flag == 2:
            # Удаление пользователя для групповых чатов
            if message.chat.type in [ChatType.GROUP, ChatType.SUPERGROUP]:
                try:
                    # Блокируем и сразу разблокируем (эквивалент удаления)
                    await message.chat.ban(user_id=message.from_user.id)
                    await message.chat.unban(user_id=message.from_user.id)
                    await message.answer(
                        f"⛔ Пользователь {message.from_user.full_name} удален за спам!"
                    )
                    print(f"❌ Пользователь {message.from_user.id} удален")
                except Exception as e:
                    logging.error(f"Ошибка удаления пользователя: {e}")
            return True  # Прерываем цепочку обработчиков

        elif spam_flag == 1:
            # Отправляем предупреждение
            await message.reply("⚠️ Ваше сообщение выглядит подозрительно!")
            print(f"⚠️ Отправлено предупреждение для {message.from_user.id}")
            return True  # Прерываем цепочку обработчиков

    except Exception as e:
        print(f"🔥 Критическая ошибка: {str(e)}")
        logging.exception(f"Error in handle_all_messages: {e}")


# Обработчик текстовых сообщений (эхо) - игнорирует команды
@base_router.message(F.text & ~F.text.startswith('/'))
async def echo_message(message: types.Message):
    print(f"📨 Обработка текстового сообщения: {message.text}")
    await message.answer(f"Ты сказал: {message.text}")


# Обработчик неизвестных команд
@base_router.message(F.text.startswith('/'))
async def unknown_commands(message: types.Message):
    print(f"⚠️ Обработка неизвестной команды: {message.text}")
    await message.reply("Неизвестная команда. Попробуй /help")


# Обработчик не текстовых сообщений
@base_router.message(F.content_type != 'text')
async def non_text_messages(message: types.Message):
    print(f"🖼 Обработка не текстового сообщения: {message.content_type}")
    await message.reply("Я работаю только с текстом!")


@base_router.errors()
async def errors_handler(update: types.Update, exception: Exception):
    error_msg = f"🛑 Ошибка при обработке {update}: {exception}"
    print(error_msg)
    logging.exception(error_msg)
    return True