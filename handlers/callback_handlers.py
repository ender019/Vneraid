#handlers/callback_handlers
import logging
import time
import asyncio
from aiogram import types, Router, Bot
from aiogram.types import ChatPermissions

callback_router = Router()


@callback_router.callback_query(lambda c: c.data.startswith("mute_"))
async def mute_user_callback(callback: types.CallbackQuery, bot: Bot):
    # Проверка прав администратора
    member = await bot.get_chat_member(callback.message.chat.id, callback.from_user.id)
    if member.status not in ["administrator", "creator"]:
        await callback.answer("❌ Только администраторы могут использовать эту команду!", show_alert=True)
        return

    user_id = int(callback.data.split("_")[1])
    until_date = int(time.time()) + 10  # Текущее время + 10 секунд

    try:
        # Устанавливаем мут
        await bot.restrict_chat_member(
            chat_id=callback.message.chat.id,
            user_id=user_id,
            permissions=ChatPermissions(
                can_send_messages=False,
                can_send_media_messages=False,
                can_send_polls=False,
                can_send_other_messages=False,
                can_add_web_page_previews=False,
                can_change_info=False,
                can_invite_users=False,
                can_pin_messages=False,
            ),
            until_date=until_date
        )

        # Удаляем сообщение с кнопкой
        await callback.message.delete()

        # Отправляем уведомление
        notification = await bot.send_message(
            chat_id=callback.message.chat.id,
            text=f"⛔ Пользователь замучен на 10 секунд"
        )

        # Запланировать автоматическое снятие мута через 11 секунд
        await asyncio.sleep(11)

        try:
            # Восстанавливаем стандартные права пользователя
            await bot.restrict_chat_member(
                chat_id=callback.message.chat.id,
                user_id=user_id,
                permissions=ChatPermissions(
                    can_send_messages=True,
                    can_send_media_messages=True,
                    can_send_polls=True,
                    can_send_other_messages=True,
                    can_add_web_page_previews=True,
                    can_change_info=False,
                    can_invite_users=False,
                    can_pin_messages=False,
                )
            )

            # Обновляем уведомление
            await bot.edit_message_text(
                chat_id=callback.message.chat.id,
                message_id=notification.message_id,
                text="✅ Мут с пользователя снят"
            )
        except Exception as e:
            logging.error(f"Unmute error: {e}")
            await bot.send_message(
                chat_id=callback.message.chat.id,
                text=f"⚠ Не удалось автоматически снять мут: {e}"
            )

    except Exception as e:
        logging.error(f"Mute error: {e}")
        await callback.answer(f"Ошибка: {str(e)}", show_alert=True)


# Обработчик для удаления пользователя
@callback_router.callback_query(lambda c: c.data.startswith("delete_user_"))
async def delete_user_callback(callback: types.CallbackQuery, bot: Bot):
    # Проверка прав администратора
    member = await bot.get_chat_member(callback.message.chat.id, callback.from_user.id)
    if member.status not in ["administrator", "creator"]:
        await callback.answer("❌ Только администраторы могут использовать эту команду!", show_alert=True)
        return

    user_id = int(callback.data.split("_")[2])

    try:
        # Удаляем пользователя из чата
        await bot.ban_chat_member(
            chat_id=callback.message.chat.id,
            user_id=user_id
        )

        # Сразу разбаниваем, чтобы пользователь мог вернуться по ссылке (кик вместо бана)
        await bot.unban_chat_member(
            chat_id=callback.message.chat.id,
            user_id=user_id
        )

        # Удаляем сообщение с кнопкой
        await callback.message.delete()

        # Отправляем подтверждение
        await bot.send_message(
            chat_id=callback.message.chat.id,
            text=f"❌ Пользователь удален из чата"
        )

    except Exception as e:
        logging.error(f"Delete user error: {e}")
        await callback.answer(f"Ошибка: {str(e)}", show_alert=True)


# Обработчик отмены удаления
@callback_router.callback_query(lambda c: c.data == "cancel_delete")
async def cancel_delete_callback(callback: types.CallbackQuery):
    await callback.message.delete()
    await callback.answer("❌ Удаление отменено", show_alert=True)