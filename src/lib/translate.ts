import { DEPLOYMENT_LOCALE } from "@/lib/i18n";

type Messages = Record<string, any>;

const cachedMessages: Record<string, Messages> = {};

function getMessages(locale: string): Messages {
  if (cachedMessages[locale]) return cachedMessages[locale];

  try {
    const mod = require(`@/messages/${locale}.json`);
    cachedMessages[locale] = mod.default || mod;
  } catch {
    cachedMessages[locale] = {};
  }

  return cachedMessages[locale];
}

function resolveKey(obj: any, path: string): string | undefined {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) as
    | string
    | undefined;
}

export function translate(key: string): string {
  const messages = getMessages(DEPLOYMENT_LOCALE);
  return resolveKey(messages, key) || resolveKey(messages, key) || key;
}
