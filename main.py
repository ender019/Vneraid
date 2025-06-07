from aiogram import Bot

from configs.config import Config
from handlers import dp


# Запуск бота
async def main():
    config = Config()
    bot = Bot(token=config.TOKEN)
    await dp.start_polling(bot)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())