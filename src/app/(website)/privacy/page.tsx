"use client";

import AdSlot from "@/components/ui/AdSlot";
import { useTranslations } from "@/hooks/useTranslations";
import { formatDate } from "@/lib/dateFormat";

export default function PrivacyPage() {
    const t = useTranslations();
    return (
        <main className="rb-container py-12" style={{ backgroundColor: "var(--solid-white)", color: "var(--body-fcolor)" }}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-10">
                    <h1 className="mb-3 text-[var(--heading-color)]" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800 }}>
                        {t("privacyPage.title")}
                    </h1>
                    <p className="text-[var(--meta-fcolor)] text-sm">
                        {t("privacyPage.lastUpdated")}: {formatDate(new Date().toISOString(), { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>

                <div className="mb-10">
                    <AdSlot pageType="website" position="top-leaderboard" label="Top Leaderboard Ad" width="728px" height="90px" responsive mobileWidth="320px" mobileHeight="50px" />
                </div>

                <div className="prose prose-lg max-w-none space-y-8" style={{ lineHeight: 1.8 }}>
                    <section>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                            {t("privacyPage.introTitle")}
                        </h2>
                        <p className="text-[var(--body-fcolor)]">{t("privacyPage.introText")}</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                            {t("privacyPage.collectTitle")}
                        </h2>
                        <p className="text-[var(--body-fcolor)]">{t("privacyPage.collectText")}</p>
                        <ul className="list-disc pl-6 space-y-2 text-[var(--body-fcolor)]">
                            <li><strong>Personal Data:</strong> {t("privacyPage.personalData")}</li>
                            <li><strong>Derivative Data:</strong> {t("privacyPage.derivativeData")}</li>
                            <li><strong>Financial Data:</strong> {t("privacyPage.financialData")}</li>
                            <li><strong>Data from Social Networks:</strong> {t("privacyPage.socialData")}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                            {t("privacyPage.useTitle")}
                        </h2>
                        <p className="text-[var(--body-fcolor)]">{t("privacyPage.useText")}</p>
                        <ul className="list-disc pl-6 space-y-2 text-[var(--body-fcolor)]">
                            {(t("privacyPage.useItems") as unknown as string[]).map((item: string, i: number) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                            {t("privacyPage.disclosureTitle")}
                        </h2>
                        <p className="text-[var(--body-fcolor)]">{t("privacyPage.disclosureText")}</p>
                        <ul className="list-disc pl-6 space-y-2 text-[var(--body-fcolor)]">
                            <li><strong>By Law or to Protect Rights:</strong> {t("privacyPage.lawDisclosure")}</li>
                            <li><strong>Third-Party Service Providers:</strong> {t("privacyPage.thirdPartyDisclosure")}</li>
                            <li><strong>Marketing Communications:</strong> {t("privacyPage.marketingDisclosure")}</li>
                            <li><strong>Business Transfers:</strong> {t("privacyPage.businessDisclosure")}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                            {t("privacyPage.cookiesTitle")}
                        </h2>
                        <p className="text-[var(--body-fcolor)]">{t("privacyPage.cookiesText")}</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                            {t("privacyPage.securityTitle")}
                        </h2>
                        <p className="text-[var(--body-fcolor)]">{t("privacyPage.securityText")}</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                            {t("privacyPage.contactTitle")}
                        </h2>
                        <p className="text-[var(--body-fcolor)]">{t("privacyPage.contactText")}</p>
                        <p className="text-[var(--body-fcolor)]">
                            <strong>Email:</strong> <a href="mailto:privacy@cockpit.travel" className="text-[var(--g-color)] hover:underline">privacy@cockpit.travel</a>
                        </p>
                    </section>
                </div>

                <div className="mt-12">
                    <AdSlot pageType="website" position="bottom-leaderboard" label="Bottom Leaderboard Ad" width="728px" height="90px" responsive mobileWidth="320px" mobileHeight="50px" />
                </div>
            </div>
        </main>
    );
}
