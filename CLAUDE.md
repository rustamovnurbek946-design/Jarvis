# CLAUDE.md — "Jarvis" shaxsiy AI assistent

Bu fayl loyihaning yagona haqiqat manbai (single source of truth). `sprint-reporter`
agenti har hisobotda **"Qabul qilingan qarorlar"** bo'limini yangilab boradi.

## Loyiha maqsadi

Yillik va kvartal maqsadlardan kelib chiqib kunlik ish vazifalari va grafigini
avtomatik tashkillaydigan AI assistent. Har kecha foydalanuvchi kunini kiritadi,
AI tahlil qilib ertangi kun rejasini yaratadi. Google Calendar bilan ikki
tomonlama sinxron, to'liq interaktiv Telegram bot.

## Foydalanuvchilar va mahsulot qarorlari

- **Foydalanuvchilar:** 2 ta (Nurbek + otasi), email allowlist bilan cheklangan
- **Maqsad tuzilishi:** Yillik + Kvartal (soha "domain" teg sifatida, ierarxiyasiz)
- **Kunlik kirish:** vazifalarni ✓ belgilash + erkin matn (ikkalasi)
- **Reja:** aralash — muhimlar vaqtli (time-block), qolgani ustuvor ro'yxat
- **AI generatsiya:** har kecha, ertangi kun uchun
- **AI fokusi:** maqsadga muvofiqlik, produktivlik, balans/charchoq, motivatsiya
- **Til:** o'zbek / rus / ingliz (almashtiriladi)
- **Eslatmalar:** kechki so'rov + haftalik xulosa (Telegram)
- **Odatlar (habits):** MVP da YO'Q
- **Timezone:** Asia/Tashkent (UTC+5)

## Texnik stek

- Next.js 16 (App Router, TS) · Tailwind + shadcn/ui · dark/light
- Drizzle ORM + **Neon** Postgres (Vercel Postgres endi yo'q)
- Auth.js (NextAuth v5) — Google OAuth (login + Calendar scope)
- Vercel AI SDK + `@ai-sdk/google` (**Gemini**), structured output = Zod
- **grammY** (Telegram, webhook rejimi)
- **next-intl** (i18n, cookie `NEXT_LOCALE`, URL-prefixsiz)
- Vercel Cron (evening / nightly / weekly)

## Muhim joylashuvlar (o'qib chiqish shart)

- **Loyiha:** `C:\Users\Nurbek\OneDrive\Desktop\Jarvis with claude`
- **node_modules:** OneDrive ichida EMAS. U **junction** orqali
  `C:\Users\Nurbek\AppData\Local\jarvis-node_modules` ga bog'langan.
  Sabab: OneDrive `node_modules` (30k+ fayl) o'rnatilishini qotirib qo'yadi.
  Yangi mashinada: node_modules'ni o'chirib, junction yaratib, keyin
  `npm install` qilinadi (aks holda install OneDrive ichida osilib qoladi).

## Kod konvensiyalari

- Sahifalar `app/` da; umumiy mantiq `lib/` da; import alias `@/*`
- Har so'rovda foydalanuvchi ma'lumoti qat'iy `userId` bo'yicha izolyatsiya
- AI chaqiruvlari `lib/ai/` da (gemini.ts, schemas.ts, prompts.ts, generatePlan.ts)
- Sana/vaqt: `lib/date.ts` (Asia/Tashkent), Vercel cron UTC da (vercel.json)
- Matnlar hardcode qilinmaydi — `messages/uz|ru|en.json`

## Muhit o'zgaruvchilari (.env.local / Vercel)

`DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`,
`ALLOWED_EMAILS`, `GEMINI_API_KEY` (+ ixtiyoriy `GEMINI_MODEL`),
`TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `CRON_SECRET`,
`NEXT_PUBLIC_APP_URL`. Namuna: `.env.example`.

## Ish jarayoni (sprintlar va hisobot)

- Reja: `.claude/plans/men-shxsiy-assitent-shimmering-taco.md`
- Sprintlar: `sprints/` (1: dizayn, 2: MVP, 3: Calendar+Telegram, 4: test+prod)
- Holat paneli: `dashboard.html`
- **Hisobotchi agent:** `.claude/agents/sprint-reporter.md`. Sprint vazifasi
  tugagach yoki `git push` dan oldin ishlaydi; sprint fayllari, ushbu CLAUDE.md
  va dashboard.html ni sinxronlaydi. `git push` **pre-push hook** bilan
  himoyalangan (`.claude/hooks/pre-push-guard.mjs`) — yangi hisobotsiz push
  bloklanadi.

---

## Qabul qilingan qarorlar (jurnal)

> `sprint-reporter` shu bo'limga yangi qarorlarni sana bilan qo'shadi.
> Format: `- [YYYY-MM-DD] qaror — sabab`

- [2026-07-01] Loyiha OneDrive'da qoladi, lekin `node_modules` junction orqali
  OneDrive tashqarisiga chiqarildi — OneDrive install'ni qotirib qo'ygani uchun.
- [2026-07-01] AI provayder sifatida Google **Gemini** tanlandi (foydalanuvchi qarori).
- [2026-07-01] Til yo'nalishi: URL-prefixsiz i18n, locale cookie'da saqlanadi —
  Telegram/cron route'lari va linklarni soddalashtirish uchun.
- [2026-07-01] Auth database-session strategiyasi + Drizzle adapter — Google
  Calendar tokenlarini `accounts` jadvalidan o'qish uchun.
- [2026-07-01] Sprintlar tartibi: 1) ekran dizayni, 2) MVP, 3) Calendar+Telegram,
  4) test+prod (foydalanuvchi belgilagan).
- [2026-07-08] Ekran dizaynlari Claude Design vositasi orqali tayyorlandi
  ("Goals Management App Design" loyihasi, handoff `design-handoff/`) — tezkor
  handoff (`_ds_bundle.js` + tokenlar) uchun Figma o'rniga tanlandi.
- [2026-07-08] Dizayn tokenlari (rang/shrift/spacing) handoff'dan aynan
  ko'chirilib qo'lda `app/tokens/*.css` fayllariga yozildi; `components/ui/`
  komponentlari ham shu bundle asosida qo'lda yaratildi — `npx shadcn init`
  ishlatilmadi (`components.json` yo'q), dizaynga bir xil moslikni ta'minlash
  uchun.
- [2026-07-08] Bosh sahifa (`/`) yagona "Dashboard" o'rniga Maqsadlar
  ro'yxatiga aylantirildi; funksionallik 4 sahifaga bo'lindi: `/` (Maqsadlar),
  `/tasks` (Vazifalar), `/ai` (AI xulosasi), `/day` (Kun tahlili) — dizayn
  handoffdagi ekranlarga mos kelishi uchun.
- [2026-07-08] Neon Postgres bazasi Vercel Marketplace integratsiyasi orqali
  ulandi (alohida neon.tech saytiga kirmasdan) — Vercel loyihasi ("jarvis",
  `prj_n1ljZFAGvFjBk90TiHexyusUISk5`) bilan bir joyda boshqarish uchun.
- [2026-07-08] Auth.js login UI hali ulanmagani sababli sahifalar vaqtinchalik
  `lib/db/demo-user.ts` (`getDemoUserId`) orqali bitta seed qilingan demo
  foydalanuvchi nomidan ishlaydi; real sessiya Sprint 2 davomida almashtiriladi.
