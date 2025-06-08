from dataclasses import dataclass

@dataclass
class Message:
    group_id: str
    user_id: str
    text: str
    hidden_url_count: int  # Новое поле: количество скрытых ссылок
    media_attachment: bool  # Объединенное поле для медиа
    sticker_or_gif_present: bool  # Новое поле: наличие стикеров/GIF