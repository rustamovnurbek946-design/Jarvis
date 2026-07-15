# Sprint 5 — Ovozli xabardan maqsad qo'shish (Gemini audio)

**Maqsad:** Telegram botga ovozli xabar (voice note) yuborilganda, Gemini'ning
audio kirishini to'g'ridan-to'g'ri tushunish qobiliyatidan foydalanib uni
matnga o'giradi, matndan maqsad (goal) maydonlarini ajratib oladi va
foydalanuvchi tasdiqlagach `goals` jadvaliga yangi maqsad sifatida qo'shadi.

**Natija (Definition of Done):** Botga ovozli xabar yuborilganda — bot
transkriptni va taklif qilingan maqsadni ko'rsatadi → foydalanuvchi ✅/❌
tugmasi bilan tasdiqlaydi yoki bekor qiladi → tasdiqlansa maqsad DB'ga yoziladi
va bosh sahifadagi (`/`) maqsadlar ro'yxatida darhol ko'rinadi.

> **Qabul qilingan qarorlar (shu sprint boshida, foydalanuvchi bilan):**
> - Darhol saqlash emas, **tasdiqlash oqimi** — noto'g'ri eshitilgan ovoz
>   bazaga yozilib qolmasligi uchun (vaqtinchalik draft jadvali kerak).
> - Ovozli xabar **max 120 soniya** — undan uzunini bot rad etadi (Gemini
>   xarajati/javob vaqtini nazorat qilish uchun).
> - Yangi muhit o'zgaruvchisi **kerak emas** — mavjud `GEMINI_API_KEY` /
>   `GEMINI_MODEL` (`gemini-2.5-flash`) audio kirishni tabiiy qo'llab-quvvatlaydi
>   (Vercel AI SDK `generateText`/`generateObject` message content'da
>   `{ type: "file", mediaType: "audio/ogg", data: Buffer }`).

---

## 5.1 Ma'lumotlar bazasi — vaqtinchalik draft jadvali

- [x] `lib/db/schema.ts` ga yangi jadval: `voiceGoalDrafts`
  - `id` (uuid, pk), `userId` (FK → `users`, cascade),
  - `transcript` (text) — Gemini'dan olingan xom transkript,
  - `draftGoal` (jsonb, tip: `GoalDraft`) — ajratib olingan maydonlar,
  - `status` (`pending` | `confirmed` | `cancelled`, enum yoki text),
  - `createdAt`, `expiresAt` (masalan +15 daqiqa) — `telegramLoginTokens`
    bilan bir xil naqsh (bir martalik, muddatli, keyin consume qilinadigan yozuv)
  — jadval real Neon bazasiga qo'llandi va tasdiqlandi
- [x] Drizzle migratsiya generatsiya qilish (`npx drizzle-kit generate`) va
  tekshirish (`drizzle/000X_*.sql`) — `drizzle/0003_tricky_whiplash.sql`
  generatsiya qilindi va `npm run db:migrate` bilan haqiqiy Neon bazasiga
  muvaffaqiyatli qo'llanildi
- [x] `GoalDraft` tipi (title, description, type: "yearly"|"quarterly", year,
  quarter, domain, targetMetric — hammasi `goals` jadvaliga mos)

## 5.2 Ovozni yuklab olish

- [~] `lib/telegram/downloadVoiceFile.ts` — grammY `ctx.getFile()` →
  `file_path` → `https://api.telegram.org/file/bot<token>/<file_path>` dan
  `fetch` bilan yuklab, `Buffer` qaytaradi — kod yozildi, TypeScript/build toza,
  lekin haqiqiy Telegram voice fayl bilan hali sinovdan o'tmagan
- [~] Davomiylik tekshiruvi: `ctx.message.voice.duration > 120` bo'lsa yuklab
  olmasdan darhol rad javobi (`t.voiceTooLong`) — kod tayyor, real xabar bilan
  tekshirilmagan
- [~] Fayl hajmi/format: Telegram voice note doim `audio/ogg` (Opus) —
  mediaType shu deb qat'iy belgilangan — mantiq to'g'ri, real faylda
  tasdiqlanmagan

## 5.3 Gemini: audio → transkript → maqsad qoralamasi

- [~] `lib/ai/audioGoal.ts`:
  - `transcribeVoice(buffer: Buffer): Promise<string>` — `generateText`,
    `messages: [{ role: "user", content: [{ type: "text", text: "..." }, { type: "file", mediaType: "audio/ogg", data: buffer }] }]`,
    prompt: audio'da nima aytilgan bo'lsa, so'zma-so'z (aslidagi tilda: uz/ru/en)
    transkript qaytarish — **kod yozildi, lekin haqiqiy audio (.ogg) fayl bilan
    hali sinovdan o'tmagan** (sandbox'da mikrofon/real voice-note yo'q)
  - `extractGoalDraft(transcript: string, user: User): Promise<GoalDraft>` —
    `generateObject` + yangi Zod sxema (`lib/ai/schemas.ts`: `goalDraftSchema`),
    kontekstga hozirgi sana/yil/chorak (`lib/date.ts` orqali, `Asia/Tashkent`)
    beriladi, shunda "shu yil", "keyingi chorak" kabi nisbiy iboralar to'g'ri
    hal qilinadi (aniq bo'lmasa: `type: "yearly"`, joriy yil — default) —
    **haqiqiy Gemini API'ga qarshi skript orqali 2 holatda tasdiqlangan**
    ("bu yil sport..." → to'g'ri `yearly`/2026; "shu chorakda loyiha..." →
    to'g'ri `quarterly`/Q3/2026, joriy sana 2026-07-15 uchun to'g'ri chorak)
  - Bo'sh/tushunarsiz transkript holati (`transcript.trim().length === 0`) —
    maxsus xato qaytaradi, bot `t.voiceUnclear` bilan javob beradi
- [x] `goalDraftSchema` (Zod): `title` (majburiy), `description` (ixtiyoriy),
  `type` (enum), `year` (number), `quarter` (1-4 | null), `domain` (ixtiyoriy,
  erkin teg), `targetMetric` (ixtiyoriy) — yuqoridagi skript testida ishlatilib
  tasdiqlandi

## 5.4 Telegram bot integratsiyasi

- [~] `bot.ts` ga `bot.on("message:voice", ...)` handler:
  1. foydalanuvchini `findUserByChat` orqali topish (bog'lanmagan bo'lsa —
     `t.notLinked`)
  2. davomiylik tekshiruvi → yuklab olish → `replyWithChatAction("typing")`
  3. `transcribeVoice` → `extractGoalDraft`
  4. `voiceGoalDrafts` jadvaliga yozish (`status: "pending"`, `expiresAt`)
  5. Foydalanuvchiga xabar: "🎙 Eshitganim: _<transkript>_" + taklif qilingan
     maqsad (title/domain/type/year/quarter/targetMetric) + inline tugmalar
     `✅ Qo'shish` (`vgc:<draftId>`) / `❌ Bekor qilish` (`vgx:<draftId>`)
  — kod yozildi, `tsc`/`lint`/`build` toza o'tdi, lekin haqiqiy Telegram
  orqali hali E2E sinovdan o'tmagan
- [~] `bot.callbackQuery(/^vgc:(.+)$/, ...)` — draftni `pending` va
  muddati o'tmaganligini tekshiradi → `goals` jadvaliga yozadi
  (`createGoalAction` bilan bir xil maydonlar, lekin to'g'ridan-to'g'ri
  `db.insert(goals)`, chunki bu server action emas, bot konteksti) →
  draft `status: "confirmed"` → `t.goalAddedFromVoice` — kod tayyor, real
  tugma bosilib tekshirilmagan
- [~] `bot.callbackQuery(/^vgx:(.+)$/, ...)` — draft `status: "cancelled"` →
  `t.voiceCancelled` — kod tayyor, real tugma bosilib tekshirilmagan
- [~] Muddati o'tgan/allaqachon hal qilingan draft uchun tugma bosilsa —
  `t.voiceDraftExpired` — mantiq yozildi (status/expiresAt tekshiruvi bilan),
  real sinovdan o'tmagan
- [ ] (Ixtiyoriy, agar oddiy bo'lsa) `bot.on("message:audio", ...)` — yuklangan
  audio-fayl (voice note emas, media sifatida) uchun ham xuddi shu oqim,
  mediaType `ctx.message.audio.mime_type` dan olinadi — **hali qo'shilmagan**
  (ixtiyoriy deb belgilangani uchun MVP doirasidan tashqarida qoldirildi)

## 5.5 Matnlar (`lib/telegram/messages.ts`)

- [x] 3 tilda (uz/ru/en) yangi kalitlar: `voiceListening` ("tinglayapman..."),
  `voiceTooLong`, `voiceUnclear`, `voiceError`, `voiceHeard`, `voiceDraftTitle`,
  maydon nomlari (`voiceFieldType/Year/Quarter/Domain/Target`,
  `voiceTypeYearly/Quarterly`), `confirmButton`, `cancelButton`,
  `goalAddedFromVoice`, `voiceCancelled`, `voiceDraftExpired` — barcha 3 tilda
  yozildi va `botT()` orqali ulandi

## 5.6 Xatolik holatlari

- [~] Gemini chaqiruvi xato bersa (tarmoq/limit) — foydalanuvchiga umumiy xato
  xabari, xatolik `console.error` bilan loglanadi (mavjud `chatError` naqshiga
  o'xshab) — kod yozildi (`try/catch` + `t.voiceError`), real xato holati bilan
  hali sinovdan o'tmagan
- [~] Bog'lanmagan foydalanuvchi (`findUserByChat` → null) — `t.notLinked`,
  hech narsa saqlanmaydi/chaqirilmaydi — kod yozildi, real sinovdan o'tmagan
- [x] Draft eskirishi (`expiresAt`) uchun alohida cron/tozalash **kerak emas**
  (MVP) — faqat tugma bosilganda tekshiriladi; eski `pending` qatorlar vaqti
  bilan jadvalda qoladi (keyingi sprintda tozalash cron qo'shilishi mumkin) —
  bu qaror, amalga oshirish talab qilmaydi

---

### Tekshirish (sprint oxirida)

> **Holat: hali bajarilmagan.** Kod tayyor va `tsc`/`lint`/`build` orqali
> tasdiqlangan, `extractGoalDraft` esa haqiqiy Gemini API'ga qarshi (matn
> transkript bilan) sinovdan o'tkazilgan, lekin quyidagi 6 band — haqiqiy
> Telegram qurilmasidan ovozli xabar yuborishni talab qiladi va sandbox'dan
> bajarib bo'lmaydi (avvalgi sprintlardagi `/today`/`/plan` E2E testlariga
> o'xshab).

1. Botga qisqa ovozli xabar yuborish (masalan: "Bu yil sport bilan muntazam
   shug'ullanish, haftasiga 3 marta trenajyor zali") → bot transkript va
   taklif qilingan maqsadni to'g'ri ko'rsatishi
2. ✅ tugmasini bosish → maqsad `/` sahifasida (Maqsadlar ro'yxati) darhol
   paydo bo'lishi, `type`/`year`/`domain` to'g'ri saqlanganini tekshirish
3. ❌ tugmasini bosish → hech narsa saqlanmasligi
4. 120 soniyadan uzun ovozli xabar yuborish → rad javobi kelishi
5. Tinch/tushunarsiz (masalan bo'sh) ovozli xabar → `voiceUnclear` javobi
6. Eski (allaqachon tasdiqlangan yoki muddati o'tgan) tugmani qayta bosish →
   `voiceDraftExpired` javobi

### Keyingi sprintga o'tish sharti
Ovozli xabardan maqsad qo'shish end-to-end (transkript → tasdiqlash → DB →
UI'da ko'rinishi) haqiqiy Telegram orqali ishlasa → keyingi ishga o'tiladi.

---

## 📋 Hisobot (avtomatik)
- **Sana:** 2026-07-15
- **Tayyorlik:** 59% (done + 0.4×partial)
- **So'nggi bajarilgan ishlar:** `voiceGoalDrafts` jadvali va `GoalDraft` tipi
  qo'shildi, migratsiya (`0003_tricky_whiplash.sql`) real Neon bazasiga
  qo'llandi; `lib/telegram/downloadVoiceFile.ts` (davomiylik tekshiruvi bilan
  yuklab olish) va `lib/ai/audioGoal.ts` (`transcribeVoice` + `extractGoalDraft`,
  `goalDraftSchema`) yaratildi — `extractGoalDraft` haqiqiy Gemini API'ga
  qarshi 2 holatda (yillik/choraklik nisbiy sana hal qilish) tasdiqlandi;
  `bot.ts`ga `message:voice` handler va `vgc:`/`vgx:` tasdiqlash/bekor qilish
  callback'lari, `messages.ts`ga 3 tilda yangi matnlar qo'shildi; `tsc
  --noEmit`, `lint`, `build` — barchasi xatosiz o'tdi.
- **Keyingi qadam:** Haqiqiy Telegram qurilmasidan ovozli xabar yuborib to'liq
  E2E tekshiruv (transkript ko'rsatilishi → ✅/❌ tugma → DB'ga yozilishi →
  `/` sahifasida ko'rinishi, 120s limit, tushunarsiz ovoz, eskirgan draft) —
  sandbox'dan bajarib bo'lmaydi.
