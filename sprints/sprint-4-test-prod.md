# Sprint 4 — Testlash va prodga chiqarish

**Maqsad:** Ilovani sinovdan o'tkazish, sayqallash va Vercelga (production)
chiqarish. Ikkala foydalanuvchi (siz + otangiz) real foydalanishga tayyor bo'lsin.

**Natija (Definition of Done):** Barcha asosiy oqimlar xatosiz ishlaydi; 3 til va
tema to'g'ri; ilova Vercelda ishlaydi; webhook va cron prod'da faol; ikkala
foydalanuvchi kirib, real maqsad/kun kiritib, reja olishi mumkin.

---

## 4.1 Sifat va testlash

- [ ] **End-to-end qo'lda test** (har til uchun): login → maqsad → kun → reja → tahlil
- [ ] Telegram oqimi testi: bog'lash, /today, ✓, /plan, erkin matn
- [ ] Calendar testi: event yozish/o'qish, to'qnashuvni chetlab o'tish
- [ ] Cron testi: evening / nightly / weekly qo'lda va rejaga ko'ra
- [ ] Ikki foydalanuvchi izolyatsiyasi: A ning ma'lumoti B ga ko'rinmasligi (userId bo'yicha)
- [ ] Birlik testlari (asosiy mantiq): `lib/date.ts` (timezone, hafta oralig'i), Zod sxema validatsiyasi
- [ ] Chet holatlar: maqsad yo'q, log yo'q, Calendar ulanmagan, Telegram bog'lanmagan
- [ ] Gemini xatosi/limit holatida chiroyli xato ko'rsatish (retry/fallback)

## 4.2 Sayqallash (Polish)

- [ ] Barcha bo'sh holatlar (empty states) va yuklanish (skeleton) ko'rinishlari
- [ ] Xatolik xabarlari (toast) 3 tilda
- [ ] Mobil moslashuv (responsive) barcha ekranlarda
- [ ] Och/qorong'i rejim barcha komponentlarda tekshirilgan
- [ ] **Statistika:** oddiy grafiklar (kunlik bajarilish trendi, maqsad progressi) — `recharts` yoki shadcn chart
- [ ] Ish faoliyati (performance): sahifa yuklanishi, Server Component'lardan foydalanish
- [ ] Foydalanish qulayligi (a11y): fokus, kontrast, klaviatura

## 4.3 Muhit va maxfiylik

- [ ] Barcha `.env` o'zgaruvchilari hujjatlangan (`.env.example` bilan mos)
- [ ] Maxfiy kalitlar repо'ga tushmaganini tekshirish (`.gitignore`)
- [ ] Neon: production bazasi (dev'dan alohida) + migratsiya qo'llash
- [ ] Rate limiting / abuse himoyasi (cron va webhook route'lar uchun)

## 4.4 Deploy (Vercel)

- [ ] GitHub repo yaratish va push
- [ ] Vercel loyihasiga ulash (`vercel link` yoki dashboard)
- [ ] Vercel env'ga barcha o'zgaruvchilarni qo'shish (`DATABASE_URL`, `AUTH_*`, `GEMINI_API_KEY`, `TELEGRAM_*`, `CRON_SECRET`, `ALLOWED_EMAILS`, `NEXT_PUBLIC_APP_URL`)
- [ ] Google OAuth redirect URI'ga prod domenni qo'shish
- [ ] Production deploy (`vercel --prod` yoki git push)
- [ ] Telegram webhook'ni prod URL'ga o'rnatish (`setWebhook`)
- [ ] Vercel Cron'lar faolligini tekshirish (Dashboard > Cron)

## 4.5 Ishga tushirishdan keyin

- [ ] Ikkala foydalanuvchini (siz + otangiz) kiritish (allowlist email)
- [ ] Har biri Google Calendar va Telegram'ni bog'lashi
- [ ] Real yillik/kvartal maqsadlarni kiritish
- [ ] Bir necha kun sinov: kechki so'rov → generatsiya → ertangi reja oqimi
- [ ] Kuzatuv (logs/monitoring) va dastlabki fikr-mulohaza yig'ish

---

### Yakuniy tekshirish
- Prod URL'da login ishlaydi (2 foydalanuvchi)
- Reja sikli real ishlaydi (Gemini + Calendar + Telegram)
- Cron'lar avtomatik ishlaydi
- 3 til + och/qorong'i rejim to'g'ri

### Loyiha yakuni
Ushbu sprint tugagach, "Jarvis" ishlab turgan mahsulot — kelgusi
takomillashtirishlar (odatlar, boyroq statistika, mobil ilova) alohida
rejalashtirilishi mumkin.

---

## 📋 Hisobot (avtomatik)
- **Sana:** 2026-07-08
- **Tayyorlik:** 0% (done + 0.4×partial)
- **So'nggi bajarilgan ishlar:** Hali boshlanmagan — Sprint 1/2 asosiy funksionallik tugamaguncha testlash/deploy bosqichi navbatga qo'yiladi.
- **Keyingi qadam:** Sprint 2 va 3 asosiy oqimlari (Auth, AI reja, Calendar, Telegram) tugagach E2E testlashni boshlash.

