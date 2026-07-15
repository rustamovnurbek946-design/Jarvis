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

## 2.3 Autentifikatsiya (Auth.js + Google + Telegram)

> **Qaror (2026-07-15):** asosiy kirish usuli Google emas, **Telegram** bo'ldi
> (bir martalik deep-link login-token orqali). Google endi faqat Calendar
> ulash uchun ixtiyoriy qadam. Buning uchun sessiya strategiyasi
> `"database"` dan `"jwt"` ga o'zgartirildi (Credentials provider talabi).

- [x] `auth.ts` — Google provayder (Calendar ulash uchun, scope: calendar.events + calendar.readonly, `access_type=offline`, `prompt=consent`) + yangi **Credentials("telegram")** provayder (bir martalik login-token orqali) + Drizzle adapter + JWT sessiya — to'liq yozilgan, login-token oqimi (yaratish/tasdiqlash/bir martalik ishlatish/muddat) skript orqali 8/8 tasdiqlangan
- [x] `app/api/auth/[...nextauth]/route.ts` — mavjud, `auth.ts` handlerlarini eksport qiladi
- [ ] Google Cloud Console'da OAuth client yaratish (redirect URI: `/api/auth/callback/google`) — hali bajarilmagan (endi faqat Calendar ulash uchun kerak, login uchun shart emas)
- [~] `.env.local`: kalitlar — `AUTH_SECRET`, `AUTH_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`, `ALLOWED_TELEGRAM_USERNAMES`, `GEMINI_API_KEY` qo'shildi; `AUTH_GOOGLE_ID/SECRET` va `ALLOWED_EMAILS` hali yo'q (Google Calendar ulanmagani uchun kerak emas edi)
- [x] `/login` sahifasi — dizayn bo'yicha emas, Telegram deep-link login UI (`app/login/page.tsx` + `components/auth/login-client.tsx`): tugma → bot ochiladi → polling → avtomatik `signIn("telegram")`
- [x] Himoyalangan layout: sessiya yo'q bo'lsa `/login` ga yo'naltirish — `app/(app)/layout.tsx` (Server Component) orqali amalga oshirildi; middleware **ataylab** ishlatilmadi (CVE-2025-29927 sababli rasmiy Vercel tavsiyasiga ko'ra middleware auth uchun yagona himoya bo'lmasligi kerak). `lib/db/demo-user.ts` o'chirildi, barcha sahifalar/action'lar (`app/(app)/page.tsx`, `lib/actions/goals.ts`) endi real `auth()` sessiyasidan `userId` oladi
- [x] Chiqish (sign out) tugmasi — `components/layout/sidebar.tsx`da ishlaydi, haqiqiy foydalanuvchi ismi/emailini ham ko'rsatadi

## 2.4 Maqsadlar (Goals) — CRUD

- [x] Server action'lar: `createGoal`, `updateGoal`, `deleteGoal`, `listGoals` (userId bo'yicha izolyatsiya) — `lib/actions/goals.ts` (`createGoalAction`/`updateGoalAction`/`deleteGoalAction`), endi real Auth.js sessiyasi (`auth()`) orqali `userId` oladi (avvalgi vaqtinchalik `getDemoUserId()` olib tashlandi); ro'yxat o'qish `app/(app)/page.tsx` Server Component ichida to'g'ridan-to'g'ri
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

## 2.9 Bilim bazasi va Agent instruksiyalari (yangi, sprint doirasidan tashqari qo'shildi)

> Reja hujjatida bo'lmagan, lekin shu sessiyada qo'shilgan funksiya: foydalanuvchi
> Telegram AI chat'i (Sprint 3.2) uchun shaxsiy kontekst kiritadi.

- [x] `app/(app)/knowledge/page.tsx` + `components/knowledge/knowledge-client.tsx` — ikkita textarea (bilim bazasi, agent instruksiyalari), har foydalanuvchiga alohida, real bazaga saqlanadi
- [x] `lib/actions/profile.ts` — `getProfile`/`updateKnowledgeBase`/`updateAgentInstructions` server action'lar, `auth()` orqali userId izolyatsiyasi
- [x] `components/ui/textarea.tsx` — yangi UI komponent
- [x] Sidebar'ga "Bilim bazasi" nav bandi qo'shildi

---

### Tekshirish (sprint oxirida)
1. `npm run dev` → `/login` → Telegram orqali kirish (deep-link + allowlist username)
2. `/goals` da 1–2 maqsad qo'shish
3. `/day` da bugungi kunni yozish + vazifa belgilash
4. Dashboard'da "Reja generatsiya" → ertangi tasklar va AI tahlili paydo bo'lishi
5. Til va tema almashishini tekshirish

### Keyingi sprintga o'tish sharti
AI reja sikli (maqsad → kun → tahlil → ertangi reja) web'da to'liq ishlasa → **Sprint 3**.

---

## 📋 Hisobot (avtomatik)
- **Sana:** 2026-07-15
- **Tayyorlik:** 46% (done + 0.4×partial)
- **So'nggi bajarilgan ishlar:** Login oqimi to'liq ishga tushdi — Telegram asosiy kirish usuli bo'ldi (`auth.ts` Credentials provider, JWT sessiya, `telegramLoginTokens` jadvali, `/login` deep-link UI), himoyalangan layout (`app/(app)/layout.tsx`) va sign-out qo'shildi; `lib/db/demo-user.ts` butunlay olib tashlandi, barcha sahifalar/action'lar real `auth()` sessiyasidan foydalanadi; yangi Bilim bazasi sahifasi (`/knowledge`) qo'shildi.
- **Keyingi qadam:** `/tasks` va `/day` sahifalarini real server action'lar (`createTask`, `saveDailyLog`) orqali bazaga ulash; "Reja generatsiya" tugmasini UI'ga qo'shib Gemini oqimini birinchi marta chaqirish.
