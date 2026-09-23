import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Laptop,
  Flame,
  Award,
  PlusCircle,
  RefreshCw,
  X,
  Flag,
  HelpCircle,
  Check,
  ChevronDown,
  Landmark,
  Building2,
  FileText,
  Printer,
} from 'lucide-react';
import { CONSULTATION_PACKAGES, ServicePackage } from './PaymentModal';
import { useAuth } from '../firebase/context';
import {
  fetchRecentPayments,
  recordPaymentInFirestore,
  updatePaymentStatus,
  PaymentRecord,
} from '../services/paymentService';

interface PaymentSectionProps {
  onOpenPaymentModal: (packageId?: string, amount?: number) => void;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({ onOpenPaymentModal }) => {
  const { isAdmin } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [showAdminTab, setShowAdminTab] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // Manual payment recording state (for Admin)
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualAmount, setManualAmount] = useState<number | ''>(499);
  const [manualGateway, setManualGateway] = useState<'razorpay' | 'paytm'>('paytm');
  const [manualPurpose, setManualPurpose] = useState('1:1 Tech Interview & Resume Audit');
  const [manualTxnId, setManualTxnId] = useState('');
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  const [manualSuccessMsg, setManualSuccessMsg] = useState<string | null>(null);
  const [manualErrorMsg, setManualErrorMsg] = useState<string | null>(null);

  // FAQ open state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const loadPayments = async () => {
    setLoadingTransactions(true);
    try {
      const records = await fetchRecentPayments();
      setPayments(records);
    } catch (err) {
      console.warn('Failed to load payments for admin:', err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadPayments();
    }
  }, [isAdmin]);

  const handleRecordManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualEmail.trim() || !manualAmount || Number(manualAmount) <= 0) {
      const msg = 'Name, email, and a valid amount are required.';
      setManualErrorMsg(msg);
      toast.error('Validation Error', { description: msg });
      return;
    }

    setIsSubmittingManual(true);
    setManualErrorMsg(null);
    setManualSuccessMsg(null);

    const generatedOrderId = `ord_manual_${Date.now()}`;
    const generatedTxnId = manualTxnId.trim() || `txn_${manualGateway}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    try {
      const paymentId = await recordPaymentInFirestore({
        orderId: generatedOrderId,
        gateway: manualGateway,
        amount: Number(manualAmount),
        customerName: manualName,
        customerEmail: manualEmail,
        customerPhone: manualPhone || undefined,
        purpose: manualPurpose,
        transactionId: generatedTxnId,
        status: 'completed',
      });

      setManualSuccessMsg(`Payment registered successfully in Firestore! Reference: ${paymentId}`);
      toast.success('Payment Record Created', {
        description: `₹${manualAmount} for ${manualName} (${manualGateway.toUpperCase()}) saved to Firestore.`,
      });
      await loadPayments();

      setTimeout(() => {
        setIsManualModalOpen(false);
        setManualSuccessMsg(null);
        setManualName('');
        setManualEmail('');
        setManualPhone('');
        setManualTxnId('');
      }, 1400);
    } catch (err: any) {
      console.error('Failed to manually record payment:', err);
      const errMsg = err.message || 'Failed to record transaction';
      setManualErrorMsg(errMsg);
      toast.error('Failed to Save Payment', { description: errMsg });
    } finally {
      setIsSubmittingManual(false);
    }
  };

  const handleToggleStatus = async (paymentId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'flagged' ? 'completed' : 'flagged';
    try {
      await updatePaymentStatus(paymentId, nextStatus as 'completed' | 'flagged');
      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, status: nextStatus as any } : p))
      );
      if (nextStatus === 'flagged') {
        toast.warning('Transaction Flagged', {
          description: `Payment ${paymentId.slice(-8)} marked for administrative review.`,
        });
      } else {
        toast.success('Transaction Completed', {
          description: `Payment ${paymentId.slice(-8)} status cleared to completed.`,
        });
      }
    } catch (err: any) {
      console.error('Failed to toggle payment status:', err);
      toast.error('Status Update Failed', { description: err.message || 'Could not update status.' });
    }
  };

  // Aggregated analytics
  const totalRevenue = payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const razorpayCount = payments.filter((p) => p.gateway === 'razorpay').length;
  const paytmCount = payments.filter((p) => p.gateway === 'paytm').length;
  const flaggedCount = payments.filter((p) => p.status === 'flagged').length;

  const faqs = [
    {
      q: 'Which payment methods are accepted in India and globally?',
      a: 'Via Razorpay, you can pay using UPI (Google Pay, PhonePe, Paytm UPI, BHIM), Indian & International credit/debit cards (Visa, Mastercard, RuPay, Amex), and 50+ NetBanking options. Via Paytm, you can directly scan the dynamic UPI QR or pay using Paytm Wallet.',
    },
    {
      q: 'How does scheduling work once payment is verified?',
      a: 'Upon successful transaction verification, a booking confirmation containing a direct Google Meet / Calendly scheduling link is immediately shown and synced to Firestore. You can pick any convenient 45–90 minute slot.',
    },
    {
      q: 'Is there an official invoice and refund guarantee?',
      a: 'Yes. An official invoice with reference ID and breakdown is generated on-screen with 1-click PDF download/print. If our technical session does not deliver high actionable value, you are entitled to a 100% full refund.',
    },
    {
      q: 'Can I pay a custom token or advance for engineering projects?',
      a: 'Yes. Click "Add / Pay Custom Amount" or choose custom checkout to specify any exact INR advance for freelance development, model training compute, or extended mentorship sprints.',
    },
  ];

  return (
    <section id="consulting" className="py-20 border-t border-slate-800/80 bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="text-sm">🇮🇳</span>
              <span>Razorpay & Paytm Gateways Integrated (INR)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              07. Technical Advisory & 1:1 Sessions
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Book specialized 1:1 sessions for machine learning architecture audits, mock technical interviews, or support open-source research. Instant confirmation via Razorpay and Paytm.
            </p>
          </div>

          {/* Quick Pay CTA & Gateway Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenPaymentModal('quick_consult')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/25 flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Complete Payment (₹600)</span>
            </button>

            <button
              onClick={() => onOpenPaymentModal()}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Custom Amount / Other</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-500/40 text-xs font-mono text-blue-300">
              <Landmark className="w-3.5 h-3.5 text-blue-400" />
              <span>Razorpay (All 50+ Banks & UPI)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>Paytm Gateway</span>
            </div>
          </div>
        </div>

        {/* Pricing & Packages Grid (Full 5 Tiers) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CONSULTATION_PACKAGES.map((pkg: ServicePackage) => {
            const isFeatured = pkg.id === 'code_review';
            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 border ${
                  isFeatured
                    ? 'bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-950 border-blue-500/60 shadow-xl shadow-blue-500/10'
                    : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-7 px-3 py-1 bg-blue-600 text-[10px] font-mono font-bold text-white uppercase tracking-wider rounded-full shadow-md flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-300" />
                    <span>Recommended for Teams</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider">
                      {pkg.tag}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {pkg.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white font-display mb-2">
                    {pkg.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {pkg.description}
                  </p>

                  <div className="space-y-2.5 mb-8 pb-6 border-b border-slate-800/60 text-xs text-slate-300">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-1.5 mb-5">
                    <span className="text-3xl font-extrabold text-white font-display">
                      ₹{pkg.price}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">INR</span>
                    <span className="text-slate-500 text-xs">/ per session</span>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => onOpenPaymentModal(pkg.id)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                        isFeatured
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      <span>Book with Razorpay / Paytm</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-slate-500 text-center">
                      <span>✓ Cards, UPI & Wallets</span>
                      <span>·</span>
                      <span>✓ 100% Refund Guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Retainer & Advance Card */}
        <div className="mt-8 p-6 bg-slate-950/80 border border-slate-800 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display flex items-center gap-2">
                <span>Need a Custom Project Retainer or Enterprise ML Consultancy?</span>
                <span className="text-xs font-mono text-emerald-400">🇮🇳 INR</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pay custom token advances directly in INR through Razorpay standard checkout or Paytm UPI QR.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenPaymentModal(undefined, 600)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pay ₹600 (Quick Checkout)</span>
            </button>
            <button
              onClick={() => onOpenPaymentModal()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Custom Amount</span>
            </button>
          </div>
        </div>

        {/* Payment FAQ Accordion */}
        <div className="mt-12 bg-slate-950/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white font-display">
              Payment & Advisory Guarantee FAQ
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full text-left flex items-start justify-between gap-3 text-xs font-semibold text-slate-200 hover:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed pt-2 border-t border-slate-800/60">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Inbound Transactions Inspection (Owner: kamal19ojha@gmail.com) */}
        {isAdmin && (
          <div className="mt-12 bg-slate-950 border border-blue-900/50 rounded-3xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white font-display">
                  Admin Dashboard: Live Firestore Transactions (`/payments`)
                </h4>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsManualModalOpen(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Record Payment</span>
                </button>
                <button
                  onClick={loadPayments}
                  disabled={loadingTransactions}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Refresh Transactions"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingTransactions ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setShowAdminTab(!showAdminTab)}
                  className="text-xs text-blue-400 hover:underline font-mono"
                >
                  {showAdminTab ? 'Hide Records' : `View (${payments.length}) Payments`}
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/60">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Total Collected</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">₹{totalRevenue.toLocaleString()} INR</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Total Orders</div>
                <div className="text-lg font-bold text-white mt-0.5">{payments.length} Verified</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Razorpay vs Paytm</div>
                <div className="text-xs font-mono text-slate-300 mt-1">
                  <span className="text-blue-400">{razorpayCount} RZP</span> · <span className="text-cyan-400">{paytmCount} PTM</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Flagged / Review</div>
                <div className="text-lg font-bold text-amber-400 mt-0.5">{flaggedCount} Orders</div>
              </div>
            </div>

            {showAdminTab && (
              <div className="overflow-x-auto pt-2">
                {loadingTransactions ? (
                  <div className="text-xs text-slate-400 py-4 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                    <span>Loading transactions from Firestore...</span>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-xs text-slate-500 py-3">No payments recorded yet. Click &quot;+ Record Payment&quot; to add one.</div>
                ) : (
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="text-[11px] font-mono text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Status Flag</th>
                        <th className="pb-2">Customer</th>
                        <th className="pb-2">Purpose</th>
                        <th className="pb-2">Gateway & Bank Channel</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Txn ID / Ref</th>
                        <th className="pb-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {payments.map((p) => {
                        const isFlagged = p.status === 'flagged';
                        return (
                          <tr key={p.id}>
                            <td className="py-2.5 text-slate-400">
                              {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleDateString() : 'Recent'}
                            </td>
                            <td className="py-2.5">
                              {isFlagged ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800/60">
                                  <span>🔴</span>
                                  <span>Flagged</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                                  <span>🟢</span>
                                  <span>Completed</span>
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 font-sans">
                              <div className="font-medium text-white">{p.customerName}</div>
                              <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">{p.customerEmail}</div>
                            </td>
                            <td className="py-2.5 font-sans text-slate-300 max-w-[140px] truncate" title={p.purpose}>{p.purpose}</td>
                            <td className="py-2.5 font-sans">
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                                      p.gateway === 'razorpay'
                                        ? 'bg-blue-900/60 text-blue-300'
                                        : 'bg-cyan-900/60 text-cyan-300'
                                    }`}
                                  >
                                    {p.gateway}
                                  </span>
                                  {p.paymentMethod && (
                                    <span className="text-[9px] font-mono text-slate-400">
                                      {p.paymentMethod}
                                    </span>
                                  )}
                                </div>
                                {p.bank && (
                                  <div className="text-[10px] text-blue-300 flex items-center gap-1 truncate max-w-[170px]" title={p.bank}>
                                    <Landmark className="w-3 h-3 text-blue-400 shrink-0" />
                                    <span className="truncate font-semibold">{p.bank}</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 font-bold text-emerald-400">₹{p.amount}</td>
                            <td className="py-2.5 text-slate-400 text-[10px] truncate max-w-[110px]" title={p.transactionId}>{p.transactionId}</td>
                            <td className="py-2.5 text-right font-sans">
                              <button
                                onClick={() => handleToggleStatus(p.id, p.status || 'completed')}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 hover:text-white rounded flex items-center gap-1 ml-auto"
                                title="Toggle Flag / Complete"
                              >
                                <Flag className={`w-3 h-3 ${isFlagged ? 'text-amber-400' : 'text-slate-400'}`} />
                                <span>{isFlagged ? 'Unflag' : 'Flag'}</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal: Admin Record / Add Payment Form */}
        {isManualModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">
                      Record / Add Payment to Firestore
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Register offline UPI, direct transfer, or verified gateway receipt
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsManualModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRecordManualPayment} className="p-5 space-y-4 text-xs">
                {manualSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300">
                    {manualSuccessMsg}
                  </div>
                )}
                {manualErrorMsg && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300">
                    {manualErrorMsg}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditi Rao"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Customer Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. aditi@org.com"
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Amount (INR) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-500">₹</span>
                      <input
                        type="number"
                        min="1"
                        required
                        value={manualAmount}
                        onChange={(e) => setManualAmount(Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Gateway</label>
                    <select
                      value={manualGateway}
                      onChange={(e) => setManualGateway(e.target.value as 'razorpay' | 'paytm')}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="razorpay">Razorpay</option>
                      <option value="paytm">Paytm</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Purpose / Service</label>
                  <input
                    type="text"
                    required
                    value={manualPurpose}
                    onChange={(e) => setManualPurpose(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Transaction Ref / UTR (Optional)</label>
                  <input
                    type="text"
                    placeholder="Leave blank to auto-generate"
                    value={manualTxnId}
                    onChange={(e) => setManualTxnId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsManualModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingManual}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingManual ? 'Saving...' : 'Save Payment Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
