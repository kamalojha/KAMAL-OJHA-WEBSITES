import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Toaster } from 'sonner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { EducationSection } from './components/EducationSection';
import { CertificationsSection } from './components/CertificationsSection';
import { EndorsementsSection } from './components/EndorsementsSection';
import { PaymentSection } from './components/PaymentSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectDeepDiveModal } from './components/ProjectDeepDiveModal';
import { ResumeModal } from './components/ResumeModal';
import { PaymentModal } from './components/PaymentModal';
import { Project } from './types/portfolio';
import { AuthProvider } from './firebase/context';

export function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentPackageId, setSelectedPaymentPackageId] = useState<string | undefined>(undefined);
  const [selectedPaymentAmount, setSelectedPaymentAmount] = useState<number | undefined>(undefined);

  const handleOpenContact = () => {
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreProjects = () => {
    const projectsElem = document.getElementById('projects');
    if (projectsElem) {
      projectsElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenPayment = (packageId?: string, amount?: number) => {
    setSelectedPaymentPackageId(packageId);
    setSelectedPaymentAmount(amount);
    setIsPaymentModalOpen(true);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#090b10] text-[#e2e8f0] flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200">
        {/* 3-Zone Strict Top Bar Navigation */}
        <Navbar
          onOpenResume={() => setIsResumeModalOpen(true)}
          onOpenContact={handleOpenContact}
          onOpenPayment={() => handleOpenPayment()}
        />

        <main className="flex-1">
          {/* Split Hero Section */}
          <Hero
            onOpenResume={() => setIsResumeModalOpen(true)}
            onOpenContact={handleOpenContact}
            onExploreProjects={handleExploreProjects}
            onOpenPayment={() => handleOpenPayment()}
          />

          {/* 01. Featured Projects with Interactive Simulators */}
          <ProjectsSection onSelectProject={(project) => setSelectedProject(project)} />

          {/* 02. Technical Capabilities & Stack */}
          <SkillsSection />

          {/* 03. Internships & Professional Training */}
          <ExperienceTimeline />

          {/* 04. Education & Academic Pedigree */}
          <EducationSection />

          {/* 05. Certifications & Accolades */}
          <CertificationsSection />

          {/* 06. Peer & Recruiter Endorsements (Firebase Realtime) */}
          <EndorsementsSection />

          {/* 07. Technical Advisory, 1:1 Mentorship & Razorpay/Paytm Gateways */}
          <PaymentSection onOpenPaymentModal={handleOpenPayment} />

          {/* 08. Inbound Contact & Direct Inquiries */}
          <ContactSection />
        </main>

        {/* Clean Minimalist Footer */}
        <Footer />

        {/* Floating Quick Pay & Advisory Launcher Button */}
        <button
          onClick={() => handleOpenPayment()}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl shadow-xl shadow-blue-600/30 flex items-center gap-2.5 transition-all hover:scale-105 group border border-blue-400/30 backdrop-blur-sm cursor-pointer"
          title="Book Session & Pay via Razorpay or Paytm"
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="text-[11px] font-bold tracking-wide uppercase leading-tight font-display">
              Pay / Book Session
            </div>
            <div className="text-[10px] text-blue-100 flex items-center gap-1 font-mono">
              <span>Razorpay</span>
              <span>·</span>
              <span>Paytm</span>
            </div>
          </div>
        </button>

        {/* Project Deep Dive & Interactive Simulator Modal */}
        <ProjectDeepDiveModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />

        {/* Full Resume Dossier Sheet Modal */}
        <ResumeModal
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
        />

        {/* Razorpay & Paytm Payment Gateway Checkout Modal */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedPaymentAmount(undefined);
          }}
          preselectedPackageId={selectedPaymentPackageId}
          initialAmount={selectedPaymentAmount}
        />

        {/* Global Toast Notification System */}
        <Toaster
          position="top-right"
          theme="dark"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: '#0f172a',
              borderColor: '#1e293b',
              color: '#f8fafc',
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App;
