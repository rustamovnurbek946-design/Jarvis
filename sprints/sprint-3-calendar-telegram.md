# Sprint 3 — Google Calendar va Telegram bot

**Maqsad:** MVP'ni tashqi integratsiyalar bilan bog'lash: Google Calendar (ikki
tomonlama) va to'liq interaktiv Telegram bot. Shuningdek avtomatlashtirish uchun
Vercel Cron (kechki so'rov, kechki generatsiya, haftalik xulosa).

**Natija (Definition of Done):** AI tuzgan vaqtli vazifalar Google Calendar'ga
yoziladi va bandliklar reja tuzishda hisobga olinadi; Telegram bot orqali reja
ko'rish, vazifa ✓ qilish, kun yozish ishlaydi; cron'lar belgilangan vaqtda
xabar/generatsiya qiladi.

---

## 3.1 Google Calendar integratsiyasi (ikki tomonlama)

- [~] `lib/google/calendar.ts` — OAuth klient, token refresh, freebusy, event yaratish/o'chirish, list — *bajarilgan (skelet)*
- [x] Auth.js Google scope'iga `calendar.events` + `calendar.readonly` qo'shilganini tasdiqlash — `auth.ts`da `GOOGLE_SCOPES` sifatida mavjud (Google endi faqat Calendar ulash uchun ixtiyoriy qadam, login uchun emas)
- [ ] Kirish oqimida `access_type=offline` + `prompt=consent` orqali `refresh_token` olinishini tekshirish
- [ ] Token muddati tugaganda avtomatik yangilanishi (`tokens` event → DB update) test
- [ ] **O'qish:** ertangi kun bandliklarini (`getBusySlots`) `generatePlanForUser` ga ulash — AI to'qnashuvsiz reja tuzsin
- [ ] **Yozish:** time-block tasklar Google Calendar'ga event bo'lib yozilishi (`createCalendarEvent`) va `calendarEventId` saqlanishi
- [ ] Vazifa o'chiril/ko'chirilsa mos event ham yangilanishi/o'chirilishi
- [ ] `/calendar` sahifasi: haftalik ko'rinish (`listEvents` + ilova tasklari)
- [ ] Sozlamalarda Google ulanish holati va qayta ulash

## 3.2 Telegram bot (grammY, webhook)

> **Qaror (2026-07-15):** hisob bog'lash mexanizmi butunlay o'zgardi — eski
> `telegramLinkCode` (Sozlamalardan kod olish) oqimi olib tashlandi, o'rniga
> `/login` sahifasidagi deep-link (`/start login_<token>`) ishlatiladi (bir xil
> mexanizm auth login uchun ham, hisob bog'lash uchun ham). Erkin matnning
> ma'nosi ham o'zgardi: endi kundalik yozish emas, balki Gemini AI chat uchun
> ishlatiladi — kundalik yozish uchun alohida `/kun <matn>` buyrug'i qo'shildi.

- [x] `lib/telegram/bot.ts` — qayta yozildi: `/start login_<token>` deep-link (auth), `ALLOWED_TELEGRAM_USERNAMES` allowlist bilan avtomatik foydalanuvchi yaratish, `/today`, `/plan`, inline "done", `/kun <matn>` (kundalik), erkin matn → Gemini AI chat (`answerUserQuestion`) — kod to'liq va TypeScript/ESLint toza, lekin haqiqiy Telegram orqali to'liq E2E sinovdan o'tmagan (faqat login-token va Gemini javob funksiyalari skript orqali tasdiqlangan)
- [x] `lib/telegram/messages.ts` — 3 tilda bot matnlari — login (tasdiqlandi/rad etildi/eskirdi), `/kun` yordami, chat xatosi kabi yangi matnlar bilan to'liq yangilandi
- [~] `app/api/telegram/route.ts` — webhook handler (secret token) — o'zgarishsiz mavjud, lekin hali production webhook sifatida faollashtirilmagan; hozircha `scripts/dev-bot.ts` (long-polling) orqali lokal test qilinadi
- [x] `@BotFather` orqali bot yaratish → `TELEGRAM_BOT_TOKEN` — haqiqiy bot yaratildi (`@jarvisdreams_bot`), `.env.local`ga qo'shildi
- [~] `TELEGRAM_WEBHOOK_SECRET` belgilash va webhook o'rnatish (`setWebhook` + secret_token) — muhit o'zgaruvchisi `.env.local`da bor, lekin production `setWebhook` chaqiruvi hali qilinmagan (webhook faqat prod domenida ma'noli)
- [x] **Hisob bog'lash:** endi `telegramLinkCode` emas — `/login` sahifasi (`lib/actions/telegram-auth.ts`: `startTelegramLogin`/`checkTelegramLoginStatus`) bir martalik token yaratadi, bot `/start login_<token>` orqali tasdiqlaydi, keyin `signIn("telegram")` sessiyani ochadi — bir xil oqim ham yangi ham mavjud foydalanuvchi uchun ishlaydi
- [ ] `/today` — bugungi reja + inline ✓ tugmalar test — kod tayyor, haqiqiy Telegram orqali sinovdan o'tmagan
- [ ] `/plan` — botdan reja generatsiya qilish test — kod tayyor, haqiqiy Telegram orqali sinovdan o'tmagan
- [~] Erkin matn → bugungi `daily_log` ga qo'shilishi test — **arxitektura o'zgardi:** erkin matn endi Gemini AI chat'ga boradi, kundalik yozish alohida `/kun` buyrug'i orqali; `/kun` kodi tayyor lekin haqiqiy Telegram orqali sinovdan o'tmagan
- [x] AI bilan qisqa yozishish (ixtiyoriy kengaytma): maqsad/reja bo'yicha savol-javob — `lib/ai/chat.ts` (`answerUserQuestion`) foydalanuvchining bilim bazasi + agent instruksiyalari asosida Gemini'dan javob oladi, bot.ts'da erkin matn handleri sifatida ulangan; skript orqali sinovdan o'tkazilgan (bilim bazasi/instruksiyalardan to'g'ri foydalanib javob berdi)

## 3.3 Avtomatlashtirish (Vercel Cron)

- [~] `app/api/cron/evening/route.ts` — kechki "bugun qanday o'tdi?" so'rovi — *bajarilgan*
- [~] `app/api/cron/nightly/route.ts` — kechki generatsiya + motivatsiya xabari — *bajarilgan*
- [~] `app/api/cron/weekly/route.ts` — haftalik xulosa + progress yangilash — *bajarilgan*
- [~] `lib/cron.ts` (CRON_SECRET guard), `lib/ai/weeklySummary.ts` — *bajarilgan*
- [~] `vercel.json` cron jadvali (Asia/Tashkent → UTC) — *bajarilgan*
- [ ] `CRON_SECRET` ni Vercel env'ga qo'shish
- [ ] Har bir cron route'ni qo'lda (Bearer token bilan) chaqirib tekshirish
- [ ] Vaqt mintaqasi to'g'riligini tasdiqlash (21:00 / 23:00 Tashkent; yakshanba 20:00)

## 3.4 Xabarnoma oqimi (end-to-end)

- [ ] Kechqurun: bot "bugun qanday o'tdi?" so'raydi → javob log'ga tushadi
- [ ] Kechasi: reja generatsiya + "ertangi reja tayyor" + motivatsiya xabari keladi
- [ ] Ertalab: foydalanuvchi `/today` yoki web'dan rejani ko'radi
- [ ] Yakshanba: haftalik xulosa keladi, maqsad progressi yangilanadi

---

### Tekshirish (sprint oxirida)
1. Google bilan qayta kirib Calendar ruxsatini berish → time-block task yaratilganda event Calendar'da paydo bo'lishi
2. Ertangi kunda Calendar'da band vaqt bo'lsa, AI o'sha vaqtga reja qo'ymasligi
3. `/login` sahifasidan Telegram deep-link orqali kirish → `/today`, ✓, `/plan`, `/kun`, erkin matn (Gemini chat)
4. Har uch cron'ni qo'lda chaqirib natijani ko'rish

### Keyingi sprintga o'tish sharti
Calendar + Telegram + cron end-to-end ishlasa → **Sprint 4**.

---

## 📋 Hisobot (avtomatik)
- **Sana:** 2026-07-15
- **Tayyorlik:** 31% (done + 0.4×partial)
- **So'nggi bajarilgan ishlar:** Telegram bot login/hisob-bog'lash uchun asosiy kanalga aylandi — `lib/telegram/bot.ts` qayta yozildi (`/start login_<token>` deep-link, allowlist bilan avtomatik foydalanuvchi yaratish, `/kun` kundalik buyrug'i, erkin matn → Gemini AI chat), `lib/telegram/messages.ts` yangi matnlar bilan to'ldirildi, haqiqiy bot (`@jarvisdreams_bot`) yaratildi va `.env.local`ga ulandi, `scripts/dev-bot.ts` lokal long-polling test skripti qo'shildi. Google Calendar tomoni (3.1) va cron'lar (3.3) bu sessiyada o'zgarishsiz qoldi.
- **Keyingi qadam:** Bot handlerlarini haqiqiy Telegram orqali E2E sinovdan o'tkazish (`/today`, `/plan`, `/kun`, inline done); production webhook o'rnatish (`setWebhook`); Google Calendar OAuth oqimini (refresh_token, busySlots) haqiqiy hisobda tekshirish.

