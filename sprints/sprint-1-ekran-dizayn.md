# Sprint 1 — Ekran dizaynlari

**Maqsad:** Ilovaning barcha ekranlari uchun dizayn tizimi va maketlarni (mockup)
tayyorlash. Kod yozishdan oldin har bir ekran qanday ko'rinishi, qanday
elementlardan iborat bo'lishini aniqlab olish. Zamonaviy minimalist uslub,
mobil-birinchi, och/qorong'i rejim.

**Natija (Definition of Done):** Har bir ekran uchun maket + dizayn tizimi
hujjati tayyor; komponentlar ro'yxati aniq; rangi, shrifti, bo'shliqlari
belgilangan. Sprint 2 shu dizayn asosida kod yozadi.

---

## 1.1 Dizayn tizimi (Design System)

- [~] **Rang palitrasi:** asosiy (primary), fon (background), matn, muvaffaqiyat/ogohlantirish/xato ranglari — och va qorong'i rejim uchun alohida — *faqat och (light) rejim tokenlari bor (`app/tokens/colors.css`), qorong'i (dark) rejim tokenlari hali yo'q*
- [x] **Tipografiya:** sarlavha/matn shriftlari, o'lchamlar shkalasi (h1–h4, body, caption) — `app/tokens/typography.css`, Inter shrifti `next/font` orqali ulangan
- [x] **Bo'shliq (spacing) tizimi:** 4/8px shkala, radius, soyalar (shadow) — `app/tokens/spacing.css`
- [x] **Ikonkalar to'plami:** `lucide-react` (real npm paket, `package.json`da) — ulangan va sahifalarda ishlatilmoqda
- [~] **Komponent inventari:** Button, Card, Input, Progress bar, Status tag yaratildi (`components/ui/`) — Textarea, Select, Dialog/Modal (alohida generik), Badge, Switch, Tabs, Checkbox, Avatar, Toast hali yo'q
- [ ] **Holat (state) dizaynlari:** bo'sh holat (empty), yuklanish (loading/skeleton), xato (error) — hech biri loyihada topilmadi
- [ ] **Til almashtirgich (language switcher)** ko'rinishi (uz/ru/en) — UI'da yo'q
- [ ] **Dark/Light toggle** ko'rinishi va joylashuvi — UI'da yo'q, tema almashtirish mexanizmi ulanmagan

## 1.2 Navigatsiya va layout

- [x] **Desktop:** chap tomonda sidebar — real `components/layout/sidebar.tsx` (Link + `usePathname`), 4 bo'lim: Maqsadlar, Vazifalar, AI xulosasi, Kun tahlili
- [ ] **Mobil:** pastki navigatsiya (bottom tab bar) yoki hamburger menyu — topilmadi, responsive/mobil variant hali ishlanmagan
- [ ] Yuqori panel (header): foydalanuvchi avatari, til/tema tugmalari, chiqish — alohida header komponenti yo'q (sidebar pastida statik foydalanuvchi bloki bor, lekin til/tema/chiqish tugmalari yo'q)
- [x] Umumiy sahifa karkasi (app shell) maketi — `app/layout.tsx`: sidebar + asosiy kontent maydoni barcha sahifalarda izchil

## 1.3 Ekran maketlari

> **Eslatma:** Claude Design handoff (`design-handoff/`) faqat Maqsadlar/Vazifalar/AI/Kun
> ekranlarini qamrab oldi. Login, Kalendar, Sozlamalar ekranlari hali dizayn
> bosqichida ham maketlanmagan.

### A) Login / Kirish ekrani
- [ ] Ilova logotipi + nomi ("Jarvis") + tagline
- [ ] "Google orqali davom etish" tugmasi
- [ ] Ruxsat yo'q holati (access denied) ko'rinishi

### B) Dashboard (Bosh sahifa) — eng muhim ekran
> **Qaror:** yagona "Dashboard" ekrani o'rniga funksionallik 4 alohida sahifaga
> bo'lindi — Maqsadlar (`/`), Vazifalar (`/tasks`), AI xulosasi (`/ai`), Kun
> tahlili (`/day`). Quyidagi original Dashboard bandlari shu holda bitta
> sahifada mavjud emas.
- [ ] Salomlashish + sana ("Salom, Nurbek! Bugun — 1-iyul")
- [ ] **Bugungi reja** bloki: ikki qism — "Vaqtli jadval" (time-block) va "Ustuvor vazifalar" (ro'yxat)
- [ ] Vazifa kartasi: ✓ checkbox, nomi, vaqti (agar bor bo'lsa), muhimlik belgisi, bog'langan maqsad tegi
- [ ] **Maqsadlar progressi** bloki: har maqsad progress-bar bilan
- [ ] **AI kunlik tahlil** kartasi: 4 fokus (maqsad/produktivlik/balans/motivatsiya) + ballar (0–10)
- [ ] "Ertangi rejani generatsiya qilish" tugmasi (holati: normal / yuklanmoqda)
- [ ] Tez vazifa qo'shish (quick add) inputi
- [ ] Bo'sh holat: "Bugun vazifa yo'q" ko'rinishi

### C) Maqsadlar (Goals)
- [ ] Yillik va kvartal maqsadlar ro'yxati (guruhlangan yoki filtrlangan) — hozir yagona tekis (flat) ro'yxat, guruhlash yo'q
- [~] Maqsad kartasi: nomi, soha tegi, tur (yillik/kvartal), yil/kvartal, progress, holat — kartada nomi/muddat/progress/holat bor, soha tegi va yillik/kvartal turi ko'rsatilmaydi
- [~] "Maqsad qo'shish" tugmasi → forma (modal): nomi, tavsif, tur, soha, yil, kvartal, bog'liq yillik maqsad, ko'rsatkich — modal ishlaydi, lekin faqat nomi/tavsif/muddat/progress maydonlari bor (tur, soha, yil, kvartal, bog'liq maqsad yo'q)
- [x] Tahrirlash / o'chirish amallari — ishlaydi (menyu → tahrirlash/o'chirish, real DB'ga yoziladi)
- [ ] Bo'sh holat: "Hali maqsad yo'q" — kod ichida topilmadi

### D) Kunim (My Day) — kun kiritish
> **Eslatma:** hozirgi `/day` sahifasi kun *kiritish* emas, balki statik "Kun
> tahlili" ko'rinishi (mock ma'lumot bilan) — quyidagi original bandlarga mos emas.
- [~] Bugungi vazifalar ro'yxati (✓ belgilash mumkin) — `/day`da bajarilgan/bajarilmagan ro'yxati ko'rsatiladi, lekin faqat o'qish uchun (mock, belgilab bo'lmaydi)
- [ ] "Bugun qanday o'tdi?" erkin matn maydoni (textarea) — yo'q
- [ ] "Kunni saqlash" tugmasi — yo'q
- [~] AI tahlili natijasi ko'rinishi (agar generatsiya qilingan bo'lsa) — statik/mock "tavsiya" kartasi bor, haqiqiy AI natijasi emas
- [ ] O'tgan kunlar tarixi (sana bo'yicha ro'yxat, bosilsa — o'sha kun tahlili) — yo'q

### E) Kalendar
- [ ] Haftalik ko'rinish: Google Calendar bandliklari + ilova vazifalari birga
- [ ] Vaqtli vazifalar va band vaqtlar farqlanadigan ranglar
- [ ] "Google Calendar ulanmagan" holati + ulash tugmasi

### F) Sozlamalar (Settings)
- [ ] Profil (ism, email, avatar)
- [ ] Til tanlash (uz/ru/en)
- [ ] Vaqt mintaqasi
- [ ] Telegram bog'lash: kod olish tugmasi + ko'rsatma
- [ ] Google Calendar holati: ulangan/ulanmagan + qayta ulash
- [ ] Tema (och/qorong'i)

## 1.4 Yakuniy tayyorgarlik

- [ ] Barcha ekranlarning mobil va desktop variantlari — faqat desktop qatlami qurilgan
- [ ] Dizayndan shadcn komponentlariga xaritalash (qaysi ekranda qaysi komponent) — **qaror:** shadcn CLI ishlatilmadi, komponentlar dizayn handoff bundle asosida qo'lda yozildi (`components/ui/`)
- [x] Rang va shrift qiymatlarini `globals.css` / theme tokenlariga o'tkazishga tayyor holatda hujjatlash — `app/tokens/{colors,typography,spacing}.css`, `app/globals.css` orqali ulangan

---

### Foydali vositalar
- shadcn/ui MCP orqali komponent qidirish va namunalar
- `ui-ux-pro-max` skill — UI/UX dizayn bo'yicha ko'mak
- (ixtiyoriy) Figma — maketlarni chizish uchun

### Keyingi sprintga o'tish sharti
Barcha 6 ekran maketi va dizayn tizimi tayyor bo'lsa → **Sprint 2**.

---

## 📋 Hisobot (avtomatik)
- **Sana:** 2026-07-08
- **Tayyorlik:** 21% (done + 0.4×partial)
- **So'nggi bajarilgan ishlar:** Claude Design'dan handoff olindi (Goals Management App Design — Indigo #4F46E5, Inter, 8px shkala); dizayn tokenlari (`app/tokens/*.css`) va 5 ta baza komponent (`components/ui/`) qo'lda kod qilindi; `lucide-react` ulandi; Maqsadlar/Vazifalar/AI/Kun sahifalari va real sidebar navigatsiyasi qurildi.
- **Keyingi qadam:** Dark rejim tokenlari va toggle qo'shish; Login/Kalendar/Sozlamalar ekranlari uchun maket yaratish; qolgan komponentlarni (Modal/Dialog umumiy, Select, Textarea, Toast, empty/loading holatlari) qo'shish.
