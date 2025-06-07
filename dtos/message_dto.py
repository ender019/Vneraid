from dataclasses import dataclass

@dataclass
class Message:
    group_id: str
    user_id: str
    text: str
    has_img: bool
    has_video: bool
    has_audio: bool
    has_link: bool