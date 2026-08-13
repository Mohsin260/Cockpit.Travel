import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/article/Breadcrumb";

export default function TermsOfServicePage() {
  return (
    <div className="nerio-page-wrapper flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 mb-[50px]">
        <Breadcrumb category={{ label: "Legal", color: "#0073ff" }} title="Terms of Service" />
        <section className="nerio-container py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
            <div className="space-y-6 text-[var(--bodyColor)] leading-relaxed">
              <p><em>Last updated: August 4, 2026</em></p>
              <p>
                Welcome to Nerio News Magazine. These Terms of Service outline the rules and regulations for the use of our website at nerio-theta.vercel.app.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Acceptance of Terms</h2>
              <p>
                By accessing and using this website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Intellectual Property</h2>
              <p>
                All content published on Nerio News Magazine, including articles, images, graphics, logos, and software, is the property of Nerio or its content suppliers and is protected by international copyright laws.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">User Conduct</h2>
              <p>When using our website, you agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Reproduce, duplicate, or copy any content without permission</li>
                <li>Use our content for commercial purposes without authorization</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Engage in any activity that disrupts our services</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">Limitation of Liability</h2>
              <p>
                Nerio News Magazine shall not be held liable for any damages arising from the use of or inability to use our website or its content. We strive for accuracy but cannot guarantee the completeness of all information.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Changes to Terms</h2>
              <p>
                We reserve the right to update these Terms of Service at any time. Continued use of the website after changes constitutes acceptance of the new terms.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at info@nerio.com.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
