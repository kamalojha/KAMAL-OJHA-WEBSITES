import React from 'react';
import { X, Printer, Download, Mail, Phone, Linkedin, MapPin, ExternalLink, Check, Copy } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES, EXPERIENCES, EDUCATION, CERTIFICATIONS } from '../data/portfolioData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyResumeText = () => {
    const resumeText = `KAMAL OJHA
${PERSONAL_INFO.phone} | ${PERSONAL_INFO.email} | ${PERSONAL_INFO.linkedin} | ${PERSONAL_INFO.location}

SUMMARY
${PERSONAL_INFO.summary}

EDUCATION
- Chandigarh University, Mohali, Punjab — B.E. in Computer Science Engineering (2021 – 2024)
- Chandigarh College of Engineering and Technology, Chandigarh — Diploma in Computer Science Engineering (2018 – 2021)
- Shishu Niketan Model Senior Secondary School, Sector-22 Chandigarh — NIOS – Secondary Education (2017 – 2017)

TECHNICAL SKILLS
- Languages: Python, Java, C++, C, JavaScript, R
- Frameworks & Libraries: Django, React, Angular, Tkinter, TensorFlow/Keras, OpenCV
- Web: HTML, CSS, PHP, MongoDB, MySQL, SQLite3
- Tools & Platforms: Linux (Kali, Ubuntu), Git, AWS, VS Code, Big Data Analytics
- Domains: Machine Learning, Computer Vision, Full Stack Development, Data Visualization

PROJECTS
${PROJECTS.map(p => `• ${p.title} | ${p.techStack.join(', ')}\n  ${p.bulletPoints.join('\n  ')}`).join('\n\n')}

INTERNSHIPS & TRAINING
${EXPERIENCES.map(e => `• ${e.role} — ${e.organization} (${e.year})\n  ${e.description}`).join('\n\n')}

CERTIFICATIONS
${CERTIFICATIONS.map(c => `• ${c.title} — ${c.issuer}`).join('\n')}`;

    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white text-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto border border-slate-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Toolbar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-display">Kamal Ojha — Curriculum Vitae</span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">· Official 2024 Engineering Dossier</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyResumeText}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Text' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close resume view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formatted Official Resume Sheet (Matches exact structure of original PDF) */}
        <div className="p-8 sm:p-12 overflow-y-auto bg-white font-sans text-slate-900 space-y-6 text-sm leading-normal">
          {/* Header */}
          <div className="text-center border-b border-slate-300 pb-5 space-y-1.5">
            <h1 className="text-3xl font-serif font-bold tracking-tight text-slate-900">
              Kamal Ojha
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-3 text-xs text-slate-700 font-medium">
              <span>{PERSONAL_INFO.phone}</span>
              <span aria-hidden="true">|</span>
              <a href={`mailto:${PERSONAL_INFO.email}`} className="text-blue-700 hover:underline">
                {PERSONAL_INFO.email}
              </a>
              <span aria-hidden="true">|</span>
              <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                {PERSONAL_INFO.linkedinHandle}
              </a>
              <span aria-hidden="true">|</span>
              <span>{PERSONAL_INFO.location}</span>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2 font-serif">
              Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              {PERSONAL_INFO.summary}
            </p>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2 font-serif">
              Education
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-900">Chandigarh University</div>
                  <div className="italic text-slate-700">B.E. in Computer Science Engineering</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-700">Mohali, Punjab</div>
                  <div className="italic text-slate-600">2021 – 2024</div>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-900">Chandigarh College of Engineering and Technology</div>
                  <div className="italic text-slate-700">Diploma in Computer Science Engineering</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-700">Chandigarh</div>
                  <div className="italic text-slate-600">2018 – 2021</div>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-900">Shishu Niketan Model Senior Secondary School, Sector-22</div>
                  <div className="italic text-slate-700">NIOS – Secondary Education</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-700">Chandigarh</div>
                  <div className="italic text-slate-600">2017 – 2017</div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2 font-serif">
              Technical Skills
            </h2>
            <div className="space-y-1 text-xs text-slate-800">
              <div>
                <strong>Languages:</strong> Python, Java, C++, C, JavaScript, R
              </div>
              <div>
                <strong>Frameworks & Libraries:</strong> Django, React, Angular, Tkinter, TensorFlow/Keras, OpenCV
              </div>
              <div>
                <strong>Web:</strong> HTML, CSS, PHP, MongoDB, MySQL, SQLite3
              </div>
              <div>
                <strong>Tools & Platforms:</strong> Linux (Kali, Ubuntu), Git, AWS, VS Code, Big Data Analytics
              </div>
              <div>
                <strong>Domains:</strong> Machine Learning, Computer Vision, Full Stack Development, Data Visualization
              </div>
            </div>
          </div>

          {/* Projects */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2 font-serif">
              Projects
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <div className="font-bold text-slate-900">
                  Pneumonia Detection in Chest X-rays <span className="font-normal italic text-slate-600">| Python, CNNs, Transfer Learning, Keras</span>
                </div>
                <ul className="list-disc pl-5 text-slate-700 space-y-0.5 mt-0.5">
                  <li>Built a deep learning model using CNNs and transfer learning for early-stage pneumonia diagnosis from chest X-rays, integrated with healthcare datasets for real-world accuracy.</li>
                </ul>
              </div>

              <div>
                <div className="font-bold text-slate-900">
                  Wheat Crop Disease Detection <span className="font-normal italic text-slate-600">| Python, Computer Vision, CNN</span>
                </div>
                <ul className="list-disc pl-5 text-slate-700 space-y-0.5 mt-0.5">
                  <li>Designed a CNN-based image classification model to detect common wheat crop diseases, enabling early agricultural intervention.</li>
                </ul>
              </div>

              <div>
                <div className="font-bold text-slate-900">
                  PG Life – Full Stack Web App <span className="font-normal italic text-slate-600">| React, Angular, PHP, MongoDB, MySQL, HTML/CSS</span>
                </div>
                <ul className="list-disc pl-5 text-slate-700 space-y-0.5 mt-0.5">
                  <li>Developed a full-stack platform for students to discover and shortlist PG accommodations, featuring user authentication and dynamic listings. (Internshala project)</li>
                </ul>
              </div>

              <div>
                <div className="font-bold text-slate-900">
                  Time Entry Web Application <span className="font-normal italic text-slate-600">| Django, Python, SQLite3, JavaScript, HTML/CSS</span>
                </div>
                <ul className="list-disc pl-5 text-slate-700 space-y-0.5 mt-0.5">
                  <li>Built an attendance and task-tracking web app for remote/corporate teams – logs hours, assigns tasks, and provides reporting dashboards.</li>
                </ul>
              </div>

              <div>
                <div className="font-bold text-slate-900">
                  Dynamic Load Balancing in Ad-hoc Networks <span className="font-normal italic text-slate-600">| Multipath Routing, LARA Protocol</span>
                </div>
                <ul className="list-disc pl-5 text-slate-700 space-y-0.5 mt-0.5">
                  <li>Implemented zone-based energy-aware and load-aware routing protocols to efficiently distribute workload across ad-hoc network nodes.</li>
                </ul>
              </div>

              <div>
                <div className="font-bold text-slate-900">
                  Library Management System <span className="font-normal italic text-slate-600">| Python, Tkinter, SQLite3/MySQL</span>
                </div>
                <ul className="list-disc pl-5 text-slate-700 space-y-0.5 mt-0.5">
                  <li>Developed a desktop GUI application to manage books, users, borrowing, and return transactions for library operations.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Internships & Training */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2 font-serif">
              Internships & Training
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-900">Full Stack Development</div>
                  <div className="italic text-slate-700">Web Development Intern – PG Life Project</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-700">Internshala</div>
                  <div className="italic text-slate-600">2023</div>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-900">Python Training</div>
                  <div className="italic text-slate-700">Python Programming & Application Development</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-700">IBM</div>
                  <div className="italic text-slate-600">2022</div>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-900">Python Training</div>
                  <div className="italic text-slate-700">Python Programming Workshop</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-700">Punjab University</div>
                  <div className="italic text-slate-600">2022</div>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-900">Cyber Security Workshop</div>
                  <div className="italic text-slate-700">Cybersecurity Training</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-700">Workshop</div>
                  <div className="italic text-slate-600">2022</div>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-900">Raisa India Foundation</div>
                  <div className="italic text-slate-700">Volunteer & Training Program</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-700">Raisa Foundation</div>
                  <div className="italic text-slate-600">2023</div>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2 font-serif">
              Certifications
            </h2>
            <div className="space-y-1 text-xs text-slate-800">
              <div><strong>AWS Cloud Solutions Architect</strong> – Amazon Web Services</div>
              <div><strong>Goldman Sachs Software Engineering Job Simulation</strong> – Forage</div>
              <div><strong>Machine Learning for Computer Vision</strong> – MathWorks / Coursera</div>
              <div><strong>Infosys</strong> – Wireless Evolution and 4G LTE Overview</div>
              <div><strong>EDC IIT Delhi</strong> – Certificate of Appreciation, Campus Ambassador (Dec 2023 – Feb 2024)</div>
              <div><strong>Hack the Mount 4.0</strong> – Hacker Award Certificate (Oct 2023)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
