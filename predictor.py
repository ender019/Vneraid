# predictor_service.py

import joblib
import re
from urllib.parse import urlparse

import nltk
import pandas as pd
import phonenumbers
from fastapi import FastAPI
from pydantic import BaseModel
from scipy.sparse import hstack
from urlextract import URLExtract
from nltk.corpus import stopwords

# === Setup NLTK & constants ===
nltk.download('stopwords')
STOPWORDS = set(stopwords.words('russian'))

SHORT_DOMAINS = {'bit.ly', 't.co', 'goo.gl', 'tinyurl.com', 'ow.ly'}
extractor    = URLExtract()
PUNCT_RE     = re.compile(r'[.,!?:;]')

# === Global placeholders ===
main_model = None
main_vec   = None


def modelLoader(filename: str):
    """
    Загружает модель и TF-IDF векторизатор из joblib-файла.
    Ожидается словарь {'model': LogisticRegression, 'vectorizer': TfidfVectorizer}.
    """
    global main_model, main_vec
    data = joblib.load(filename)
    main_model = data['model']
    main_vec   = data['vectorizer']


def preprocess(text: str) -> dict:
    txt = text or ""
    # URLs + домены
    urls = extractor.find_urls(txt)
    domains = set()
    for u in urls:
        try:
            p = urlparse(u if '://' in u else '//' + u, scheme='http')
            d = p.netloc.lower().lstrip("www.")
            if d:
                domains.add(d)
        except:
            continue

    # слова, символы и статистики
    words = txt.split()
    wc = len(words)
    char_tot = len(txt)
    stop_cnt = sum(1 for w in words if w.lower() in STOPWORDS)
    repeats = re.findall(r'(.)\1{2,}', txt)
    caps_words = sum(1 for w in words if w.isupper() and len(w) > 1)
    punct_cnt = len(PUNCT_RE.findall(txt))

    # Защита от деления на ноль
    char_length = char_tot / wc if wc > 0 else 0.0
    unique_word_ratio = len(set(words)) / wc if wc > 0 else 0.0
    stopword_ratio = stop_cnt / wc if wc > 0 else 0.0
    caps_lock_ratio = caps_words / wc if wc > 0 else 0.0
    repeat_ratio = sum(len(m) for m in repeats) / char_tot if char_tot > 0 else 0.0

    return {
        'text': txt,
        'url_count': len(urls),
        'unique_domains': len(domains),
        'shortened_url': any(d in SHORT_DOMAINS for d in domains),
        'email_present': bool(re.search(r'\b[\w.+-]+@[\w-]+\.[\w.-]+\b', txt)),
        'phone_present': any(True for _ in phonenumbers.PhoneNumberMatcher(txt, 'RU')),
        'char_length': char_length,
        'word_count': wc,
        'unique_word_ratio': unique_word_ratio,
        'stopword_ratio': stopword_ratio,
        'punctuation_count': punct_cnt,
        'repeat_symbol_ratio': repeat_ratio,
        'caps_lock_words_ratio': caps_lock_ratio,
        'hashtags_count': txt.count('#'),
    }


def predictor(feats: dict) -> int:
    """
    Прогнозирует 0/1/2 по словарю признаков:
      - рассчитывает текстовые фичи через preprocess
      - объединяет с hidden_url_count, media_attachment, sticker_or_gif_present
      - строит DataFrame, TF-IDF + числовые, вызывает модель
    """
    text = feats.get('text')
    if pd.isna(text):
        return 0

    # текстовые фичи
    text_feats = preprocess(text)

    # все фичи вместе
    full = {
        **text_feats,
        'hidden_url_count': feats.get('hiddenUrlCount', 0),
        'media_attachment': bool(feats.get('mediaAttachment', False)),
        'sticker_or_gif_present': bool(feats.get('stickerOrGifPresent', False)),
    }

    # DataFrame
    df = pd.DataFrame([full])
    X_text  = main_vec.transform(df['text'])
    X_feats = df.drop(columns=['text']).values.astype(float)
    X       = hstack([X_text, X_feats])

    proba = main_model.predict_proba(X)[:,1][0]
    if proba <= 0.25:
        return 0
    elif proba < 0.3:
        return 1
    else:
        return 2


# === FastAPI setup ===

app = FastAPI(title="Spam Predictor Service")


class MessageInputDTO(BaseModel):
    text: str
    hiddenUrlCount: int
    mediaAttachment: bool
    stickerOrGifPresent: bool


class PredictionResultDTO(BaseModel):
    prediction: int


@app.on_event("startup")
def load_model():
    # загрузка модели при старте сервиса
    modelLoader("l_model_with_all_feats.pkl")


@app.post("/bot/predict", response_model=PredictionResultDTO)
def predict_endpoint(dto: MessageInputDTO):
    """
    Принимает JSON вида MessageInputDTO,
    возвращает {"prediction": 0|1|2}.
    """
    pred = predictor(dto.dict())
    return PredictionResultDTO(prediction=pred)


# === Запуск (если нужен) ===
# Если запускаете напрямую: uvicorn predictor:app --host 0.0.0.0 --port 9003
# uvicorn predictor:app --port 9003
# uvicorn predictor:app --host 0.0.0.0 --port 9003

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9003)  # Важно: host=0.0.0.0