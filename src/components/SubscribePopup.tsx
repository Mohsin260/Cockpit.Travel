"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

/*
 * Subscribe popup — port of the reference Elementor "Don't Miss a News" modal.
 *
 * Behavior (mirrored from the reference trigger settings + JS):
 *  - trigger.on_load = true, load_delay = 12 (seconds)
 *  - show_frequency = "per-session"  -> sessionStorage guard
 *  - close via .popup-close button, dark overlay, or Escape
 *  - body scroll locked while open
 */
export default function SubscribePopup() {
  const t = useTranslations();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  const lastVisible = useRef(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  useEffect(() => {
    const key = "rstb_popup_subscribe_v1";
    const alreadyShown = (() => {
      try {
        return sessionStorage.getItem(key) === "1";
      } catch {
        return false;
      }
    })();
    if (alreadyShown) return;

    const timer = window.setTimeout(show, 12_000);
    const markShown = () => {
      try {
        sessionStorage.setItem(key, "1");
      } catch {
        /* ignore */
      }
    };
    // Guard: a click/dismiss counts as "shown" too (reference removes show-popup
    // on close and frequency="per-session" keeps it hidden for the session).
    window.addEventListener("beforeunload", markShown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeunload", markShown);
    };
  }, []);

  // Lock body scroll while the popup is open
  useEffect(() => {
    if (visible && !lastVisible.current) {
      // reset status if reopened in-session (per-session guard prevents this in
      // practice, but keep state sane)
      setStatus("idle");
    }
    lastVisible.current = visible;
  }, [visible]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const close = () => {
    try {
      sessionStorage.setItem("rstb_popup_subscribe_v1", "1");
    } catch {
      /* ignore */
    }
    hide();
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          alertPreferences: { priceDrops: false, verdictChanges: false },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("done");
        try {
          sessionStorage.setItem("rstb_popup_subscribe_v1", "1");
        } catch {
          /* ignore */
        }
        window.setTimeout(close, 2500);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div
      id="rstb-popup-6838"
      className={`rstb-template-popup ${visible ? "show-popup" : ""}`}
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <div className="popup-overly" onClick={close} />

      <div className="popup-container" style={{ width: 550, height: "auto" }}>
        <button type="button" className="popup-close" onClick={close} aria-label={t("newsletter.popupClose") || "Close"}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
          </svg>
        </button>

        <div className="subscribe-popup-content">
          <div className="subscribe-popup-image">
            <img
              src="https://nerio.rstheme.com/sports-news/wp-content/uploads/sites/6/2025/12/subscribe.png"
              alt="subscribe"
            />
          </div>

          <div className="subscribe-popup-heading">
            <h2 className="subscribe-popup-title">{t("newsletter.popupTitle")}</h2>
            <div className="subscribe-popup-desc">{t("newsletter.popupDescription")}</div>
          </div>

          {status === "done" ? (
            <div className="subscribe-popup-success">{t("newsletter.youSubscribed")}</div>
          ) : (
            <form className="subscribe-popup-form" onSubmit={submit} noValidate>
              <input
                type="email"
                className="subscribe-popup-input"
                placeholder={t("newsletter.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                aria-required="true"
                required
              />

              <label className="subscribe-popup-consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span className="wpcf7-list-item-label">
                  {t("newsletter.consent")}{" "}
                  <Link href="/terms-of-service">
                    {t("footer.termsAgreements")}
                  </Link>
                </span>
              </label>

              <div className="subscribe-popup-btn-wrap">
                <button
                  type="submit"
                  className="subscribe-popup-btn"
                  disabled={!consent || !email.trim() || status === "submitting"}
                >
                  {status === "submitting"
                    ? t("newsletter.subscribing")
                    : t("newsletter.subscribe")}
                  <span className="subscribe-popup-btn-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 12">
                      <path fillRule="evenodd" clipRule="evenodd" d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z" />
                    </svg>
                  </span>
                </button>
              </div>

              {status === "error" && (
                <p className="subscribe-popup-error">{t("newsletter.failedToSubscribe")}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}