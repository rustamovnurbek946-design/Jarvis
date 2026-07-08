/**
 * Placeholder content for the AI summary page, carried over from the
 * Claude Design prototype. Sprint 2 replaces this with a real weekly
 * summary from lib/ai/weeklySummary.ts.
 */
import type { LucideIcon } from "lucide-react";
import { Target, CheckSquare, TrendingUp, Flame } from "lucide-react";

export interface AiStat {
  icon: LucideIcon;
  label: string;
  value: string;
  delta: string;
}

export const AI_STATS: AiStat[] = [
  { icon: Target, label: "Faol maqsadlar", value: "3", delta: "4 tadan" },
  { icon: CheckSquare, label: "Bajarilgan vazifalar", value: "18", delta: "shu hafta" },
  { icon: TrendingUp, label: "Haftalik progress", value: "64%", delta: "+9% o'tgan haftaga nisbatan" },
  { icon: Flame, label: "Ketma-ketlik (streak)", value: "12 kun", delta: "uzluksiz faollik" },
];

export const WEEKLY_RANGE_LABEL = "29-iyun — 3-iyul, 2026";

export const WEEKLY_SUMMARY_PARAGRAPHS = [
  `Bu hafta juda samarali o'tdi — 4 ta maqsaddan 3 tasi bo'yicha barqaror harakat kuzatildi. Ayniqsa "Ingliz tilini B2 darajaga yetkazish" maqsadida progress 8 foizga oshdi, bu esa so'nggi to'rt haftadagi eng yaxshi natija. Kunlik vazifalarning 75% o'z vaqtida bajarildi va 12 kunlik faollik ketma-ketligi saqlanib qolmoqda.`,
  `"Marafonga tayyorgarlik" maqsadida esa sekinlashish sezildi — bu hafta rejalashtirilgan 4 ta yugurishdan atigi 2 tasi bajarildi. Interval mashg'ulotlarni dam olish kunlariga ko'chirish yuklamani yengillashtirishi mumkin.`,
  `Tavsiya: kelgusi hafta uchun eng yuqori muhimlikdagi 3 ta vazifani hafta boshida rejalashtiring — statistikaga ko'ra, dushanba-seshanba kunlari bajarilgan vazifalar bekor qilinish ehtimoli eng past. Shuningdek, "Har oy kitob o'qish" maqsadi muddatga nisbatan orqada qolmoqda — kuniga 15 daqiqa qo'shimcha vaqt ajratish yetarli bo'ladi.`,
];

export const DAY_TIPS = [
  "Ertaga birinchi bo'lib \"Interval yugurish\" vazifasini bajaring — ertalabki soatlarda energiya darajasi eng yuqori bo'ladi.",
  "Ingliz tili mashqlarini kechqurun emas, tushdan keyin rejalashtiring — bugungi natijalarga ko'ra bajarilish ehtimoli shu vaqtda yuqoriroq.",
  "Kitob o'qish vazifasini 15 daqiqaga qisqartirib, uni har kuni takrorlang — kichik va barqaror qadamlar streakni saqlab qoladi.",
];
