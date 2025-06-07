from aiogram.types import Update, Message as TgMessage
from dtos.message_dto import Message
import re


def parse_update_to_message_dto(update: Update) -> Message:
    """Парсит объект Update в DTO Message с подробным логированием"""
    print("🛠️ Начало парсинга Update в DTO")

    # Проверяем, есть ли сообщение в апдейте
    if not update.message:
        print("❌ Update не содержит сообщения")
        raise ValueError("Update does not contain a message")

    message = update.message

    # Извлекаем основные данные
    group_id = str(message.chat.id) if message.chat else "unknown"
    user_id = str(message.from_user.id) if message.from_user else "unknown"

    print(f"🔍 Парсинг сообщения: chat_id={group_id}, user_id={user_id}")

    # Обрабатываем текст сообщения
    text = message.text or message.caption or ""
    print(f"📝 Текст сообщения: {text[:50]}{'...' if len(text) > 50 else ''}")

    # Проверяем наличие медиа
    has_img = bool(message.photo)
    has_video = bool(message.video)
    has_audio = bool(message.audio or message.voice)

    # Проверяем наличие ссылок в тексте
    has_link = bool(re.search(r'https?://\S+', text))

    print(f"📸 Медиа-данные: img={has_img}, video={has_video}, audio={has_audio}")
    print(f"🔗 Ссылки: {has_link}")

    return Message(
        group_id=group_id,
        user_id=user_id,
        text=text,
        has_img=has_img,
        has_video=has_video,
        has_audio=has_audio,
        has_link=has_link
    )


def parse_message_to_dto(message: TgMessage) -> Message:
    """Парсит объект Message в DTO с подробным логированием"""
    print("🛠️ Начало парсинга Message в DTO")

    # Проверяем наличие сообщения
    if not message:
        print("❌ Объект сообщения отсутствует")
        raise ValueError("Message object is missing")

    # Извлекаем основные данные
    group_id = str(message.chat.id) if message.chat else "unknown"
    user_id = str(message.from_user.id) if message.from_user else "unknown"

    print(f"🔍 Парсинг сообщения: chat_id={group_id}, user_id={user_id}")

    # Обрабатываем текст сообщения (учитываем caption для медиа)
    text = ""
    if message.text:
        text = message.text
    elif message.caption:
        text = message.caption

    print(f"📝 Текст сообщения: {text[:50]}{'...' if len(text) > 50 else ''}")

    # Проверяем наличие медиа
    has_img = bool(message.photo)
    has_video = bool(message.video or message.video_note)
    has_audio = bool(message.audio or message.voice or message.document)

    # Для документов проверяем MIME-тип
    if message.document:
        mime_type = message.document.mime_type or ""
        if 'audio' in mime_type:
            has_audio = True
        elif 'image' in mime_type:
            has_img = True
        elif 'video' in mime_type:
            has_video = True

    # Проверяем наличие ссылок в тексте
    has_link = bool(re.search(r'https?://\S+', text)) if text else False

    print(f"📸 Медиа-данные: img={has_img}, video={has_video}, audio={has_audio}")
    print(f"🔗 Ссылки: {has_link}")

    # Создаем и возвращаем DTO объект
    return Message(
        group_id=group_id,
        user_id=user_id,
        text=text,
        has_img=has_img,
        has_video=has_video,
        has_audio=has_audio,
        has_link=has_link
    )