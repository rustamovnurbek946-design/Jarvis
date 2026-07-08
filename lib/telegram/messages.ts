type Locale = "uz" | "ru" | "en";

type BotStrings = {
  start: string;
  linkPrompt: string;
  linked: string;
  linkInvalid: string;
  notLinked: string;
  todayTitle: string;
  noTasks: string;
  planning: string;
  planDone: string;
  logSaved: string;
  eveningPrompt: string;
  markedDone: string;
};

const STRINGS: Record<Locale, BotStrings> = {
  uz: {
    start:
      "Assalomu alaykum! Men Jarvis — shaxsiy AI assistentingizman. 🤖\n\nHisobni bog'lash uchun web ilovadagi Sozlamalar > Telegram bo'limidan kodni oling va shu yerga yuboring.",
    linkPrompt: "Iltimos, web ilovadagi bog'lash kodini yuboring.",
    linked:
      "✅ Hisob bog'landi! Endi:\n/today — bugungi reja\n/plan — ertangi rejani generatsiya qilish\nShunchaki yozsangiz — kun kundaligingizga qo'shiladi.",
    linkInvalid: "❌ Kod noto'g'ri yoki eskirgan. Web ilovadan yangi kod oling.",
    notLinked:
      "Hisob hali bog'lanmagan. Web ilovadagi kodni yuboring yoki /start bosing.",
    todayTitle: "📋 Bugungi reja:",
    noTasks: "Bugun uchun vazifa yo'q. /plan bilan reja generatsiya qiling.",
    planning: "⏳ Kuningiz tahlil qilinmoqda va ertangi reja tuzilmoqda...",
    planDone: "✅ Ertangi reja tayyor! /today bilan ko'ring (ertangi kunni).",
    logSaved: "📝 Kun kundaligingizga qo'shildi.",
    eveningPrompt:
      "🌙 Bugun qanday o'tdi? Nimalar qildingiz, qanday his qildingiz? Menga yozing — men tahlil qilaman.",
    markedDone: "✅ Bajarildi deb belgilandi!",
  },
  ru: {
    start:
      "Здравствуйте! Я Jarvis — ваш личный AI-ассистент. 🤖\n\nЧтобы привязать аккаунт, получите код в веб-приложении (Настройки > Telegram) и отправьте его сюда.",
    linkPrompt: "Пожалуйста, отправьте код привязки из веб-приложения.",
    linked:
      "✅ Аккаунт привязан! Теперь:\n/today — план на сегодня\n/plan — сгенерировать план на завтра\nПросто напишите — добавлю в дневник дня.",
    linkInvalid: "❌ Неверный или устаревший код. Получите новый в приложении.",
    notLinked:
      "Аккаунт ещё не привязан. Отправьте код из приложения или нажмите /start.",
    todayTitle: "📋 План на сегодня:",
    noTasks: "На сегодня задач нет. Сгенерируйте план командой /plan.",
    planning: "⏳ Анализирую ваш день и составляю план на завтра...",
    planDone: "✅ План на завтра готов! Смотрите через /today (на завтра).",
    logSaved: "📝 Добавлено в дневник дня.",
    eveningPrompt:
      "🌙 Как прошёл день? Что сделали, как себя чувствовали? Напишите — я проанализирую.",
    markedDone: "✅ Отмечено как выполнено!",
  },
  en: {
    start:
      "Hello! I'm Jarvis — your personal AI assistant. 🤖\n\nTo link your account, get the code from the web app (Settings > Telegram) and send it here.",
    linkPrompt: "Please send the link code from the web app.",
    linked:
      "✅ Account linked! Now:\n/today — today's plan\n/plan — generate tomorrow's plan\nJust type — it goes to your daily journal.",
    linkInvalid: "❌ Invalid or expired code. Get a new one in the app.",
    notLinked:
      "Account not linked yet. Send the code from the app or press /start.",
    todayTitle: "📋 Today's plan:",
    noTasks: "No tasks for today. Generate a plan with /plan.",
    planning: "⏳ Analyzing your day and building tomorrow's plan...",
    planDone: "✅ Tomorrow's plan is ready! View it via /today (for tomorrow).",
    logSaved: "📝 Added to your daily journal.",
    eveningPrompt:
      "🌙 How was your day? What did you do, how did you feel? Write to me — I'll analyze it.",
    markedDone: "✅ Marked as done!",
  },
};

export function botT(locale: Locale): BotStrings {
  return STRINGS[locale] ?? STRINGS.uz;
}
