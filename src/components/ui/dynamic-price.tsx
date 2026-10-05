"use client";
import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─────────────────────────────────────────────────────────────────────────────
// 🌍 خريطة الدول → عملة (بس العملات اللي بتخدم جمهورك فعلاً)
// أي دولة مش موجودة هنا → USD تلقائي (مفيش داعي نغطي كل دول العالم)
// ─────────────────────────────────────────────────────────────────────────────
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // مصر (العملة الأساسية)
  EG: "EGP",

  // الخليج
  SA: "SAR", AE: "AED", KW: "KWD", QA: "QAR", OM: "OMR", BH: "BHD",

  // أمريكا وبريطانيا
  US: "USD", GB: "GBP",

  // منطقة اليورو (أهم دولها)
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", PT: "EUR", NL: "EUR",
  BE: "EUR", AT: "EUR", GR: "EUR", FI: "EUR", IE: "EUR", LU: "EUR",
  MT: "EUR", CY: "EUR", SK: "EUR", SI: "EUR", EE: "EUR", LV: "EUR", LT: "EUR", HR: "EUR",
};

const CURRENCY_LABELS: Record<string, Record<string, string>> = {
  EGP: { ar: "ج.م", en: "EGP" },
  SAR: { ar: "ر.س", en: "SAR" },
  AED: { ar: "د.إ", en: "AED" },
  KWD: { ar: "د.ك", en: "KWD" },
  QAR: { ar: "ر.ق", en: "QAR" },
  OMR: { ar: "ر.ع", en: "OMR" },
  BHD: { ar: "د.ب", en: "BHD" },
  USD: { ar: "$", en: "$" },
  EUR: { ar: "€", en: "€" },
  GBP: { ar: "£", en: "£" },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🔑 MODULE-LEVEL — نفس الحل بتاع الـ hydration/remount (زي ما كان)
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
  // أي دولة مش في القايمة المختصرة → USD تلقائي
  const currency = COUNTRY_TO_CURRENCY[countryCode] ?? "USD";
  try { sessionStorage.setItem("dp_user_currency", currency); } catch { /* ignore */ }
  return currency;
}

// ─── RATES ────────────────────────────────────────────────────────────────────
// ⚠️ شيلنا Frankfurter من هنا لأنه ملوش غير ~31 عملة أوروبية (ECB)
// ومفيهوش EGP ولا أي عملة خليجية → كان بيرجّع الأسعار غلط لما يبقى fallback
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

// ─── getOrCreate promises ────────────────────────────────────────────────────
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

// ─── تقريب ذكي: دايمًا رقم صحيح بدون قروش، بمقياس مناسب لحجم الرقم ──────────
// (تقريب ثابت لأقرب 100 هيبوظ عملات زي KWD/USD اللي أرقامها صغيرة أصلاً)
function niceRound(value: number): number {
  if (value >= 1000) return Math.round(value / 100) * 100;
  if (value >= 100) return Math.round(value / 10) * 10;
  if (value >= 20) return Math.round(value / 5) * 5;
  return Math.round(value);
}

// ─────────────────────────────────────────────────────────────────────────────
// 🧩 Component
// ─────────────────────────────────────────────────────────────────────────────
export default function DynamicPrice({ amount, fallbackPrice, settings }: any) {
  const locale = useLocale();
  const enableDynamic = settings?.enableDynamicPricing === true;
  const baseCurrency = (settings?.baseCurrency || "EGP").toUpperCase();

  const [finalAmount, setFinalAmount] = useState<number | null>(null);
  const [displayCurrencyCode, setDisplayCurrencyCode] = useState(baseCurrency);
  const [isLoading, setIsLoading] = useState(true);

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
          // رقم صحيح بدون كسور دايمًا (مثال: 5589 → 5600 للأرقام الكبيرة)
          setFinalAmount(niceRound(converted));
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