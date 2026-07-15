type Locale = "uz" | "ru" | "en";

type BotStrings = {
  start: string;
  loginApproved: string;
  loginNotAllowed: string;
  loginExpired: string;
  notLinked: string;
  todayTitle: string;
  noTasks: string;
  planning: string;
  planDone: string;
  logSaved: string;
  kunUsage: string;
  eveningPrompt: string;
  markedDone: string;
  chatError: string;
  openAppButton: string;
  openAppMessage: string;
};

const STRINGS: Record<Locale, BotStrings> = {
  uz: {
    start:
      "Assalomu alaykum! Men Jarvis — shaxsiy AI assistentingizman. 🤖\n\nWeb ilovaga kirish uchun saytdagi \"Telegram orqali kirish\" tugmasini bosing.",
    loginApproved:
      "✅ Muvaffaqiyatli tasdiqlandi! Brauzeringizga qaytishingiz mumkin — avtomatik kirasiz.\n\nEndi:\n/today — bugungi reja\n/plan — ertangi rejani generatsiya qilish\n/kun <matn> — kun kundaligiga yozish\nOddiy savol yozsangiz — men Gemini orqali javob beraman.",
    loginNotAllowed: "⛔️ Kechirasiz, sizga bu botdan foydalanishga ruxsat yo'q.",
    loginExpired:
      "❌ Kirish havolasi eskirgan yoki ishlatilgan. Web ilovadan qaytadan urinib ko'ring.",
    notLinked:
      "Hisobingiz hali bog'lanmagan. Web ilovadagi \"Telegram orqali kirish\" tugmasidan foydalaning.",
    todayTitle: "📋 Bugungi reja:",
    noTasks: "Bugun uchun vazifa yo'q. /plan bilan reja generatsiya qiling.",
    planning: "⏳ Kuningiz tahlil qilinmoqda va ertangi reja tuzilmoqda...",
    planDone: "✅ Ertangi reja tayyor! /today bilan ko'ring (ertangi kunni).",
    logSaved: "📝 Kun kundaligingizga qo'shildi.",
    kunUsage: "Foydalanish: /kun bugun sport qildim, charchadim",
    eveningPrompt:
      "🌙 Bugun qanday o'tdi? /kun buyrug'i bilan yozing, masalan: /kun bugun rejani bajardim.",
    markedDone: "✅ Bajarildi deb belgilandi!",
    chatError: "⚠️ Javob berishda xatolik yuz berdi. Birozdan keyin qayta urinib ko'ring.",
    openAppButton: "📱 Ilovani ochish",
    openAppMessage: "Ilovani to'g'ridan-to'g'ri shu yerda ochish uchun tugmani bosing:",
  },
  ru: {
    start:
      "Здравствуйте! Я Jarvis — ваш личный AI-ассистент. 🤖\n\nЧтобы войти в веб-приложение, нажмите кнопку «Войти через Telegram» на сайте.",
    loginApproved:
      "✅ Подтверждено! Можете вернуться в браузер — вход произойдёт автоматически.\n\nТеперь:\n/today — план на сегодня\n/plan — сгенерировать план на завтра\n/kun <текст> — запись в дневник дня\nПростой вопрос — отвечу через Gemini.",
    loginNotAllowed: "⛔️ Извините, у вас нет доступа к этому боту.",
    loginExpired:
      "❌ Ссылка для входа устарела или уже использована. Попробуйте снова из веб-приложения.",
    notLinked:
      "Аккаунт ещё не привязан. Используйте кнопку «Войти через Telegram» в веб-приложении.",
    todayTitle: "📋 План на сегодня:",
    noTasks: "На сегодня задач нет. Сгенерируйте план командой /plan.",
    planning: "⏳ Анализирую ваш день и составляю план на завтра...",
    planDone: "✅ План на завтра готов! Смотрите через /today (на завтра).",
    logSaved: "📝 Добавлено в дневник дня.",
    kunUsage: "Использование: /kun сегодня выполнил план, устал",
    eveningPrompt: "🌙 Как прошёл день? Напишите через /kun, например: /kun выполнил план.",
    markedDone: "✅ Отмечено как выполнено!",
    chatError: "⚠️ Ошибка при ответе. Попробуйте ещё раз чуть позже.",
    openAppButton: "📱 Открыть приложение",
    openAppMessage: "Нажмите кнопку, чтобы открыть приложение прямо здесь:",
  },
  en: {
    start:
      "Hello! I'm Jarvis — your personal AI assistant. 🤖\n\nTo log into the web app, press \"Log in with Telegram\" on the site.",
    loginApproved:
      "✅ Confirmed! You can go back to your browser — you'll be logged in automatically.\n\nNow:\n/today — today's plan\n/plan — generate tomorrow's plan\n/kun <text> — daily journal entry\nJust ask a question — I'll answer via Gemini.",
    loginNotAllowed: "⛔️ Sorry, you're not allowed to use this bot.",
    loginExpired: "❌ The login link expired or was already used. Try again from the web app.",
    notLinked: 'Account not linked yet. Use the "Log in with Telegram" button in the web app.',
    todayTitle: "📋 Today's plan:",
    noTasks: "No tasks for today. Generate a plan with /plan.",
    planning: "⏳ Analyzing your day and building tomorrow's plan...",
    planDone: "✅ Tomorrow's plan is ready! View it via /today (for tomorrow).",
    logSaved: "📝 Added to your daily journal.",
    kunUsage: "Usage: /kun did my workout today, feeling tired",
    eveningPrompt: "🌙 How was your day? Write it with /kun, e.g.: /kun finished my plan.",
    markedDone: "✅ Marked as done!",
    chatError: "⚠️ Something went wrong answering that. Please try again shortly.",
    openAppButton: "📱 Open app",
    openAppMessage: "Tap the button to open the app right here:",
  },
};

export function botT(locale: Locale): BotStrings {
  return STRINGS[locale] ?? STRINGS.uz;
}
