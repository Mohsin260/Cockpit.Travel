"use client";

import AdSlot from "@/components/ui/AdSlot";
import { useTranslations } from "@/hooks/useTranslations";
import { formatDate } from "@/lib/dateFormat";

export default function TermsPage() {
    const t = useTranslations();
    return (
        <main className="rb-container py-12" style={{ backgroundColor: "var(--solid-white)", color: "var(--body-fcolor)" }}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-10">
                    <h1 className="mb-3 text-[var(--heading-color)]" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800 }}>
                        {t("termsPage.title")}
                    </h1>
                    <p className="text-[var(--meta-fcolor)] text-sm">
                        {t("termsPage.lastUpdated")}: {formatDate(new Date().toISOString(), { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>

                <div className="mb-10">
                    <AdSlot pageType="website" position="top-leaderboard" label="Top Leaderboard Ad" width="728px" height="90px" responsive mobileWidth="320px" mobileHeight="50px" />
                </div>

                <div className="prose prose-lg max-w-none space-y-8" style={{ lineHeight: 1.8 }}>
                    <section>
                        <h2 className="text-[var(--heading-color)]" style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                            {t("termsPage.agreementTitle")}
                        </h2>
                        <p className="text-[var(--body-fcolor)]">{t("termsPage.agreementText")}</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                            {t("termsPage.licenseTitle")}
                        </h2>
                        <p className="text-[var(--body-fcolor)]">{t("termsPage.licenseText")}</p>
                        <ul className="list-disc pl-6 space-y-2 text-[var(--body-fcolor)]">
                            {(t("termsPage.licenseItems") as unknown as string[]).map((item: string, i: number) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                            {t("termsPage.disclaimerTitle")}
                        </h2>
                        <p className="text-[var(--body-fcolor)]">{t("termsPage.disclaimerText")}</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                            {t("termsPage.limitationsTitle")}
                        </h2>
                        <p className="text-[var(--body-fcolor)]">{t("termsPage.limitationsText")}</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                            {t("termsPage.accuracyTitle")}
                        </h2>
                        <p className="text-[var(--body-fcolor)]">{t("termsPage.accuracyText")}</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                            {t("termsPage.linksTitle")}
                        </h2>
                        <p className="text-[var(--body-fcolor)]">{t("termsPage.linksText")}</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                            {t("termsPage.modificationsTitle")}
                        </h2>
                        <p className="text-[var(--body-fcolor)]">{t("termsPage.modificationsText")}</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                            {t("termsPage.governingLawTitle")}
                        </h2>
                        <p className="text-[var(--body-fcolor)]">{t("termsPage.governingLawText")}</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                            {t("termsPage.contactInfoTitle")}
                        </h2>
                        <p className="text-[var(--body-fcolor)]">{t("termsPage.contactInfoText")}</p>
                        <p className="text-[var(--body-fcolor)]">
                            <strong>Email:</strong> <a href="mailto:legal@cockpit.travel" className="text-[var(--g-color)] hover:underline">legal@cockpit.travel</a>
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
