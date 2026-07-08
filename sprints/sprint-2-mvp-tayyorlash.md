# Sprint 2 — MVP (dizayn bo'yicha tayyorlash)

**Maqsad:** Sprint 1 dizayni asosida ishlaydigan MVP qurish: foydalanuvchi kirishi,
maqsadlarni kiritish, kunini yozish, va AI (Gemini) yordamida kunni tahlil qilib
ertangi rejani generatsiya qilish. Bu bosqichda Calendar/Telegram **yo'q** —
faqat web ilova va AI yadrosi.

**Natija (Definition of Done):** Google bilan kirish ishlaydi; maqsad qo'shish;
kunni kiritish; "Reja generatsiya" tugmasi bosilganda Gemini tahlil + ertangi
tasklarni yaratadi va Dashboard'da ko'rinadi. Barchasi 3 tilda.

---

## 2.1 Loyiha karkasi va sozlamalar

- [x] `create-next-app` (Next.js 16, TS, Tailwind, App Router) — *bajarilgan va ishlamoqda*
- [ ] shadcn/ui init (`npx shadcn@latest init`) + kerakli komponentlarni qo'shish — **qaror:** shadcn CLI ishlatilmadi, `components/ui/` qo'lda dizayn handoff asosida yozildi (`components.json` yo'q)
- [x] Tailwind theme'ga Sprint 1 dizayn tokenlarini kiritish (rang, radius, shrift) — `app/tokens/*.css` → `app/globals.css` orqali ulangan, barcha komponentlarda ishlatilmoqda
- [ ] Och/qorong'i rejim (`next-themes` yoki class strategiyasi) — hali yo'q, `next-themes` paketi ham o'rnatilmagan
- [~] next-intl sozlash (`i18n/request.ts`, `messages/uz|ru|en.json`) — skelet bor (cookie asosida locale tanlanadi), lekin sahifalar hali unga ulanmagan
- [ ] `NextIntlClientProvider` ni root layout'ga ulash + `<html lang>` dinamik — `app/layout.tsx`da `lang="uz"` qattiq yozilgan, provider yo'q, matnlar hardcode (o'zbekcha)
- [x] dev-deps: `drizzle-kit`, `dotenv`, `tsx` o'rnatish — barchasi `package.json`da bor (+ `dotenv-cli`)

## 2.2 Ma'lumotlar bazasi (Neon + Drizzle)

- [x] Neon Postgres bazasini yaratish (Vercel Marketplace yoki neon.tech) → `DATABASE_URL` — Vercel Marketplace orqali "neondb" ulandi, `.env.local`da `DATABASE_URL` va bog'liq o'zgaruvchilar mavjud (gitignored)
- [x] Drizzle sxema (`lib/db/schema.ts`): users, accounts, sessions, goals, tasks, daily_logs, notifications — to'liq, + `verificationToken` jadvali ham bor (8 jadval)
- [x] Drizzle klient (`lib/db/index.ts`), `drizzle.config.ts` — `neon-http` drayveri bilan ulangan
- [x] Migratsiya generatsiya va push: `npx drizzle-kit generate` + `npx drizzle-kit migrate` — `drizzle/0000_famous_randall_flagg.sql` + `meta/` generatsiya qilingan va qo'llangan
- [x] Bazaga ulanish va jadvallar yaratilganini tekshirish — `scripts/seed.ts` orqali 1 demo user + 3 goals + 3 tasks muvaffaqiyatli yozildi, `/` sahifasi shu ma'lumotni real bazadan o'qiydi

## 2.3 Autentifikatsiya (Auth.js + Google)

- [~] `auth.ts` — Google provayder, Drizzle adapter, email allowlist — kod to'liq yozilgan (scope: calendar.events + calendar.readonly, `access_type=offline`, `prompt=consent`, allowlist tekshiruvi), lekin hali end-to-end sinovdan o'tmagan (quyidagi bandlar sabab)
- [x] `app/api/auth/[...nextauth]/route.ts` — mavjud, `auth.ts` handlerlarini eksport qiladi
- [ ] Google Cloud Console'da OAuth client yaratish (redirect URI: `/api/auth/callback/google`) — bajarilmagan
- [ ] `.env.local`: `AUTH_SECRET`, `AUTH_GOOGLE_ID/SECRET`, `ALLOWED_EMAILS` — hali qo'shilmagan (faqat Neon/DB o'zgaruvchilari bor)
- [ ] `/login` sahifasi (dizayn bo'yicha) + "Google orqali kirish" tugmasi — mavjud emas
- [ ] Himoyalangan layout: sessiya yo'q bo'lsa `/login` ga yo'naltirish — mavjud emas, barcha sahifalar hozircha `getDemoUserId()` (vaqtinchalik demo user) orqali ishlaydi
- [ ] Chiqish (sign out) tugmasi — mavjud emas

## 2.4 Maqsadlar (Goals) — CRUD

- [x] Server action'lar: `createGoal`, `updateGoal`, `deleteGoal`, `listGoals` (userId bo'yicha izolyatsiya) — `lib/actions/goals.ts` (`createGoalAction`/`updateGoalAction`/`deleteGoalAction`, hammasi `getDemoUserId()` orqali userId bilan izolyatsiya qilingan); ro'yxat o'qish `app/page.tsx` Server Component ichida to'g'ridan-to'g'ri
- [~] `/goals` sahifasi: ro'yxat + guruhlash (yillik/kvartal) — ro'yxat sahifasi bosh sahifada (`/`) joylashgan (`/goals` emas), guruhlash (yillik/kvartal) hali yo'q
- [~] Maqsad qo'shish/tahrirlash formasi (modal, Zod validatsiya) — `GoalFormModal` ishlaydi va real bazaga saqlaydi, lekin Zod validatsiyasi yo'q (oddiy `if (!title.trim())`), va tur/soha/yil/kvartal maydonlari formada yo'q
- [~] Progress ko'rsatkichi va holat (active/done/paused) boshqaruvi — progress-bar va active/done holati ishlaydi (progress ≥100 → done avtomatik), `paused` holati hali ishlatilmaydi/UI'da yo'q
- [ ] Bo'sh holat ko'rinishi — kod ichida topilmadi

## 2.5 Kunim (My Day) — kun kiritish

- [ ] Server action'lar: `saveDailyLog` (upsert bir kunga bitta), `toggleTask` — mavjud emas (`lib/actions/`da faqat `goals.ts` bor)
- [ ] `/day` sahifasi: bugungi vazifalar (✓) + erkin matn textarea + saqlash — `/day` mavjud, lekin faqat statik/mock "Kun tahlili" ko'rinishi (`lib/mock/tasks-data.ts`, `lib/mock/ai-data.ts`), kiritish/saqlash funksiyasi yo'q
- [ ] O'tgan kunlar tarixi ro'yxati — yo'q
- [ ] Bir kun tafsiloti (AI tahlili bilan) — `/day`da statik mock tavsiyalar ko'rsatiladi, real AI natijasi emas

## 2.6 Dashboard va vazifalar

- [ ] `/` (Dashboard): bugungi vazifalar (vaqtli + ustuvor), maqsad progressi, AI tahlil kartasi — **qaror:** `/` endi Dashboard emas, Maqsadlar sahifasiga aylantirildi; yagona shu funksiyalarni birlashtiruvchi Dashboard sahifasi yo'q
- [~] Vazifa komponenti: ✓ toggle, muhimlik, vaqt, maqsad tegi — `components/tasks/task-row.tsx` to'liq UI bilan ishlaydi (toggle, `PriorityTag`, vaqt, maqsad tegi), lekin `/tasks` sahifasi hali mock/local React state'da (`lib/mock/tasks-data.ts`), DB'ga ulanmagan — refresh'da yo'qoladi
- [ ] Qo'lda vazifa qo'shish (quick add) server action: `createTask` — mavjud emas, `/tasks`dagi "qo'shish" faqat local state'ga yozadi
- [ ] AI tahlil kartasi (4 fokus + ballar) — `/ai` sahifasida statik mock kartalar bor (`AI_STATS`), haqiqiy Gemini natijasiga ulanmagan

## 2.7 AI yadrosi (Gemini)

- [~] `lib/ai/gemini.ts`, `schemas.ts`, `prompts.ts`, `generatePlan.ts` — *bajarilgan (skelet, ~350 qator kod)*, lekin hali chaqirilmagan/sinovdan o'tmagan
- [ ] `GEMINI_API_KEY` ni `.env.local` ga qo'shish — hali yo'q
- [ ] `generatePlanForUser` ni Calendar'siz ishlaydigan qilib sozlash (busySlots bo'sh bo'lsa ham) — tekshirilmagan
- [ ] "Ertangi rejani generatsiya qilish" tugmasi → server action → Gemini → DB'ga yozish — UI'da bunday tugma yo'q
- [ ] Structured output (Zod) validatsiyasini tekshirish; xato holatini boshqarish — tekshirilmagan
- [ ] AI tahlili `daily_logs.aiAnalysis` ga yozilishi va Dashboard'da ko'rinishi — hali amalga oshmagan

## 2.8 Ko'p tillilik va tema

- [ ] Barcha ekranlarda tarjima kalitlaridan foydalanish (hardcoded matn yo'q) — hozircha barcha matnlar o'zbekcha hardcode qilingan
- [ ] Til almashtirish (cookie `NEXT_LOCALE`) — Sozlamalardan — Sozlamalar sahifasi yo'q, shuning uchun UI orqali almashtirish yo'q
- [ ] Och/qorong'i rejim ishlashini tekshirish — tema mexanizmi hali yo'q

---

### Tekshirish (sprint oxirida)
1. `npm run dev` → `/login` → Google bilan kirish (allowlist email)
2. `/goals` da 1–2 maqsad qo'shish
3. `/day` da bugungi kunni yozish + vazifa belgilash
4. Dashboard'da "Reja generatsiya" → ertangi tasklar va AI tahlili paydo bo'lishi
5. Til va tema almashishini tekshirish

### Keyingi sprintga o'tish sharti
AI reja sikli (maqsad → kun → tahlil → ertangi reja) web'da to'liq ishlasa → **Sprint 3**.

---

## 📋 Hisobot (avtomatik)
- **Sana:** 2026-07-08
- **Tayyorlik:** 31% (done + 0.4×partial)
- **So'nggi bajarilgan ishlar:** Neon Postgres Vercel Marketplace orqali ulandi va migratsiya (8 jadval) qo'llandi; `scripts/seed.ts` bilan demo ma'lumot yozildi; Maqsadlar (`/`) sahifasi to'liq real bazaga ko'chirildi — `lib/actions/goals.ts` Server Action'lari orqali qo'shish/tahrirlash/o'chirish endi doimiy saqlanadi (avvalgi faqat-local-state bug tuzatildi); Vercel'da "jarvis" loyihasi yaratilib bog'landi.
- **Keyingi qadam:** `/tasks` sahifasini ham `lib/actions` orqali real bazaga ulash (hozir hali mock/local state); Auth.js login oqimini (`/login`, OAuth client, `.env` kalitlar, himoyalangan layout) ishga tushirish va `getDemoUserId()`ni haqiqiy sessiya bilan almashtirish.
