import logging
import json
from dtos.message_dto import Message


async def send_message_to_service(message_dto: Message):
    """Эмуляция отправки DTO с подробным выводом"""
    print("\n" + "=" * 50)
    print("🚀 НАЧАЛО ОТПРАВКИ DTO")
    print(f"🆔 Group ID: {message_dto.group_id}")
    print(f"👤 User ID: {message_dto.user_id}")
    print(f"📝 Text: {message_dto.text[:50]}{'...' if len(message_dto.text) > 50 else ''}")
    print(f"🖼 Has image: {message_dto.has_img}")
    print(f"🎥 Has video: {message_dto.has_video}")
    print(f"🎵 Has audio: {message_dto.has_audio}")
    print(f"🔗 Has link: {message_dto.has_link}")

    # Форматируем DTO как JSON для наглядности
    dto_dict = {
        "group_id": message_dto.group_id,
        "user_id": message_dto.user_id,
        "text": message_dto.text,
        "has_img": message_dto.has_img,
        "has_video": message_dto.has_video,
        "has_audio": message_dto.has_audio,
        "has_link": message_dto.has_link
    }

    print("📦 DTO в формате JSON:")
    print(json.dumps(dto_dict, indent=2, ensure_ascii=False))

    print("✅ ЭМУЛЯЦИЯ ОТПРАВКИ ЗАВЕРШЕНА")
    print("=" * 50 + "\n")

    # В реальном коде здесь была бы отправка на сервер
    # Для теста просто возвращаем успех
    return True