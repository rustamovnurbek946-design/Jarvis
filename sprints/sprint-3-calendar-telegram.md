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
- [ ] Auth.js Google scope'iga `calendar.events` + `calendar.readonly` qo'shilganini tasdiqlash (`auth.ts` da bor)
- [ ] Kirish oqimida `access_type=offline` + `prompt=consent` orqali `refresh_token` olinishini tekshirish
- [ ] Token muddati tugaganda avtomatik yangilanishi (`tokens` event → DB update) test
- [ ] **O'qish:** ertangi kun bandliklarini (`getBusySlots`) `generatePlanForUser` ga ulash — AI to'qnashuvsiz reja tuzsin
- [ ] **Yozish:** time-block tasklar Google Calendar'ga event bo'lib yozilishi (`createCalendarEvent`) va `calendarEventId` saqlanishi
- [ ] Vazifa o'chiril/ko'chirilsa mos event ham yangilanishi/o'chirilishi
- [ ] `/calendar` sahifasi: haftalik ko'rinish (`listEvents` + ilova tasklari)
- [ ] Sozlamalarda Google ulanish holati va qayta ulash

## 3.2 Telegram bot (grammY, webhook)

- [~] `lib/telegram/bot.ts` — /start, /today, /plan, inline "done", link kod, kun kundaligi — *bajarilgan (skelet)*
- [~] `lib/telegram/messages.ts` — 3 tilda bot matnlari — *bajarilgan*
- [~] `app/api/telegram/route.ts` — webhook handler (secret token) — *bajarilgan*
- [ ] `@BotFather` orqali bot yaratish → `TELEGRAM_BOT_TOKEN`
- [ ] `TELEGRAM_WEBHOOK_SECRET` belgilash va webhook o'rnatish (`setWebhook` + secret_token)
- [ ] **Hisob bog'lash:** Sozlamalarda `telegramLinkCode` generatsiya (server action) + botga yuborish oqimi
- [ ] `/today` — bugungi reja + inline ✓ tugmalar test
- [ ] `/plan` — botdan reja generatsiya qilish test
- [ ] Erkin matn → bugungi `daily_log` ga qo'shilishi test
- [ ] AI bilan qisqa yozishish (ixtiyoriy kengaytma): maqsad/reja bo'yicha savol-javob

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
3. Botga `/start` → kod bilan bog'lash → `/today`, ✓, `/plan`, erkin matn
4. Har uch cron'ni qo'lda chaqirib natijani ko'rish

### Keyingi sprintga o'tish sharti
Calendar + Telegram + cron end-to-end ishlasa → **Sprint 4**.

---

## 📋 Hisobot (avtomatik)
- **Sana:** 2026-07-08
- **Tayyorlik:** 12% (done + 0.4×partial)
- **So'nggi bajarilgan ishlar:** Bu sessiyada Sprint 3 ustida ish olib borilmadi (fokus Sprint 1/2 da edi). Oldindan yozilgan skeletlar o'zgarishsiz qoladi: `lib/google/calendar.ts`, `lib/telegram/bot.ts`/`messages.ts`, cron route'lari (`app/api/cron/*`), `lib/cron.ts`, `vercel.json`.
- **Keyingi qadam:** Sprint 2 (Auth.js login, AI tugmasi) yakunlangach Calendar OAuth oqimi va Telegram BotFather sozlamalarini ulash.

