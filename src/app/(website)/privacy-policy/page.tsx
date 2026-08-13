import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/article/Breadcrumb";

export default function PrivacyPolicyPage() {
  return (
    <div className="nerio-page-wrapper flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 mb-[50px]">
        <Breadcrumb category={{ label: "Legal", color: "#0073ff" }} title="Privacy Policy & GDPR/CCPA" />
        <section className="nerio-container py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy & GDPR/CCPA</h1>
            <div className="space-y-6 text-[var(--bodyColor)] leading-relaxed">
              <p><em>Last updated: August 4, 2026</em></p>
              <p>
                Nerio News Magazine (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the nerio-theta.vercel.app website. This page informs you of our policies regarding the collection, use, and disclosure of personal information when you use our service.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you subscribe to our newsletter, leave a comment, or contact us. This may include your name, email address, and any other information you choose to provide.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Send you newsletters and updates you have subscribed to</li>
                <li>Respond to your comments and questions</li>
                <li>Improve our website and content</li>
                <li>Analyze usage patterns to enhance user experience</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">GDPR Rights (European Users)</h2>
              <p>
                If you are a resident of the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR). You have the right to access, update, or delete your personal information.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">CCPA Rights (California Residents)</h2>
              <p>
                Under the California Consumer Privacy Act (CCPA), California residents have the right to know what personal data we collect, request deletion of their data, and opt-out of the sale of their personal information.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at info@nerio.com.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
