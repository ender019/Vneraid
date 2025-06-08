import ijson
import csv
import re
from urlextract import URLExtract
import phonenumbers
import nltk
from nltk.corpus import stopwords
from urllib.parse import urlparse
import ijson.common

# === Настройка NLTK ===
nltk.download('stopwords')
STOPWORDS = set(stopwords.words('russian'))

# === Константы ===
SHORT_DOMAINS = {'bit.ly', 't.co', 'goo.gl', 'tinyurl.com', 'ow.ly'}
extractor = URLExtract()
punct_re = re.compile(r'[.,!?:;]')

# === Утилиты ===

def has_short_url(domains):
    return any(d in SHORT_DOMAINS for d in domains)

def extract_domains(urls):
    domains = set()
    for u in urls:
        try:
            parsed = urlparse(u if '://' in u else '//' + u, scheme='http')
            d = parsed.netloc.lower()
            if d.startswith('www.'):
                d = d[4:]
            if d:
                domains.add(d)
        except Exception:
            continue
    return domains

def analyze_text(text):
    urls = extractor.find_urls(text)
    domains = extract_domains(urls) if urls else set()
    words = text.split()
    word_count = len(words)
    char_total = len(text)
    unique = set(words)
    stop_cnt = sum(1 for w in words if w.lower() in STOPWORDS)
    punct_cnt = len(punct_re.findall(text))
    repeats = re.findall(r'(.)\1{2,}', text)
    caps_words = sum(1 for w in words if w.isupper() and len(w) > 1)

    return {
        'text': text,
        'url_count': len(urls),
        'unique_domains': len(domains),
        'hidden_url_count': 0,  # заполним ниже
        'shortened_url': has_short_url(domains),
        'email_present': bool(re.search(r'\b[\w.+-]+@[\w-]+\.[\w.-]+\b', text)),
        'phone_present': any(True for _ in phonenumbers.PhoneNumberMatcher(text, 'RU')),
        # теперь char_length = среднее число символов на слово
        'char_length': char_total / word_count if word_count else 0,
        'word_count': word_count,
        'unique_word_ratio': len(unique) / word_count if word_count else 0,
        'stopword_ratio': stop_cnt / word_count if word_count else 0,
        'punctuation_count': punct_cnt,
        'repeat_symbol_ratio': sum(len(m) for m in repeats) / char_total if char_total else 0,
        'caps_lock_words_ratio': caps_words / word_count if word_count else 0,
        'hashtags_count': text.count('#'),
        'media_attachment': False,          # заполним ниже
        'sticker_or_gif_present': False,    # заполним ниже
        'target': 0
    }

# === Основной парсер ===

input_path = 'clean_test.json'
output_path = 'clean_test.csv'

with open(input_path, 'r', encoding='utf-8') as in_f, \
     open(output_path, 'w', encoding='utf-8', newline='') as out_f:

    writer = None

    try:
        for msg in ijson.items(in_f, 'messages.item'):
            if msg.get('type') != 'message':
                continue

            # Собираем текст
            text_field = msg.get('text', '')
            if isinstance(text_field, list):
                parts = []
                for p in text_field:
                    if isinstance(p, str):
                        parts.append(p)
                    elif isinstance(p, dict) and 'text' in p:
                        parts.append(p['text'])
                text = ''.join(parts)
            else:
                text = text_field or ''

            # Анализ
            feats = analyze_text(text)

            # Считаем вложенные ссылки
            ents = msg.get('text_entities', [])
            hidden = [e for e in ents if e.get('type') == 'text_link' and e.get('href')]
            feats['hidden_url_count'] = len(hidden)

            # Булевы признаки
            feats['shortened_url'] = bool(feats['shortened_url'])
            feats['email_present'] = bool(feats['email_present'])
            feats['phone_present'] = bool(feats['phone_present'])

            # Медиа
            has_media = any(k in msg for k in ('photo','video_file','file','sticker','video','voice'))
            feats['media_attachment'] = has_media
            feats['sticker_or_gif_present'] = msg.get('media_type') in ('sticker','animation','gif')

            # Инициализируем writer
            if writer is None:
                fieldnames = list(feats.keys())
                writer = csv.DictWriter(out_f, fieldnames=fieldnames)
                writer.writeheader()

            writer.writerow(feats)

    except ijson.common.IncompleteJSONError:
        # досрочно оборванный JSON — просто завершаем
        print("Warning: JSON обрывается по файлу — записаны все ранее спарсенные сообщения.")

print(f"Готово: сохранено в {output_path}")
