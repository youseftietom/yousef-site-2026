"use client";
import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
 
/* eslint-disable @typescript-eslint/no-explicit-any */
 
// ─────────────────────────────────────────────────────────────────────────────
// 🌍 خريطة دول العالم → عملة
// ─────────────────────────────────────────────────────────────────────────────
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  EG: "EGP", SA: "SAR", AE: "AED", KW: "KWD", QA: "QAR",
  OM: "OMR", BH: "BHD", JO: "JOD", LB: "LBP", IQ: "IQD",
  SY: "SYP", YE: "YER", LY: "LYD", TN: "TND", DZ: "DZD",
  MA: "MAD", SD: "SDG", SO: "SOS", KM: "KMF", DJ: "DJF",
  MR: "MRU", PS: "ILS",
  US: "USD", GB: "GBP",
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", PT: "EUR",
  NL: "EUR", BE: "EUR", AT: "EUR", GR: "EUR", FI: "EUR",
  IE: "EUR", LU: "EUR", MT: "EUR", CY: "EUR", SK: "EUR",
  SI: "EUR", EE: "EUR", LV: "EUR", LT: "EUR", HR: "EUR",
  ME: "EUR",
  CH: "CHF", NO: "NOK", SE: "SEK", DK: "DKK",
  PL: "PLN", CZ: "CZK", HU: "HUF", RO: "RON",
  BG: "BGN", RS: "RSD", UA: "UAH", RU: "RUB",
  TR: "TRY", IS: "ISK", AL: "ALL", MK: "MKD",
  BA: "BAM", MD: "MDL", GE: "GEL", AM: "AMD",
  AZ: "AZN", BY: "BYN",
  CN: "CNY", JP: "JPY", KR: "KRW", IN: "INR",
  PK: "PKR", BD: "BDT", LK: "LKR", NP: "NPR",
  AF: "AFN", IR: "IRR", IL: "ILS", KZ: "KZT",
  UZ: "UZS", TM: "TMT", TJ: "TJS", KG: "KGS",
  MN: "MNT", VN: "VND", TH: "THB", MY: "MYR",
  SG: "SGD", ID: "IDR", PH: "PHP", MM: "MMK",
  KH: "KHR", LA: "LAK", BN: "BND", TW: "TWD",
  HK: "HKD", MO: "MOP", TL: "USD", MV: "MVR", BT: "BTN",
  NG: "NGN", ZA: "ZAR", GH: "GHS", KE: "KES",
  ET: "ETB", TZ: "TZS", UG: "UGX", RW: "RWF",
  MZ: "MZN", ZM: "ZMW", AO: "AOA", CM: "XAF",
  SN: "XOF", CI: "XOF", BF: "XOF", ML: "XOF",
  NE: "XOF", TG: "XOF", BJ: "XOF", GA: "XAF",
  CG: "XAF", CD: "CDF", TD: "XAF", CF: "XAF",
  GQ: "XAF", BI: "BIF", MG: "MGA", MW: "MWK",
  NA: "NAD", BW: "BWP", LS: "LSL", SZ: "SZL",
  GM: "GMD", SL: "SLL", LR: "LRD", GN: "GNF",
  CV: "CVE", SC: "SCR", MU: "MUR", ST: "STN",
  CA: "CAD", MX: "MXN", BR: "BRL", AR: "ARS",
  CL: "CLP", CO: "COP", PE: "PEN", VE: "VES",
  BO: "BOB", PY: "PYG", UY: "UYU", EC: "USD",
  SR: "SRD", GY: "GYD", GT: "GTQ", HN: "HNL",
  SV: "USD", NI: "NIO", CR: "CRC", PA: "PAB",
  CU: "CUP", DO: "DOP", JM: "JMD", TT: "TTD",
  BB: "BBD", HT: "HTG", BS: "BSD", BZ: "BZD",
  AU: "AUD", NZ: "NZD", FJ: "FJD", PG: "PGK",
  WS: "WST", TO: "TOP", VU: "VUV", SB: "SBD",
};
 
const CURRENCY_LABELS: Record<string, Record<string, string>> = {
  EGP: { ar: "ج.م",  en: "EGP" }, SAR: { ar: "ر.س",  en: "SAR" },
  AED: { ar: "د.إ",  en: "AED" }, KWD: { ar: "د.ك",  en: "KWD" },
  QAR: { ar: "ر.ق",  en: "QAR" }, OMR: { ar: "ر.ع",  en: "OMR" },
  BHD: { ar: "د.ب",  en: "BHD" }, JOD: { ar: "د.أ",  en: "JOD" },
  IQD: { ar: "د.ع",  en: "IQD" }, LBP: { ar: "ل.ل",  en: "LBP" },
  MAD: { ar: "د.م",  en: "MAD" }, TND: { ar: "د.ت",  en: "TND" },
  DZD: { ar: "د.ج",  en: "DZD" }, LYD: { ar: "د.ل",  en: "LYD" },
  USD: { ar: "$",     en: "$"   }, EUR: { ar: "€",     en: "€"   },
  GBP: { ar: "£",     en: "£"   }, JPY: { ar: "¥",     en: "¥"   },
  CNY: { ar: "¥",     en: "¥"   }, INR: { ar: "₹",     en: "₹"   },
  CAD: { ar: "CA$",   en: "CA$" }, AUD: { ar: "A$",    en: "A$"  },
  CHF: { ar: "Fr",    en: "Fr"  }, KRW: { ar: "₩",     en: "₩"   },
  TRY: { ar: "₺",     en: "₺"   }, RUB: { ar: "₽",     en: "₽"   },
  BRL: { ar: "R$",    en: "R$"  }, MXN: { ar: "MX$",   en: "MX$" },
  SEK: { ar: "kr",    en: "kr"  }, NOK: { ar: "kr",    en: "kr"  },
  DKK: { ar: "kr",    en: "kr"  }, PLN: { ar: "zł",    en: "zł"  },
  THB: { ar: "฿",     en: "฿"   }, SGD: { ar: "S$",    en: "S$"  },
  HKD: { ar: "HK$",  en: "HK$" }, MYR: { ar: "RM",    en: "RM"  },
  IDR: { ar: "Rp",    en: "Rp"  }, PHP: { ar: "₱",     en: "₱"   },
  NGN: { ar: "₦",     en: "₦"   }, ZAR: { ar: "R",     en: "R"   },
  PKR: { ar: "₨",     en: "₨"   }, ILS: { ar: "₪",     en: "₪"   },
};
 
// ─────────────────────────────────────────────────────────────────────────────
// 🔑 MODULE-LEVEL — الجوهر الحقيقي للحل
//
// المشكلة كانت:
//   React Strict Mode / Next.js hydration بيعمل mount → unmount → mount
//   الـ mount الأول يعمل fetch → يبدأ يجي البيانات → cleanup يحصل (cancelled=true)
//   → الـ fetch يخلص لكن setState اتمنع → بيعرض العملة الأساسية
//   → لكن sessionStorage اتحفظ → الـ mount التاني لاقي الكاش وشغّل صح
//
// الحل:
//   كل instance بيستخدم نفس الـ promise بدل ما يعمل fetch جديد
//   → لو الـ mount الأول فتح promise، الـ mount التاني بيـ await نفسه
//   → لما يخلص، كلاهم بيتحدثوا
// ─────────────────────────────────────────────────────────────────────────────
type RatesMap = Record<string, number>;
 
let _geoPromise: Promise<string | null> | null = null;
let _ratesPromise: Promise<RatesMap | null> | null = null;
let _ratesMemCache: { rates: RatesMap; ts: number } | null = null;
const RATES_TTL = 60 * 60 * 1000; // ساعة
 
// ─── GEO ─────────────────────────────────────────────────────────────────────
async function _detectCurrency(): Promise<string | null> {
  try {
    const cached = sessionStorage.getItem("dp_user_currency");
    if (cached) return cached;
  } catch { /* ignore */ }
 
  const providers: Array<() => Promise<string>> = [
    async () => {
      const r = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(4000) });
      const d = await r.json();
      if (!d.country_code) throw new Error();
      return d.country_code as string;
    },
    async () => {
      const r = await fetch("https://freeipapi.com/api/json", { signal: AbortSignal.timeout(4000) });
      const d = await r.json();
      if (!d.countryCode) throw new Error();
      return d.countryCode as string;
    },
    async () => {
      const r = await fetch("https://api.country.is/", { signal: AbortSignal.timeout(4000) });
      const d = await r.json();
      if (!d.country) throw new Error();
      return d.country as string;
    },
  ];
 
  let countryCode: string | null = null;
  for (const p of providers) {
    try { countryCode = await p(); break; } catch { /* try next */ }
  }
 
  if (!countryCode) return null;
  const currency = COUNTRY_TO_CURRENCY[countryCode] ?? "USD";
  try { sessionStorage.setItem("dp_user_currency", currency); } catch { /* ignore */ }
  return currency;
}
 
// ─── RATES ────────────────────────────────────────────────────────────────────
async function _fetchRates(): Promise<RatesMap | null> {
  if (_ratesMemCache && Date.now() - _ratesMemCache.ts < RATES_TTL)
    return _ratesMemCache.rates;
 
  try {
    const raw = sessionStorage.getItem("dp_rates_cache");
    if (raw) {
      const { ts, rates } = JSON.parse(raw) as { ts: number; rates: RatesMap };
      if (Date.now() - ts < RATES_TTL) {
        _ratesMemCache = { rates, ts };
        return rates;
      }
    }
  } catch { /* ignore */ }
 
  const providers: Array<() => Promise<RatesMap>> = [
    async () => {
      const r = await fetch(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
        { signal: AbortSignal.timeout(6000) }
      );
      const d = await r.json();
      if (!d?.usd) throw new Error();
      return d.usd as RatesMap;
    },
    async () => {
      const r = await fetch("https://open.er-api.com/v6/latest/USD", {
        signal: AbortSignal.timeout(6000),
      });
      const d = await r.json();
      if (!d?.rates) throw new Error();
      return Object.fromEntries(
        Object.entries(d.rates as Record<string, number>).map(([k, v]) => [k.toLowerCase(), v])
      );
    },
    async () => {
      const r = await fetch("https://api.frankfurter.app/latest?from=USD", {
        signal: AbortSignal.timeout(6000),
      });
      const d = await r.json();
      if (!d?.rates) throw new Error();
      return Object.fromEntries(
        Object.entries({ usd: 1, ...d.rates } as Record<string, number>).map(([k, v]) => [
          k.toLowerCase(), v,
        ])
      );
    },
  ];
 
  let rates: RatesMap | null = null;
  for (const p of providers) {
    try { rates = await p(); break; } catch { /* try next */ }
  }
 
  if (rates) {
    _ratesMemCache = { rates, ts: Date.now() };
    try {
      sessionStorage.setItem("dp_rates_cache", JSON.stringify({ ts: Date.now(), rates }));
    } catch { /* ignore */ }
  }
 
  return rates;
}
 
// ─── getOrCreate promises (الحل الحقيقي) ────────────────────────────────────
function getGeoPromise(): Promise<string | null> {
  if (!_geoPromise) {
    _geoPromise = _detectCurrency().catch(() => null);
  }
  return _geoPromise;
}
 
function getRatesPromise(): Promise<RatesMap | null> {
  if (_ratesMemCache && Date.now() - _ratesMemCache.ts < RATES_TTL)
    return Promise.resolve(_ratesMemCache.rates);
 
  if (!_ratesPromise) {
    _ratesPromise = _fetchRates().finally(() => { _ratesPromise = null; });
  }
  return _ratesPromise;
}
 
// ─────────────────────────────────────────────────────────────────────────────
// 🧩 Component
// ─────────────────────────────────────────────────────────────────────────────
export default function DynamicPrice({ amount, fallbackPrice, settings }: any) {
  const locale = useLocale();
  const enableDynamic = settings?.enableDynamicPricing === true;
  const baseCurrency  = (settings?.baseCurrency || "EGP").toUpperCase();
 
  const [finalAmount,         setFinalAmount]         = useState<number | null>(null);
  const [displayCurrencyCode, setDisplayCurrencyCode] = useState(baseCurrency);
  const [isLoading,           setIsLoading]           = useState(true);
 
  useEffect(() => {
    if (!enableDynamic || !amount) {
      setFinalAmount(Number(amount) || null);
      setDisplayCurrencyCode(baseCurrency);
      setIsLoading(false);
      return;
    }
 
    let cancelled = false;
 
    async function run() {
      try {
        // الـ GEO والـ rates بيشتغلوا بالتوازي — أسرع بكتير
        // وكلاهما بيشتركوا في نفس الـ promise لو في remount
        const [userCurrency, rates] = await Promise.all([
          getGeoPromise(),
          getRatesPromise(),
        ]);
 
        if (cancelled) return;
 
        const resolvedCurrency = userCurrency ?? baseCurrency;
 
        if (resolvedCurrency === baseCurrency || !rates) {
          setFinalAmount(Number(amount));
          setDisplayCurrencyCode(baseCurrency);
          setIsLoading(false);
          return;
        }
 
        const baseRate = rates[baseCurrency.toLowerCase()];
        const userRate = rates[resolvedCurrency.toLowerCase()];
 
        if (baseRate && userRate) {
          const converted = (Number(amount) / baseRate) * userRate;
          const decimals  = userRate > 100 ? 0 : userRate > 10 ? 1 : 2;
          setFinalAmount(parseFloat(converted.toFixed(decimals)));
          setDisplayCurrencyCode(resolvedCurrency);
        } else {
          setFinalAmount(Number(amount));
          setDisplayCurrencyCode(baseCurrency);
        }
      } catch {
        if (!cancelled) {
          setFinalAmount(Number(amount));
          setDisplayCurrencyCode(baseCurrency);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
 
    run();
    return () => { cancelled = true; };
  }, [amount, enableDynamic, baseCurrency]);
 
  if (isLoading && enableDynamic && amount) {
    return (
      <div className="flex items-baseline gap-1">
        <span className="animate-pulse bg-white/10 dark:bg-black/10 w-24 h-10 rounded-lg inline-block" />
        <span className="animate-pulse bg-white/10 dark:bg-black/10 w-10 h-5 rounded-lg inline-block ms-1" />
      </div>
    );
  }
 
  const getCurrencyLabel = (code: string) => {
    const entry = CURRENCY_LABELS[code];
    return entry ? (entry[locale] ?? entry["en"] ?? code) : code;
  };
 
  const formatted =
    finalAmount !== null
      ? finalAmount.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")
      : null;
 
  return (
    <div className="flex items-baseline gap-1">
      <span className="font-heading text-4xl font-bold text-text-primary">
        {formatted ?? fallbackPrice}
      </span>
      {formatted !== null && (
        <span className="text-text-muted text-sm font-bold ms-1">
          {getCurrencyLabel(displayCurrencyCode)}
        </span>
      )}
    </div>
  );
}