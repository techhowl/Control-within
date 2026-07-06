export const metadata = {
  title: "Privacy Policy & Terms of Use | Control Within",
  description:
    "Privacy Policy and Terms of Use for the Control Within microsite and WhatsApp service.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-bg text-text">
      {/* Top padding clears the fixed ticker + navbar chrome */}
      <div className="mx-auto max-w-3xl px-[6%] pb-24 pt-36 md:pt-44">
        <header className="border-b border-dark/10 pb-8">
          <h1 className="font-author text-3xl font-medium leading-tight text-accent md:text-4xl">
            Privacy Policy &amp; Terms of Use
          </h1>
          <p className="mt-4 text-sm text-muted">
            Last updated: 03/07/2026
          </p>
          <p className="mt-1 text-sm text-muted">
            Applies to:{" "}
            <a
              href="https://controlwithin.com/"
              className="font-medium text-accent hover:underline"
            >
              https://controlwithin.com/
            </a>{" "}
            and the official WhatsApp number (+91 8452926740) linked from it,
            operated by Connexi India Supply Chain Services Private Limited
          </p>
        </header>

        {/* PART A — PRIVACY POLICY */}
        <section className="mt-12">
          <h2 className="font-author text-2xl font-medium text-accent">
            Part A — Privacy Policy
          </h2>

          <Clause number="1" title="Scope">
            <p>This policy covers two connected surfaces:</p>
            <ul>
              <li>The website/microsite you&apos;re currently on.</li>
              <li>
                The WhatsApp conversation you may start from it (via our chatbot
                and counselling team).
              </li>
            </ul>
            <p>
              It does not cover the practices of independent third-party clinics
              or doctors you&apos;re eventually referred to — they operate under
              their own patient confidentiality obligations, which your doctor
              can explain at your appointment.
            </p>
          </Clause>

          <Clause number="2" title="What we collect">
            <p>
              <strong>On the microsite:</strong> Nothing, at first. Browsing this
              site does not require you to submit any personal information. We use
              basic, non-identifying analytics (page views, source of traffic) to
              understand what content is useful. We do not ask for your name,
              number, or health details on this site.
            </p>
            <p>
              <strong>On WhatsApp, once you choose to start a conversation:</strong>
            </p>
            <ul>
              <li>Your name and phone number (via WhatsApp).</li>
              <li>Your city or location, to match you to a nearby clinic.</li>
              <li>
                Responses to eligibility and need-based questions (e.g., what
                you&apos;re looking for, relevant health context you choose to
                share).
              </li>
              <li>Appointment details, if you proceed to book.</li>
            </ul>
            <p>
              We do not collect anything beyond what&apos;s needed to guide you
              and, if you choose, connect you to a doctor.
            </p>
          </Clause>

          <Clause number="3" title="Sensitive personal data">
            <p>
              Information about your health and reproductive choices is classified
              as sensitive personal data under India&apos;s Digital Personal Data
              Protection Act, 2023 (DPDP Act). We collect it only with your
              explicit consent, given at the start of the WhatsApp conversation,
              and only use it for the purpose you gave it to us for. We do not
              infer, guess, or ask about anything beyond what&apos;s directly
              relevant to helping you.
            </p>
          </Clause>

          <Clause number="4" title="Why we collect it (purpose limitation)">
            <p>Your information is used only to:</p>
            <ul>
              <li>
                Understand your needs and check basic eligibility for
                hIUS/Implant methods.
              </li>
              <li>Match you to the nearest qualified doctor or clinic.</li>
              <li>Confirm and manage your appointment.</li>
              <li>
                Follow up, if you&apos;ve agreed to it, to check in or share
                relevant information (you can opt out of this anytime).
              </li>
            </ul>
            <p>
              We do not use your health information for advertising targeting, and
              we do not sell it to any third party, ever.
            </p>
          </Clause>

          <Clause number="5" title="Who we share it with">
            <p>
              <strong>Partner clinics and doctors</strong> — only the details
              needed to confirm and prepare for your appointment.
            </p>
            <p>
              <strong>Our technology processors</strong> (WhatsApp Business
              platform, and backend systems used to manage conversations and
              scheduling) — bound by confidentiality and data processing terms,
              and used only to operate this service.
            </p>
            <p>
              No one else. Not family, not employers, not insurers, not the
              influencer or ad platform you arrived from, not any marketing or
              analytics partner in identifiable form.
            </p>
          </Clause>

          <Clause number="6" title="How we protect it">
            <p>
              Your data is stored on access-controlled systems, with conversation
              access limited to the counselling team directly assisting you. We do
              not publish, screenshot, or reuse your responses in any content,
              testimonial, or campaign material without asking you separately and
              explicitly.
            </p>
          </Clause>

          <Clause number="7" title="How long we keep it">
            <p>
              We retain your information only as long as needed to assist you and,
              where relevant, to meet legal record-keeping requirements. If you
              type <strong>EXIT</strong> at any point in the WhatsApp
              conversation, we close the conversation and delete your personal
              data from our active systems.
            </p>
          </Clause>

          <Clause number="8" title="Your rights">
            <p>Under the DPDP Act, you have the right to:</p>
            <ul>
              <li>Know what personal data we hold about you.</li>
              <li>Ask us to correct inaccurate data.</li>
              <li>
                Withdraw consent and request erasure of your data at any time.
              </li>
              <li>
                Raise a grievance if you believe your data has been misused.
              </li>
            </ul>
            <p>
              To exercise any of these, type <strong>EXIT</strong> in WhatsApp, or
              contact our Grievance Officer.
            </p>
          </Clause>

          <Clause number="9" title="Cookies (microsite)">
            <p>
              The microsite may use basic cookies/analytics tags to understand
              traffic sources and site performance. These do not collect your
              name, number, or health information. You can disable cookies via
              your browser settings without affecting your ability to browse the
              site.
            </p>
          </Clause>

          <Clause number="10" title="Age">
            <p>
              This service is intended for individuals aged 18 and above. We do
              not knowingly collect data from anyone under 18. If you believe a
              minor has shared information with us, contact us and we&apos;ll
              remove it.
            </p>
          </Clause>

          <Clause number="11" title="Changes to this policy">
            <p>
              We may update this policy from time to time. The &quot;Last
              updated&quot; date at the top will reflect the latest revision.
              Material changes affecting how your data is used will be
              communicated before they take effect.
            </p>
          </Clause>

          <Clause number="12" title="Grievance Officer">
            <p>In accordance with applicable Indian law:</p>
            <div className="mt-4 rounded-2xl bg-surface p-6 shadow-soft">
              <dl className="grid gap-2 text-sm">
                <Row label="Name" value="Abhishek Agarwal" />
                <Row label="Designation" value="Business Head" />
                <Row label="Company Legal Name" value="Wulfpak Marketing Services Pvt Ltd" />
                <Row
                  label="Email"
                  value={
                    <a
                      href="mailto:abhishek@howl.in"
                      className="font-medium text-accent hover:underline"
                    >
                      abhishek@howl.in
                    </a>
                  }
                />
                <Row
                  label="Address"
                  value="First Floor, Jai Singh Business Centre, Sahar Rd, Parshiwada, Chakala, Andheri East, Mumbai, Maharashtra 400099"
                />
              </dl>
            </div>
          </Clause>
        </section>

        {/* PART B — TERMS OF USE */}
        <section className="mt-16 border-t border-dark/10 pt-12">
          <h2 className="font-author text-2xl font-medium text-accent">
            Part B — Terms of Use
          </h2>

          <Clause number="1" title="Acceptance">
            <p>
              By using this website and/or initiating a conversation on our
              WhatsApp number, you agree to these Terms. If you don&apos;t agree,
              please don&apos;t use this service.
            </p>
          </Clause>

          <Clause number="2" title="What this platform is — and isn't">
            <p>
              This microsite and WhatsApp service exist to provide general
              information about hIUS (Hormonal Intrauterine System) and
              contraceptive implants, and to help you connect with a qualified
              doctor if you choose to.
            </p>
            <p>
              <strong>This is not medical advice.</strong> Nothing on this site or
              in the WhatsApp conversation is a diagnosis, prescription, or
              substitute for consultation with a qualified gynaecologist.
              Eligibility, suitability, and the final decision to proceed with any
              method rest entirely between you and your doctor.
            </p>
          </Clause>

          <Clause number="3" title="No booking or payment happens here">
            <p>
              This website does not process appointments or payments. Appointments
              are coordinated through our WhatsApp counselling team and confirmed
              by the partner clinic directly. Any consultation fees, procedure
              costs, or clinic charges are determined and collected by the clinic,
              not by us.
            </p>
          </Clause>

          <Clause number="4" title="Third-party clinics and doctors">
            <p>
              Clinics and doctors referred to you through this service are
              independent healthcare providers, not our employees or agents. While
              we work only with qualified, verified professionals, we are not
              responsible for the clinical outcomes, advice, or conduct of any
              independent doctor or clinic. Any concerns about care received
              should be raised directly with the clinic, per their own patient
              grievance process.
            </p>
          </Clause>

          <Clause number="5" title="Accuracy of information">
            <p>
              We&apos;ve made every effort to ensure the information on this site
              reflects current, doctor-reviewed medical understanding of hIUS and
              implants. However, individual bodies respond differently, and
              medical guidance evolves. Always confirm details relevant to your
              specific health situation with your doctor before making a decision.
            </p>
          </Clause>

          <Clause number="6" title="Eligibility to use this service">
            <p>
              This service is intended for individuals aged 18 and above, based in
              India.
            </p>
          </Clause>

          <Clause number="7" title="Acceptable use">
            <p>
              You agree not to use this website or WhatsApp service to submit
              false information, impersonate another person, or use the platform
              for any purpose other than seeking information or a consultation for
              yourself.
            </p>
          </Clause>

          <Clause number="8" title="Intellectual property">
            <p>
              All content on this website — text, visuals, videos, and brand
              assets — belongs to [Company Legal Name] or its licensors and may
              not be copied, reproduced, or reused without written permission.
            </p>
          </Clause>

          <Clause number="9" title="Limitation of liability">
            <p>
              To the extent permitted by law, [Company Legal Name] is not liable
              for any indirect, incidental, or consequential loss arising from
              your use of this website or WhatsApp service, including decisions
              made based on general information provided here. This does not limit
              any liability that cannot be excluded under Indian law.
            </p>
          </Clause>

          <Clause number="10" title="Governing law">
            <p>
              These Terms are governed by the laws of India, and any disputes are
              subject to the exclusive jurisdiction of the courts of [City].
            </p>
          </Clause>

          <Clause number="11" title="Contact">
            <p>
              For any questions about these Terms or our Privacy Policy, reach us
              at: <b>+91 8452926740</b>
            </p>
          </Clause>
        </section>
      </div>
    </main>
  );
}

function Clause({ number, title, children }) {
  return (
    <div className="mt-8">
      <h3 className="font-author text-lg font-medium text-dark">
        {number}. {title}
      </h3>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-text/80 [&_a]:break-words [&_li]:leading-relaxed [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1.5">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
      <dt className="w-28 flex-none font-medium text-dark">{label}</dt>
      <dd className="text-text/80">{value}</dd>
    </div>
  );
}
