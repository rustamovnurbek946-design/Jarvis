# Sprintlar — Shaxsiy AI Assistent ("Jarvis")

Bu papka PRD (`.claude/plans/men-shxsiy-assitent-shimmering-taco.md`) ni
4 ta bajariladigan sprintga ajratadi. Har bir sprint alohida fayl —
ichida batafsil vazifalar ro'yxati (checklist) va "tayyor" mezoni bor.

| # | Sprint | Fayl | Maqsad |
|---|--------|------|--------|
| 1 | Ekran dizaynlari | [sprint-1-ekran-dizayn.md](sprint-1-ekran-dizayn.md) | Barcha ekranlar dizayni va dizayn tizimi |
| 2 | MVP (dizayn bo'yicha) | [sprint-2-mvp-tayyorlash.md](sprint-2-mvp-tayyorlash.md) | Maqsad + reja yadrosi, AI generatsiya |
| 3 | Calendar + Telegram | [sprint-3-calendar-telegram.md](sprint-3-calendar-telegram.md) | Google Calendar, Telegram bot, cron |
| 4 | Test + Prod | [sprint-4-test-prod.md](sprint-4-test-prod.md) | Testlash, sayqallash, Vercelga chiqarish |
| 5 | Ovozli maqsad | [sprint-5-ovozli-maqsad.md](sprint-5-ovozli-maqsad.md) | Telegram ovozli xabar → Gemini audio → maqsad qo'shish |

## Asosiy qarorlar (intervyudan)

- **Foydalanuvchilar:** 2 ta (siz + otangiz), email allowlist
- **Maqsad tuzilishi:** Yillik + Kvartal (soha teg sifatida)
- **Kunlik kirish:** vazifalarni ✓ belgilash + erkin matn
- **Reja:** aralash (muhimlar vaqtli, qolgani ustuvor ro'yxat)
- **AI generatsiya:** har kecha, ertangi kun uchun
- **AI fokusi:** maqsadga muvofiqlik, produktivlik, balans, motivatsiya
- **Telegram:** to'liq interaktiv
- **Kalendar:** Google Calendar, ikki tomonlama
- **AI:** Google Gemini API
- **Til:** o'zbek / rus / ingliz
- **Eslatmalar:** kechki so'rov + haftalik xulosa
- **Dizayn:** zamonaviy minimalist
- **Timezone:** Asia/Tashkent

## Texnik stek

Next.js 16 (App Router, TS) · Tailwind + shadcn/ui · Drizzle ORM + Neon Postgres ·
Auth.js (Google OAuth) · Vercel AI SDK + `@ai-sdk/google` · grammY (Telegram) ·
next-intl (i18n) · Vercel Cron · Vercelda deploy.

## Loyiha joylashuvi

`C:\Users\Nurbek\Projects\jarvis` (OneDrive tashqarisida — install/dev tez ishlashi uchun).

## Holat belgilari

- `[ ]` — bajarilmagan
- `[~]` — qisman (skelet mavjud)
- `[x]` — bajarilgan

> Eslatma: Sprint 2–3 ning ba'zi backend skeletlari (DB sxema, auth, AI modul,
> Telegram bot, cron route'lar) allaqachon yaratilgan — tegishli joylarda `[~]` bilan belgilangan.
