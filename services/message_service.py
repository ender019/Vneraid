import json
import aiohttp
from dtos.message_dto import Message
from aiogram.types import Message as TgMessage
from aiogram.enums import ChatType  # Добавляем импорт

async def send_message_to_service(message_dto: Message, original_message: TgMessage) -> int:
    """Отправка DTO на сервис и обработка ответа"""
    print("\n" + "=" * 50)
    print("🚀 НАЧАЛО ОТПРАВКИ DTO")
    print(f"🆔 Group ID: {message_dto.group_id}")
    print(f"👤 User ID: {message_dto.user_id}")
    print(f"📝 Text: {message_dto.text[:50]}{'...' if len(message_dto.text) > 50 else ''}")
    print(f"🔗 Hidden URLs: {message_dto.hidden_url_count}")
    print(f"📸 Media Attachment: {message_dto.media_attachment}")
    print(f"🎭 Sticker/GIF: {message_dto.sticker_or_gif_present}")

    # Форматирование DTO в JSON
    dto_dict = {
        "user_id": message_dto.user_id,
        "group_id": message_dto.group_id,
        "text": message_dto.text,
        "hiddenUrlCount": message_dto.hidden_url_count,
        "mediaAttachment": message_dto.media_attachment,
        "stickerOrGifPresent": message_dto.sticker_or_gif_present
    }

    print("📦 DTO в формате JSON:")
    print(json.dumps(dto_dict, indent=2, ensure_ascii=False))

    spam_flag = 0  # По умолчанию - не спам

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                    "http://192.168.52.48:9002/bot/check",
                    json=dto_dict,
                    headers={"Content-Type": "application/json"},
                    timeout=2.0
            ) as response:

                if response.status == 200:
                    result = await response.json()
                    spam_flag = result.get('spam', 0)
                    print(f"🔄 Получен ответ: spam = {spam_flag}")

                    # Удаляем сообщение ТОЛЬКО для групповых чатов при spam=2
                    if spam_flag == 2:
                        if original_message.chat.type in [ChatType.GROUP, ChatType.SUPERGROUP]:
                            try:
                                await original_message.delete()
                                print("🚫 Сообщение удалено как спам")
                            except Exception as e:
                                print(f"Ошибка удаления сообщения: {e}")
                        else:
                            # Для личных чатов просто логируем
                            print("⛔ Сообщение помечено как спам, но в ЛС удалить нельзя")
                else:
                    print(f"⛔ Ошибка сервера: {response.status}")
    except Exception as e:
        print(f"🔥 Ошибка при отправке: {str(e)}")

    print("✅ ОБРАБОТКА ЗАВЕРШЕНА")
    print("=" * 50 + "\n")
    return spam_flag