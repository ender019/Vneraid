import logging
import aiohttp
from aiogram import Router, types
from aiogram.filters import ChatMemberUpdatedFilter, IS_ADMIN, IS_MEMBER, ADMINISTRATOR
from aiogram.types import ChatMemberUpdated

group_router = Router()


@group_router.chat_member(ChatMemberUpdatedFilter(
    member_status_changed=(IS_MEMBER | IS_ADMIN | ADMINISTRATOR)
))
async def on_bot_added_to_group(event: ChatMemberUpdated):
    """Обработчик добавления бота в группу"""
    # Проверяем, что это наш бот и его статус изменился
    if event.new_chat_member.user.id == event.bot.id:
        group_id = str(event.chat.id)
        group_name = event.chat.title or "Unknown Group"

        # Определяем user_id того, кто добавил бота
        user_id = "unknown"
        if event.from_user:
            user_id = str(event.from_user.id)
        else:
            # Если from_user отсутствует, пробуем получить через администраторов
            try:
                admins = await event.bot.get_chat_administrators(group_id)
                if admins:
                    user_id = str(admins[0].user.id)
            except Exception as e:
                logging.error(f"Error getting admins: {e}")

        # Подготовка данных для отправки
        payload = {
            "group_id": group_id,
            "user_id": user_id,
            "group_name": group_name
        }

        # Отправка данных на сервер
        url = "https://192.168.52.48:9002/bot/session"
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                        url,
                        json=payload,
                        ssl=False  # Отключаем проверку SSL для локального сервера
                ) as response:

                    if response.status == 200:
                        logging.info(f"✅ Session created for group {group_id}")
                    else:
                        error_text = await response.text()
                        logging.error(f"⚠️ Session creation failed: {response.status} - {error_text}")

        except Exception as e:
            logging.exception(f"🔥 Error sending session data: {e}")