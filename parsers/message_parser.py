from aiogram.types import Update, Message as TgMessage
from dtos.message_dto import Message
import re


def parse_update_to_message_dto(update: Update) -> Message:
    """Парсит объект Update в DTO Message с подробным логированием"""
    print("🛠️ Начало парсинга Update в DTO")

    if not update.message:
        print("❌ Update не содержит сообщения")
        raise ValueError("Update does not contain a message")

    message = update.message
    return parse_message_to_dto(message)


def parse_message_to_dto(message: TgMessage) -> Message:
    """Парсит объект Message в DTO с подробным логированием"""
    print("🛠️ Начало парсинга Message в DTO")

    if not message:
        print("❌ Объект сообщения отсутствует")
        raise ValueError("Message object is missing")

    # Извлекаем основные данные
    group_id = str(message.chat.id) if message.chat else "unknown"
    user_id = str(message.from_user.id) if message.from_user else "unknown"

    print(f"🔍 Парсинг сообщения: chat_id={group_id}, user_id={user_id}")

    # Обрабатываем текст сообщения
    text = message.text or message.caption or ""
    print(f"📝 Текст сообщения: {text[:50]}{'...' if len(text) > 50 else ''}")

    # Проверяем наличие медиа (объединенное поле)
    has_photo = bool(message.photo)
    has_video = bool(message.video or message.video_note)
    has_audio = bool(message.audio or message.voice)
    has_document = bool(message.document)

    # Проверяем тип документа
    is_document_media = False
    if message.document:
        mime_type = message.document.mime_type or ""
        is_document_media = any(x in mime_type for x in ['image', 'video', 'audio'])

    media_attachment = has_photo or has_video or has_audio or has_document or is_document_media

    # Проверяем наличие стикеров/GIF
    sticker_or_gif_present = bool(message.sticker) or bool(message.animation)

    # Считаем скрытые ссылки (text_link)
    hidden_url_count = 0
    entities = message.entities or message.caption_entities or []

    for entity in entities:
        if entity.type == "text_link":
            hidden_url_count += 1
            print(f"🔗 Обнаружена скрытая ссылка: {entity.url}")

    print(f"📸 Медиа-вложение: {media_attachment}")
    print(f"🎭 Стикер/GIF: {sticker_or_gif_present}")
    print(f"🔗 Скрытых ссылок: {hidden_url_count}")

    return Message(
        group_id=group_id,
        user_id=user_id,
        text=text,
        hidden_url_count=hidden_url_count,
        media_attachment=media_attachment,
        sticker_or_gif_present=sticker_or_gif_present
    )