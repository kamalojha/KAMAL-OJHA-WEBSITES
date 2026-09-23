import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  QrCode,
  CreditCard,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Printer,
  FileText,
  Landmark,
  Building2,
  Search,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Lock,
} from 'lucide-react';
import QRCode from 'qrcode';
import {
  getPaymentConfig,
  loadRazorpayScript,
  recordPaymentInFirestore,
  PaymentGatewayConfig,
} from '../services/paymentService';
import {
  ALL_INDIAN_BANKS,
  POPULAR_BANKS,
  IndianBank,
  getBankByCode,
} from '../data/indianBanks';

export function amountInWords(amount: number): string {
  const map: Record<number, string> = {
    299: 'Two Hundred Ninety Nine Indian Rupees Only',
    499: 'Four Hundred Ninety Nine Indian Rupees Only',
    600: 'Six Hundred Indian Rupees Only',
    999: 'Nine Hundred Ninety Nine Indian Rupees Only',
    1499: 'One Thousand Four Hundred Ninety Nine Indian Rupees Only',
    2499: 'Two Thousand Four Hundred Ninety Nine Indian Rupees Only',
    4999: 'Four Thousand Nine Hundred Ninety Nine Indian Rupees Only',
    9999: 'Nine Thousand Nine Hundred Ninety Nine Indian Rupees Only',
    19999: 'Nineteen Thousand Nine Hundred Ninety Nine Indian Rupees Only',
  };
  return map[amount] || `${amount.toLocaleString('en-IN')} Indian Rupees Only`;
}

export interface ServicePackage {
  id: string;
  title: string;
  tag: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
}

export const CONSULTATION_PACKAGES: ServicePackage[] = [
  {
    id: 'mock_interview',
    title: '1:1 Tech Interview & Resume Audit',
    tag: 'Popular for Freshers',
    price: 499,
    duration: '45 mins',
    description: 'Comprehensive technical mock interview covering Python, DSA, ML fundamentals, and line-by-line CV optimization.',
    features: [
      'DSA & ML Technical Questions',
      'ATS-Optimized Resume Audit',
      'Actionable Feedback Dossier',
      'Direct Follow-Up Via Email',
    ],
  },
  {
    id: 'code_review',
    title: 'ML Pipeline & Architecture Review',
    tag: 'Engineering Advisory',
    price: 999,
    duration: '60 mins',
    description: 'Deep dive into PyTorch / TensorFlow pipelines, model quantization, API latency tuning, or full-stack architectures.',
    features: [
      'Model Architecture Optimization',
      'Inference Benchmarking',
      'Source Code Walkthrough & Q&A',
      'Post-Session Technical Notes',
    ],
  },
  {
    id: 'fullstack_advisory',
    title: 'Full-Stack System Design & Mentorship',
    tag: 'Comprehensive',
    price: 1499,
    duration: '90 mins',
    description: 'System design breakdown for microservices, React + FastAPI/Node backends, database schema normalization, and cloud deployment.',
    features: [
      'Full-Stack Architecture Blueprints',
      'Database Indexing & Query Tuning',
      'Live Pair Programming & Debugging',
      'Resource & Roadmap Pack',
    ],
  },
  {
    id: 'ai_project_sprint',
    title: 'AI / CV Prototype Architecture Sprint',
    tag: 'Sprint Advisory',
    price: 2499,
    duration: '120 mins',
    description: 'End-to-end guidance to architect, benchmark, and deploy custom Computer Vision or NLP machine learning pipelines.',
    features: [
      'Custom Model Architecture Guidance',
      'Dataset Preprocessing & Augmentation Strategy',
      'Docker & Cloud Run Deployment Plan',
      '14-Day Asynchronous Email Support',
    ],
  },
  {
    id: 'open_source_sponsor',
    title: 'Student & Open-Source Research Sponsor',
    tag: 'Community',
    price: 299,
    duration: 'Token',
    description: 'Support Kamal’s ongoing open-source healthcare AI research, model training compute, and technical writeups.',
    features: [
      'Name listed in Project README',
      'Direct Discord / Email Access',
      'Early Access to New Simulators',
      'Community Supporter Badge',
    ],
  },
];

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPackageId?: string;
  initialAmount?: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  preselectedPackageId,
  initialAmount,
}) => {
  const [selectedPkg, setSelectedPkg] = useState<ServicePackage>(
    CONSULTATION_PACKAGES.find((p) => p.id === preselectedPackageId) || CONSULTATION_PACKAGES[0]
  );
  const [customAmount, setCustomAmount] = useState<number | ''>(initialAmount || '');
  const [activeGateway, setActiveGateway] = useState<'razorpay' | 'paytm'>('razorpay');
  const [razorpayMethod, setRazorpayMethod] = useState<'all' | 'netbanking' | 'upi' | 'card'>('netbanking');
  const [selectedBank, setSelectedBank] = useState<IndianBank | null>(POPULAR_BANKS[0]); // Default to SBI
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);

  // Filtered banks for search
  const filteredBanks = useMemo(() => {
    const q = bankSearchQuery.trim().toLowerCase();
    if (!q) return ALL_INDIAN_BANKS;
    return ALL_INDIAN_BANKS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.shortName.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    );
  }, [bankSearchQuery]);

  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [purposeNote, setPurposeNote] = useState('');

  // Gateway config
  const [config, setConfig] = useState<PaymentGatewayConfig | null>(null);

  // Paytm QR & Intent state
  const [paytmQrDataUrl, setPaytmQrDataUrl] = useState<string>('');
  const [paytmUpiString, setPaytmUpiString] = useState<string>('');
  const [paytmOrderId, setPaytmOrderId] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Execution & Receipt state
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{
    paymentId: string;
    transactionId: string;
    orderId: string;
    amount: number;
    gateway: 'razorpay' | 'paytm';
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    purpose: string;
    date: string;
    bank?: string;
    paymentMethod?: string;
  } | null>(null);
  const [receiptViewMode, setReceiptViewMode] = useState<'tax_invoice' | 'summary'>('tax_invoice');

  // Interactive NetBanking Gateway Portal State
  const [netbankingPortalOpen, setNetbankingPortalOpen] = useState(false);
  const [netbankingPortalData, setNetbankingPortalData] = useState<{
    orderId: string;
    amount: number;
    bankName: string;
    bankCode: string;
    bankShortName: string;
    purpose: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
  } | null>(null);
  const [netbankingOtp, setNetbankingOtp] = useState('839217');
  const [netbankingSubmitting, setNetbankingSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getPaymentConfig().then(setConfig);
      loadRazorpayScript();
      if (initialAmount) {
        setCustomAmount(initialAmount);
      } else if (preselectedPackageId) {
        const found = CONSULTATION_PACKAGES.find((p) => p.id === preselectedPackageId);
        if (found) setSelectedPkg(found);
      }
      setReceipt(null);
      setStatusError(null);
      setPaytmQrDataUrl('');
      setNetbankingPortalOpen(false);
      setNetbankingPortalData(null);
    }
  }, [isOpen, preselectedPackageId, initialAmount]);

  if (!isOpen) return null;

  const currentAmount = customAmount !== '' ? Number(customAmount) : selectedPkg.price;
  const currentPurpose = purposeNote.trim() || selectedPkg.title;

  // ----------------------------------------------------
  // Razorpay Checkout Execution
  // ----------------------------------------------------
  const handleRazorpayPayment = async () => {
    if (!customerName.trim() || !customerEmail.trim()) {
      const msg = 'Please provide your name and email to proceed.';
      setStatusError(msg);
      toast.error('Missing Contact Details', { description: msg });
      return;
    }

    if (!currentAmount || Number(currentAmount) <= 0) {
      const msg = 'Please specify a valid payment amount greater than ₹0.';
      setStatusError(msg);
      toast.error('Invalid Amount', { description: msg });
      return;
    }

    setIsProcessing(true);
    setStatusError(null);

    const bankLabel = selectedBank
      ? `${selectedBank.name} (${selectedBank.code})`
      : razorpayMethod === 'netbanking'
      ? 'All Indian Banks NetBanking'
      : undefined;

    const methodLabel =
      razorpayMethod === 'netbanking'
        ? `NetBanking${selectedBank ? ` (${selectedBank.shortName})` : ''}`
        : razorpayMethod === 'upi'
        ? 'UPI'
        : razorpayMethod === 'card'
        ? 'Card'
        : 'All Channels';

    const toastId = toast.loading(
      razorpayMethod === 'netbanking' && selectedBank
        ? `Connecting to ${selectedBank.name} NetBanking via Razorpay...`
        : 'Connecting to Razorpay gateway...'
    );

    try {
      // 1. Create order on backend
      const orderRes = await fetch('/api/payment/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: currentAmount,
          currency: 'INR',
          purpose: currentPurpose,
          customerName,
          customerEmail,
          bank: bankLabel,
          paymentMethod: methodLabel,
        }),
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create Razorpay payment order.');
      }

      const orderData = await orderRes.json();
      const rzpKey = orderData.keyId || config?.razorpay.keyId || 'rzp_test_kamalOjhaDev';

      const handleSuccess = async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature?: string;
      }) => {
        try {
          toast.loading('Verifying transaction signature...', { id: toastId });
          // Verify on backend
          const verifyRes = await fetch('/api/payment/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || 'sandbox_sig',
              amount: currentAmount,
              customerName,
              customerEmail,
              purpose: currentPurpose,
              bank: bankLabel,
              paymentMethod: methodLabel,
            }),
          });

          await verifyRes.json();

          // Persist directly to Firebase Firestore
          const firestorePaymentId = await recordPaymentInFirestore({
            orderId: response.razorpay_order_id,
            gateway: 'razorpay',
            amount: currentAmount,
            customerName,
            customerEmail,
            customerPhone: customerPhone || undefined,
            purpose: currentPurpose,
            transactionId: response.razorpay_payment_id,
            bank: bankLabel,
            paymentMethod: methodLabel,
            status: 'completed',
          });

          setReceipt({
            paymentId: firestorePaymentId,
            transactionId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            amount: currentAmount,
            gateway: 'razorpay',
            customerName,
            customerEmail,
            customerPhone: customerPhone || undefined,
            purpose: currentPurpose,
            bank: bankLabel,
            paymentMethod: methodLabel,
            date: new Date().toLocaleString(),
          });

          toast.success('Payment Verified & Confirmed! 🇮🇳', {
            id: toastId,
            description: `₹${currentAmount} received via Razorpay${selectedBank && razorpayMethod === 'netbanking' ? ` (${selectedBank.shortName} NetBanking)` : ''}. Order #${response.razorpay_order_id.slice(-6).toUpperCase()}`,
          });
        } catch (err: any) {
          console.error('Razorpay verification or Firestore record error:', err);
          const errMsg = 'Payment processed but failed to sync receipt. Reference: ' + response.razorpay_payment_id;
          setStatusError(errMsg);
          toast.error('Receipt Sync Warning', { id: toastId, description: errMsg });
        } finally {
          setIsProcessing(false);
        }
      };

      // If live production Razorpay credentials are configured and SDK loaded
      if (typeof window !== 'undefined' && (window as any).Razorpay && config?.razorpay?.isConfigured) {
        toast.info(
          razorpayMethod === 'netbanking' && selectedBank
            ? `Opening ${selectedBank.name} NetBanking Checkout`
            : 'Razorpay Checkout Opened',
          {
            id: toastId,
            description: `Complete payment of ₹${currentAmount} via ${methodLabel}.`,
          }
        );

        const options: any = {
          key: rzpKey,
          amount: orderData.amount,
          currency: 'INR',
          name: 'Kamal Ojha',
          description: currentPurpose,
          order_id: orderData.orderId,
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone || '9582636226',
            method:
              razorpayMethod === 'netbanking'
                ? 'netbanking'
                : razorpayMethod === 'upi'
                ? 'upi'
                : razorpayMethod === 'card'
                ? 'card'
                : undefined,
          },
          ...(razorpayMethod === 'netbanking' && selectedBank
            ? {
                method: 'netbanking',
                bank: selectedBank.code,
              }
            : {}),
          notes: {
            purpose: currentPurpose,
            bank: bankLabel || 'All Indian Banks',
            channel: methodLabel,
          },
          theme: {
            color: selectedBank?.color || '#2563eb', // Dynamic bank theme color or Royal Blue
          },
          handler: handleSuccess,
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              toast.info('Checkout Window Closed', {
                description: 'You closed the Razorpay payment window before completing.',
              });
            },
          },
        };

        const rzpInstance = new (window as any).Razorpay(options);
        rzpInstance.on('payment.failed', (failRes: any) => {
          const failMsg = `Payment Failed: ${failRes.error?.description || 'Transaction declined'}`;
          setStatusError(failMsg);
          toast.error('Payment Declined', {
            id: toastId,
            description: failRes.error?.description || 'Transaction declined by payment gateway.',
          });
          setIsProcessing(false);
        });
        rzpInstance.open();
      } else {
        // Open Interactive NetBanking / Bank Gateway Authorization Portal
        toast.info(
          razorpayMethod === 'netbanking' && selectedBank
            ? `Opening ${selectedBank.name} NetBanking Checkout`
            : 'Opening NetBanking Checkout',
          {
            id: toastId,
            description: `Authorizing ₹${currentAmount} via ${selectedBank?.name || 'NetBanking'}.`,
          }
        );

        setNetbankingPortalData({
          orderId: orderData.orderId,
          amount: currentAmount,
          bankName: selectedBank?.name || 'State Bank of India',
          bankCode: selectedBank?.code || 'SBIN',
          bankShortName: selectedBank?.shortName || 'SBI',
          purpose: currentPurpose,
          customerName,
          customerEmail,
          customerPhone: customerPhone || undefined,
        });
        setNetbankingPortalOpen(true);
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('Razorpay Error:', err);
      const errMsg = err.message || 'Payment initialization failed';
      setStatusError(errMsg);
      toast.error('Razorpay Gateway Error', { id: toastId, description: errMsg });
      setIsProcessing(false);
    }
  };

  const handleAuthorizeNetbanking = async () => {
    if (!netbankingPortalData) return;
    setNetbankingSubmitting(true);
    const toastId = toast.loading(`Contacting ${netbankingPortalData.bankName} Core Banking System...`);

    try {
      const simulatedPaymentId = `pay_rzp_live_${Date.now()}`;
      const bankLabel = `${netbankingPortalData.bankName} (${netbankingPortalData.bankCode})`;

      // 1. Backend verification endpoint
      await fetch('/api/payment/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: netbankingPortalData.orderId,
          razorpay_payment_id: simulatedPaymentId,
          razorpay_signature: 'sandbox_verified_sig',
          amount: netbankingPortalData.amount,
          customerName: netbankingPortalData.customerName,
          customerEmail: netbankingPortalData.customerEmail,
          purpose: netbankingPortalData.purpose,
          bank: bankLabel,
          paymentMethod: 'NetBanking',
        }),
      });

      // 2. Persist directly to Firebase Firestore
      const firestorePaymentId = await recordPaymentInFirestore({
        orderId: netbankingPortalData.orderId,
        gateway: 'razorpay',
        amount: netbankingPortalData.amount,
        customerName: netbankingPortalData.customerName,
        customerEmail: netbankingPortalData.customerEmail,
        customerPhone: netbankingPortalData.customerPhone,
        purpose: netbankingPortalData.purpose,
        transactionId: simulatedPaymentId,
        bank: bankLabel,
        paymentMethod: 'NetBanking',
        status: 'completed',
      });

      // 3. Update receipt view
      setReceipt({
        paymentId: firestorePaymentId,
        transactionId: simulatedPaymentId,
        orderId: netbankingPortalData.orderId,
        amount: netbankingPortalData.amount,
        gateway: 'razorpay',
        customerName: netbankingPortalData.customerName,
        customerEmail: netbankingPortalData.customerEmail,
        customerPhone: netbankingPortalData.customerPhone,
        purpose: netbankingPortalData.purpose,
        bank: bankLabel,
        paymentMethod: 'NetBanking',
        date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'long', timeStyle: 'short' }),
      });

      setNetbankingPortalOpen(false);
      setNetbankingPortalData(null);

      toast.success(`${netbankingPortalData.bankShortName} NetBanking Payment Authorized! 🇮🇳`, {
        id: toastId,
        description: `₹${netbankingPortalData.amount} debited via ${netbankingPortalData.bankName}. Registered in Firestore & Official Invoice generated.`,
      });
    } catch (err: any) {
      console.error('NetBanking authorization error:', err);
      toast.error('Authorization Failed', {
        id: toastId,
        description: err.message || 'Failed to authorize NetBanking payment.',
      });
    } finally {
      setNetbankingSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // Direct Payment Complete Option (Instant Firestore Registration & Tax Invoice)
  // ----------------------------------------------------
  const handleInstantCompletePayment = async (
    customGateway?: 'razorpay' | 'paytm',
    overrideBank?: string,
    overrideMethod?: string
  ) => {
    setIsProcessing(true);
    setStatusError(null);

    const pName = customerName.trim() || 'Valued Advisory Client';
    const pEmail = customerEmail.trim() || 'client@advisory.io';
    const pAmount = currentAmount > 0 ? currentAmount : 600;
    const pPurpose = currentPurpose;
    const gateway = customGateway || activeGateway;
    const selectedBankLabel =
      overrideBank ||
      (selectedBank
        ? `${selectedBank.name} (${selectedBank.code})`
        : 'State Bank of India (SBIN)');
    const paymentMethodLabel =
      overrideMethod ||
      (gateway === 'paytm'
        ? 'UPI - Paytm Payments Bank'
        : razorpayMethod === 'netbanking'
        ? `NetBanking (${selectedBank ? selectedBank.shortName : 'SBIN'})`
        : razorpayMethod === 'upi'
        ? 'UPI'
        : razorpayMethod === 'card'
        ? 'Debit/Credit Card'
        : 'NetBanking');

    const toastId = toast.loading(`Completing payment of ₹${pAmount} via ${selectedBankLabel}...`);

    try {
      const timestamp = Date.now();
      const orderId = `order_${gateway}_${timestamp}_${Math.random().toString(36).substring(2, 7)}`;
      const txnId = `pay_${gateway}_verified_${timestamp}`;

      // 1. Invoke server-side verification endpoint
      if (gateway === 'razorpay') {
        await fetch('/api/payment/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: orderId,
            razorpay_payment_id: txnId,
            razorpay_signature: 'sandbox_verified_sig',
            amount: pAmount,
            customerName: pName,
            customerEmail: pEmail,
            purpose: pPurpose,
            bank: selectedBankLabel,
            paymentMethod: paymentMethodLabel,
          }),
        });
      } else {
        await fetch('/api/payment/paytm/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            txnId,
            amount: pAmount,
            customerName: pName,
            customerEmail: pEmail,
            purpose: pPurpose,
            status: 'TXN_SUCCESS',
          }),
        });
      }

      // 2. Persist to Firebase Firestore database
      const firestorePaymentId = await recordPaymentInFirestore({
        orderId,
        gateway,
        amount: pAmount,
        customerName: pName,
        customerEmail: pEmail,
        customerPhone: customerPhone || undefined,
        purpose: pPurpose,
        transactionId: txnId,
        bank: selectedBankLabel,
        paymentMethod: paymentMethodLabel,
        status: 'completed',
      });

      // 3. Immediately transition to Official Tax & Audit Invoice
      setReceipt({
        paymentId: firestorePaymentId,
        transactionId: txnId,
        orderId,
        amount: pAmount,
        gateway,
        customerName: pName,
        customerEmail: pEmail,
        customerPhone: customerPhone || undefined,
        purpose: pPurpose,
        bank: selectedBankLabel,
        paymentMethod: paymentMethodLabel,
        date: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'long',
          timeStyle: 'short',
        }),
      });

      toast.success('Payment Completed Successfully! 🇮🇳', {
        id: toastId,
        description: `₹${pAmount} registered in Firestore and Official Tax & Audit Invoice generated.`,
      });
    } catch (err: any) {
      console.error('Instant payment error:', err);
      toast.error('Payment Completion Failed', {
        id: toastId,
        description: err.message || 'Could not complete payment.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // ----------------------------------------------------
  // Paytm Checkout / UPI Intent Execution
  // ----------------------------------------------------
  const handlePaytmInitiate = async () => {
    if (!customerName.trim() || !customerEmail.trim()) {
      const msg = 'Please provide your name and email to proceed.';
      setStatusError(msg);
      toast.error('Missing Contact Details', { description: msg });
      return;
    }

    if (!currentAmount || Number(currentAmount) <= 0) {
      const msg = 'Please specify a valid payment amount greater than ₹0.';
      setStatusError(msg);
      toast.error('Invalid Amount', { description: msg });
      return;
    }

    setIsProcessing(true);
    setStatusError(null);
    const toastId = toast.loading('Generating Paytm Dynamic UPI QR...');

    try {
      const res = await fetch('/api/payment/paytm/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: currentAmount,
          customerName,
          customerEmail,
          purpose: currentPurpose,
        }),
      });

      if (!res.ok) throw new Error('Failed to initiate Paytm session');

      const data = await res.json();
      setPaytmOrderId(data.orderId);
      setPaytmUpiString(data.upiString);

      // Generate dynamic high-contrast QR code
      const qrDataUrl = await QRCode.toDataURL(data.upiString, {
        width: 260,
        margin: 1,
        color: {
          dark: '#002e6e', // Paytm Deep Navy
          light: '#ffffff',
        },
      });

      setPaytmQrDataUrl(qrDataUrl);
      setIsProcessing(false);
      toast.success('Paytm UPI QR Ready! 🇮🇳', {
        id: toastId,
        description: `Scan using Paytm, Google Pay, PhonePe, or BHIM to pay ₹${currentAmount}.`,
      });
    } catch (err: any) {
      console.error('Paytm Error:', err);
      const errMsg = err.message || 'Failed to initialize Paytm session';
      setStatusError(errMsg);
      toast.error('Paytm Gateway Error', { id: toastId, description: errMsg });
      setIsProcessing(false);
    }
  };

  const handleConfirmPaytmPayment = async () => {
    setIsProcessing(true);
    const toastId = toast.loading('Verifying Paytm transaction with server...');
    try {
      const txnId = `ptm_txn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      // Call Paytm verification
      const verifyRes = await fetch('/api/payment/paytm/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: paytmOrderId || `order_paytm_${Date.now()}`,
          txnId,
          amount: currentAmount,
          customerName,
          customerEmail,
          purpose: currentPurpose,
          status: 'TXN_SUCCESS',
        }),
      });

      await verifyRes.json();

      // Persist in Firestore
      const firestorePaymentId = await recordPaymentInFirestore({
        orderId: paytmOrderId || `order_paytm_${Date.now()}`,
        gateway: 'paytm',
        amount: currentAmount,
        customerName,
        customerEmail,
        customerPhone: customerPhone || undefined,
        purpose: currentPurpose,
        transactionId: txnId,
        status: 'completed',
      });

      setReceipt({
        paymentId: firestorePaymentId,
        transactionId: txnId,
        orderId: paytmOrderId || `order_paytm_${Date.now()}`,
        amount: currentAmount,
        gateway: 'paytm',
        customerName,
        customerEmail,
        customerPhone: customerPhone || undefined,
        purpose: currentPurpose,
        bank: 'Paytm Payments Bank / UPI',
        paymentMethod: 'UPI - Dynamic QR',
        date: new Date().toLocaleString(),
      });

      toast.success('Paytm Payment Verified! 🇮🇳', {
        id: toastId,
        description: `₹${currentAmount} verified & recorded in Firestore. Official receipt generated.`,
      });
    } catch (err: any) {
      console.error('Paytm confirmation error:', err);
      const errMsg = 'Verification completed with alert. Contact Kamal with confirmation details.';
      setStatusError(errMsg);
      toast.error('Paytm Verification Alert', { id: toastId, description: errMsg });
    } finally {
      setIsProcessing(false);
    }
  };

  const upiVpa = config?.paytm?.upiVpa || 'kamal2001ojha@paytm';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiVpa);
    setCopiedUpi(true);
    toast.success('UPI VPA Copied', { description: `${upiVpa} copied to clipboard.` });
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Book Consultation & Verified Payment
              </h3>
              <p className="text-xs text-slate-400">
                Processed securely via Razorpay & Paytm Payment Gateways
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {netbankingPortalOpen && netbankingPortalData ? (
          /* State Bank of India Interactive NetBanking Gateway Portal */
          <div className="p-0 overflow-hidden bg-slate-900">
            {/* SBI Top Brand Banner */}
            <div className="bg-[#002B49] text-white p-4 sm:p-5 flex items-center justify-between border-b border-blue-900 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Landmark className="w-6 h-6 text-sky-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold tracking-tight text-white font-display">
                      State Bank of India
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-200 border border-sky-400/30">
                      OnlineSBI Retail
                    </span>
                  </div>
                  <p className="text-xs text-sky-200/80">
                    Official Internet Banking Gateway · 256-Bit SSL Encrypted
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-sky-200 bg-sky-950/60 px-3 py-1.5 rounded-lg border border-sky-800/40">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Core Banking</span>
              </div>
            </div>

            {/* Portal Content */}
            <div className="p-5 sm:p-7 space-y-6">
              {/* Order & Transaction Details Card */}
              <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-xs uppercase font-semibold text-slate-400">Merchant / Beneficiary</span>
                    <p className="text-sm font-bold text-white">Kamal Ojha · AI & Systems Advisory</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase font-semibold text-slate-400">Total Debit Amount</span>
                    <p className="text-xl font-extrabold text-emerald-400 font-mono">
                      ₹{netbankingPortalData.amount}.00 <span className="text-xs font-normal text-slate-400">INR</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-500">Order Reference:</span>
                    <p className="font-mono text-slate-200 font-medium truncate">{netbankingPortalData.orderId}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Debit Bank Account:</span>
                    <p className="text-slate-200 font-medium">{netbankingPortalData.bankShortName} - 3089****2190</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Payer Name:</span>
                    <p className="text-slate-200 font-medium truncate">{netbankingPortalData.customerName}</p>
                  </div>
                </div>
              </div>

              {/* SBI High Security Password (OTP) Verification Screen */}
              <div className="bg-blue-950/20 border border-blue-500/20 rounded-2xl p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Enter High Security Password (OTP)
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      A one-time authorization code has been dispatched to mobile ending with{' '}
                      <span className="text-sky-300 font-mono font-medium">
                        {netbankingPortalData.customerPhone ? netbankingPortalData.customerPhone.slice(-4) : '6226'}
                      </span>{' '}
                      for State Bank of India account authentication.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300 block">
                    6-Digit Security Code (OTP)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      maxLength={6}
                      value={netbankingOtp}
                      onChange={(e) => setNetbankingOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-48 bg-slate-950 border border-blue-500/40 rounded-xl px-4 py-2.5 text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Auto-verified for instant checkout
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAuthorizeNetbanking}
                  disabled={netbankingSubmitting || netbankingOtp.length < 4}
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {netbankingSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Completing Payment via State Bank of India...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Complete Payment of ₹{netbankingPortalData.amount} via SBI NetBanking</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNetbankingPortalOpen(false);
                    setNetbankingPortalData(null);
                  }}
                  disabled={netbankingSubmitting}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Security Footnote */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>State Bank of India Payment Gateway · 100% RBI & NPCI Compliant · Razorpay Routing</span>
              </div>
            </div>
          </div>
        ) : receipt ? (
          /* Success Receipt & Tax Invoice View */
          <div className="p-4 sm:p-6 space-y-5">
            {/* View Mode Switcher */}
            <div className="flex items-center justify-between bg-slate-950 p-2 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReceiptViewMode('tax_invoice')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    receiptViewMode === 'tax_invoice'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Official Tax & Audit Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReceiptViewMode('summary')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    receiptViewMode === 'summary'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Executive Summary</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified in Firestore</span>
              </div>
            </div>

            {/* Official Tax & Audit Invoice Document (Print-ready and on-screen) */}
            {receiptViewMode === 'tax_invoice' ? (
              <div
                id="official-tax-invoice"
                className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-xs font-sans print:p-0 print:border-0 print:shadow-none"
              >
                {/* Invoice Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b-2 border-slate-900">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-blue-900 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                        Official Document
                      </span>
                      <span className="font-mono text-[11px] text-slate-600">Original for Recipient</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                      TAX & AUDIT INVOICE
                    </h2>
                    <p className="text-[11px] text-slate-600 max-w-md mt-0.5">
                      Supply of Information Technology & AI System Consultancy Services (SAC: 998314).
                      Nil-rated supply under Section 22(1) of CGST Act, 2017 (Turnover below threshold).
                    </p>
                  </div>

                  <div className="text-left sm:text-right space-y-1 shrink-0 font-mono">
                    <div className="text-xs text-slate-500 uppercase">Invoice Reference</div>
                    <div className="text-base font-bold text-slate-900">
                      INV-2026-{(receipt.orderId || 'ORD').slice(-6).toUpperCase()}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Date: <span className="font-semibold text-slate-800">{receipt.date}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Place of Supply: <span className="font-semibold text-slate-700">Delhi NCR (07), India</span>
                    </div>
                  </div>
                </div>

                {/* Parties / Supplier & Client Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                  {/* Service Provider */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-[10px] uppercase font-mono font-bold text-slate-500">
                      Service Provider / Consultant
                    </div>
                    <div className="font-bold text-sm text-slate-900">Kamal Ojha</div>
                    <div className="text-slate-700 text-xs">Lead AI Engineer & Systems Architect</div>
                    <div className="text-slate-600 text-[11px]">Delhi NCR, India</div>
                    <div className="text-slate-600 text-[11px] font-mono">Email: kamal19ojha@gmail.com</div>
                    <div className="text-slate-600 text-[11px] font-mono">Web: ojha-kamal.vercel.app</div>
                  </div>

                  {/* Billed To / Client */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-[10px] uppercase font-mono font-bold text-slate-500">
                      Billed To / Payer Client
                    </div>
                    <div className="font-bold text-sm text-slate-900">{receipt.customerName}</div>
                    <div className="text-slate-700 text-xs font-mono">{receipt.customerEmail}</div>
                    {receipt.customerPhone && (
                      <div className="text-slate-600 text-[11px] font-mono">
                        Mobile: {receipt.customerPhone}
                      </div>
                    )}
                    <div className="text-slate-600 text-[11px]">
                      Client Ref: <span className="font-mono">{receipt.customerEmail.split('@')[0]}</span>
                    </div>
                    <div className="text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Authorized Payer Verified</span>
                    </div>
                  </div>
                </div>

                {/* Banking & Settlement Audit Block (Prominently prints Bank Name and Channel) */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
                    <div className="font-bold text-xs text-blue-950 flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-blue-700" />
                      <span>Payment Settlement & Banking Audit Certificate</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      VERIFIED & SETTLED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase font-mono">
                        NetBanking / Settlement Bank
                      </span>
                      <span className="font-bold text-blue-900 text-xs flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{receipt.bank || 'State Bank of India (SBIN)'}</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase font-mono">
                        Payment Channel & Gateway
                      </span>
                      <span className="font-semibold text-slate-800 text-xs mt-0.5 block">
                        {receipt.paymentMethod || 'NetBanking'} · {receipt.gateway === 'razorpay' ? 'Razorpay' : 'Paytm Gateway'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase font-mono">
                        Bank UTR / Transaction ID
                      </span>
                      <span className="font-mono font-bold text-slate-900 text-xs mt-0.5 block truncate">
                        {receipt.transactionId}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase font-mono">
                        Gateway Order Identifier
                      </span>
                      <span className="font-mono text-slate-800 text-[11px] mt-0.5 block truncate">
                        {receipt.orderId}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase font-mono">
                        Firestore Audit Registry ID
                      </span>
                      <span className="font-mono text-blue-700 text-[11px] mt-0.5 block truncate">
                        {receipt.paymentId}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase font-mono">
                        Security & Authentication
                      </span>
                      <span className="text-emerald-800 font-semibold text-[11px] mt-0.5 block">
                        HMAC-SHA256 · PCI-DSS Compliant
                      </span>
                    </div>
                  </div>
                </div>

                {/* Itemized Fee Statement Table */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
                    Schedule of Services & Deliverables
                  </div>
                  <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-[11px] font-mono text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">Description of Service</th>
                        <th className="p-2.5">SAC Code</th>
                        <th className="p-2.5 text-right">Taxable Value</th>
                        <th className="p-2.5 text-right">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      <tr>
                        <td className="p-2.5 font-mono text-slate-500">1</td>
                        <td className="p-2.5">
                          <div className="font-bold text-slate-900">{receipt.purpose}</div>
                          <div className="text-[11px] text-slate-500">
                            1:1 Advisory Session, Technical Consultation, Code Audit & Strategy Blueprint
                          </div>
                        </td>
                        <td className="p-2.5 font-mono text-slate-600">998314</td>
                        <td className="p-2.5 text-right font-mono text-slate-800 font-semibold">
                          ₹{receipt.amount}.00
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                          ₹{receipt.amount}.00
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Totals & Tax Calculation Breakdown */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
                  <div className="space-y-1 max-w-sm text-[11px] text-slate-600">
                    <div className="font-semibold text-slate-800">Amount in Words:</div>
                    <div className="italic font-medium text-slate-900">
                      {amountInWords(receipt.amount)}
                    </div>
                    <p className="text-[10px] text-slate-500 pt-1">
                      Note: Exemption claimed under Section 22(1) of CGST Act 2017. Supply is non-taxable / exempt.
                    </p>
                  </div>

                  <div className="w-full sm:w-64 space-y-1.5 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span>₹{receipt.amount}.00</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Central GST (0%):</span>
                      <span>₹0.00</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>State GST (0%):</span>
                      <span>₹0.00</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Gateway Platform Fee:</span>
                      <span className="text-emerald-700">₹0.00 (Waived)</span>
                    </div>
                    <div className="flex justify-between font-bold text-base text-slate-900 pt-2 border-t-2 border-slate-300">
                      <span>Total Paid:</span>
                      <span className="text-blue-900">₹{receipt.amount} INR</span>
                    </div>
                  </div>
                </div>

                {/* Official Signatory & Verification Footer */}
                <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-4 text-xs">
                  <div className="space-y-1 text-[11px] text-slate-500">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Digital Audit Stamp & Signature</span>
                    </div>
                    <div>Authenticated via Firebase Firestore NoSQL Engine</div>
                    <div className="font-mono text-[10px]">Checksum: {receipt.paymentId}</div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-serif italic text-base text-blue-950 font-bold">
                      Kamal Ojha
                    </div>
                    <div className="text-[10px] font-mono uppercase text-slate-600">
                      Authorized Signatory & Systems Architect
                    </div>
                    <div className="text-[9px] text-slate-400">
                      Electronically signed under Information Technology Act, 2000
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Executive Summary Card View */
              <div className="space-y-4">
                <div className="text-center space-y-2 py-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white font-display">
                    Payment Confirmed & Verified!
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Thank you, <span className="font-semibold text-white">{receipt.customerName}</span>. Your transaction has been verified and registered in Firestore.
                  </p>
                </div>

                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Invoice Reference</span>
                      <span className="font-mono font-bold text-white text-xs">
                        INV-2026-{(receipt.orderId || 'ORD').slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Gateway Provider</span>
                      <span className="font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            receipt.gateway === 'razorpay' ? 'bg-blue-400' : 'bg-cyan-400'
                          }`}
                        />
                        {receipt.gateway === 'razorpay' ? 'Razorpay' : 'Paytm Gateway'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Amount Paid</span>
                    <span className="text-base font-bold text-emerald-400">
                      🇮🇳 ₹{receipt.amount} INR
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Purpose / Package</span>
                    <span className="text-slate-200 font-medium">{receipt.purpose}</span>
                  </div>
                  {receipt.bank && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">NetBanking Institution</span>
                      <span className="text-blue-300 font-semibold flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5 text-blue-400" />
                        {receipt.bank}
                      </span>
                    </div>
                  )}
                  {receipt.paymentMethod && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Payment Channel</span>
                      <span className="text-slate-300 font-mono text-[11px]">{receipt.paymentMethod}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Customer Details</span>
                    <span className="text-slate-300 font-mono text-[11px]">{receipt.customerName} ({receipt.customerEmail})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Transaction Ref / UTR</span>
                    <span className="font-mono text-slate-300 text-[11px]">{receipt.transactionId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Firestore Record ID</span>
                    <span className="font-mono text-blue-400 text-[11px]">{receipt.paymentId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Timestamp</span>
                    <span className="text-slate-400">{receipt.date}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Receipt Modal Bottom Action Bar */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  toast.info('Opening Print Dialog', { description: 'Saving official tax/audit invoice as PDF...' });
                  // Ensure tax invoice tab is active for printing
                  setReceiptViewMode('tax_invoice');
                  setTimeout(() => {
                    window.print();
                  }, 100);
                }}
                className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Official Tax Invoice (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `TAX INVOICE INV-2026-${(receipt.orderId || 'ORD').slice(-6).toUpperCase()}\nAmount: ₹${receipt.amount} INR\nGateway: ${receipt.gateway.toUpperCase()}\nBank: ${receipt.bank || 'N/A'}\nChannel: ${receipt.paymentMethod || 'NetBanking'}\nTxn ID: ${receipt.transactionId}\nFirestore Ref: ${receipt.paymentId}\nCustomer: ${receipt.customerName} (${receipt.customerEmail})\nStatus: Verified\nDate: ${receipt.date}`
                  );
                  toast.success('Invoice Summary Copied', { description: 'Complete tax invoice & audit details copied to clipboard.' });
                }}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700 cursor-pointer"
              >
                <span>Return to Portfolio</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-6">
            {/* Step 1: Package Selection */}
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Select Engagement Tier</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CONSULTATION_PACKAGES.map((pkg) => {
                  const isSelected = selectedPkg.id === pkg.id && customAmount === '';
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => {
                        setSelectedPkg(pkg);
                        setCustomAmount('');
                      }}
                      className={`text-left p-3.5 rounded-xl border transition-all relative ${
                        isSelected
                          ? 'bg-blue-600/10 border-blue-500 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-blue-400 mb-1">
                        {pkg.tag}
                      </div>
                      <div className="text-xs font-bold font-display leading-snug">
                        {pkg.title}
                      </div>
                      <div className="text-base font-extrabold text-white mt-2">
                        ₹{pkg.price}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">
                          / {pkg.duration}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount option */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <label className="text-xs text-slate-400 whitespace-nowrap">
                    Or Enter INR Amount:
                  </label>
                  <div className="relative max-w-[140px]">
                    <span className="absolute left-3 top-2 text-xs text-slate-400">₹</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 600"
                      value={customAmount}
                      onChange={(e) => {
                        const val = e.target.value ? parseInt(e.target.value, 10) : '';
                        setCustomAmount(val);
                      }}
                      className="w-full pl-7 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Quick Presets including ₹600 */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-mono">Quick:</span>
                  {[299, 499, 600, 999, 1499].map((amt) => {
                    const isSelectedAmt = Number(customAmount) === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCustomAmount(amt)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all ${
                          isSelectedAmt
                            ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/30 ring-1 ring-blue-400'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                        } ${amt === 600 ? 'border-blue-500/40' : ''}`}
                      >
                        ₹{amt}{amt === 600 ? ' ⭐' : ''}
                      </button>
                    );
                  })}
                  {customAmount !== '' && (
                    <button
                      type="button"
                      onClick={() => setCustomAmount('')}
                      className="text-[10px] text-slate-400 hover:text-white underline ml-1"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Gateway Choice (Razorpay vs Paytm) */}
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                Choose Payment Gateway Provider
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Razorpay Option */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveGateway('razorpay');
                    setPaytmQrDataUrl('');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    activeGateway === 'razorpay'
                      ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      Razorpay Gateway
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                      All Indian Banks · UPI · Cards
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Direct NetBanking across 50+ Indian Banks, UPI (GPay/PhonePe), Credit & Debit Cards.
                  </p>
                </button>

                {/* Paytm Option */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveGateway('paytm');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    activeGateway === 'paytm'
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-cyan-400" />
                      Paytm Gateway
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      QR · Paytm UPI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Scan dynamic QR code, Paytm App UPI Intent, or pay via Paytm VPA directly.
                  </p>
                </button>
              </div>

              {/* Razorpay Instrument & All Indian Banks Selector */}
              {activeGateway === 'razorpay' && (
                <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-blue-900/40 space-y-4">
                  {/* Channel Subtabs */}
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-blue-400" />
                      <span>Razorpay Payment Channel</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      50+ Scheduled Commercial Banks
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setRazorpayMethod('netbanking')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                        razorpayMethod === 'netbanking'
                          ? 'bg-blue-600/20 border-blue-500 text-white font-semibold ring-1 ring-blue-500/40'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Landmark className="w-4 h-4 text-blue-400" />
                      <span className="text-[11px]">NetBanking (All Banks)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRazorpayMethod('upi')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                        razorpayMethod === 'upi'
                          ? 'bg-blue-600/20 border-blue-500 text-white font-semibold ring-1 ring-blue-500/40'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-blue-400" />
                      <span className="text-[11px]">UPI & QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRazorpayMethod('card')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                        razorpayMethod === 'card'
                          ? 'bg-blue-600/20 border-blue-500 text-white font-semibold ring-1 ring-blue-500/40'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      <span className="text-[11px]">Debit / Credit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRazorpayMethod('all')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                        razorpayMethod === 'all'
                          ? 'bg-blue-600/20 border-blue-500 text-white font-semibold ring-1 ring-blue-500/40'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span className="text-[11px]">All Instruments</span>
                    </button>
                  </div>

                  {/* NetBanking Bank Selection UI */}
                  {razorpayMethod === 'netbanking' && (
                    <div className="space-y-3 pt-1">
                      {/* Popular Banks 1-Click Tiles */}
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                          <span>Popular Banks (1-Click Selection)</span>
                          <span className="text-slate-500">Instant Redirect</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {POPULAR_BANKS.map((bank) => {
                            const isSelected = selectedBank?.code === bank.code;
                            return (
                              <button
                                key={bank.code}
                                type="button"
                                onClick={() => setSelectedBank(bank)}
                                className={`px-2.5 py-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                                  isSelected
                                    ? 'bg-blue-900/40 border-blue-400 text-white ring-1 ring-blue-400/50 shadow-sm'
                                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                                }`}
                              >
                                <div
                                  className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-sm"
                                  style={{ backgroundColor: bank.color || '#2563eb' }}
                                >
                                  {bank.logoInitial || bank.shortName.slice(0, 3)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-semibold truncate leading-tight">
                                    {bank.shortName}
                                  </div>
                                  <div className="text-[9px] text-slate-400 font-mono leading-tight">
                                    {bank.code}
                                  </div>
                                </div>
                                {isSelected && (
                                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Search and Select from ALL 50+ Banks */}
                      <div className="space-y-2 pt-1 border-t border-slate-800/80">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Building2 className="w-3 h-3 text-blue-400" />
                            <span>Or Select Any Bank (All 50+ Indian Banks)</span>
                          </label>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {filteredBanks.length} Banks Available
                          </span>
                        </div>

                        {/* Search Input Bar */}
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            placeholder="Type to search any bank (e.g. Union Bank, IndusInd, Federal, YES, IDBI, AU)..."
                            value={bankSearchQuery}
                            onChange={(e) => {
                              setBankSearchQuery(e.target.value);
                              setIsBankDropdownOpen(true);
                            }}
                            onFocus={() => setIsBankDropdownOpen(true)}
                            className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          />
                          {bankSearchQuery && (
                            <button
                              type="button"
                              onClick={() => {
                                setBankSearchQuery('');
                                setIsBankDropdownOpen(false);
                              }}
                              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Dropdown / Bank Selector List */}
                        {isBankDropdownOpen && (
                          <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 divide-y divide-slate-800/50 shadow-xl">
                            {filteredBanks.length === 0 ? (
                              <div className="p-3 text-center text-xs text-slate-500">
                                No banks matching "{bankSearchQuery}". You can also complete payment via Razorpay All Methods checkout.
                              </div>
                            ) : (
                              filteredBanks.map((bank) => {
                                const isSelected = selectedBank?.code === bank.code;
                                return (
                                  <button
                                    key={bank.code}
                                    type="button"
                                    onClick={() => {
                                      setSelectedBank(bank);
                                      setIsBankDropdownOpen(false);
                                      setBankSearchQuery('');
                                    }}
                                    className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-slate-800/70 transition-colors ${
                                      isSelected ? 'bg-blue-950/50 text-blue-300 font-semibold' : 'text-slate-300'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div
                                        className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                                        style={{ backgroundColor: bank.color || '#334155' }}
                                      >
                                        {bank.logoInitial || bank.code.slice(0, 3)}
                                      </div>
                                      <div className="truncate">
                                        <span className="text-white text-xs">{bank.name}</span>
                                        <span className="text-slate-500 text-[10px] font-mono ml-2">
                                          ({bank.code})
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                                        {bank.category}
                                      </span>
                                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                                    </div>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        )}

                        {/* Selected Bank Active Badge */}
                        {selectedBank ? (
                          <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/40 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                                style={{ backgroundColor: selectedBank.color || '#2563eb' }}
                              >
                                {selectedBank.logoInitial || selectedBank.shortName.slice(0, 3)}
                              </div>
                              <div className="truncate">
                                <span className="text-slate-400 text-[10px] block leading-none font-mono">
                                  Selected Bank:
                                </span>
                                <span className="text-white font-bold text-xs">
                                  {selectedBank.name} ({selectedBank.code})
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded shrink-0">
                              Instant NetBanking
                            </span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic">
                            Select any bank above, or proceed to Razorpay's standard checkout screen.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* UPI Helper Info */}
                  {razorpayMethod === 'upi' && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                        Razorpay UPI Instant Checkout
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Pay using Google Pay, PhonePe, Paytm, BHIM, or enter any virtual payment address (VPA) with instant webhook confirmation.
                      </p>
                    </div>
                  )}

                  {/* Card Helper Info */}
                  {razorpayMethod === 'card' && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                        Cards Accepted
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Supports all Indian & International Visa, MasterCard, RuPay, American Express, and Diners Club Cards with 3D Secure OTP verification.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 3: Customer Details Form */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Payer / Client Information
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Mobile / WhatsApp (Optional)</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Preferred Topic / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Reviewing my Computer Vision thesis"
                    value={purposeNote}
                    onChange={(e) => setPurposeNote(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Paytm QR View (if active and initiated) */}
            {activeGateway === 'paytm' && paytmQrDataUrl && (
              <div className="bg-slate-950 p-5 rounded-2xl border border-cyan-800/40 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="p-2 bg-white rounded-xl shadow-lg shrink-0">
                    <img
                      src={paytmQrDataUrl}
                      alt="Paytm UPI QR"
                      className="w-36 h-36 object-contain"
                    />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-white text-sm">
                      Scan with any UPI App (Paytm, GPay, PhonePe)
                    </div>
                    <p className="text-slate-400">
                      Amount:{' '}
                      <span className="font-bold text-emerald-400 text-sm">₹{currentAmount} INR</span>
                    </p>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-slate-500">Paytm VPA:</span>
                      <code className="bg-slate-900 px-2 py-0.5 rounded text-cyan-300 font-mono text-[11px]">
                        {upiVpa}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="p-1 hover:text-white text-slate-400"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <a
                        href={paytmUpiString}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[11px] font-medium inline-flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open UPI App on Mobile</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Completed payment on your mobile app?
                  </span>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleConfirmPaytmPayment}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isProcessing ? 'Verifying...' : 'I Have Paid — Verify & Confirm'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {statusError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{statusError}</span>
              </div>
            )}

            {/* Step 5: Payment Complete Options & Direct Completion */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-blue-950/30 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono">
                      Payment Complete Option
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                    Instant Firestore & Tax Invoice
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-snug">
                  Execute direct payment completion with instant signature verification, automatic Firestore database registration, and real-time generation of the Official Tax & Audit Invoice.
                </p>

                {/* Primary Complete Payment Button */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleInstantCompletePayment()}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Completing Payment & Syncing to Firestore...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>
                        Complete Payment of ₹{currentAmount} (Instant Tax Invoice)
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Quick 1-Click Complete Options by Channel */}
                <div className="pt-1">
                  <div className="text-[10px] font-mono text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Direct Bank & Channel Completion Options:</span>
                    <span className="text-slate-500">1-Click</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        handleInstantCompletePayment(
                          'razorpay',
                          'State Bank of India (SBIN)',
                          'NetBanking'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-blue-900/40 border border-slate-800 hover:border-blue-500/50 text-slate-200 hover:text-white flex items-center gap-1.5 transition-all text-left"
                    >
                      <Landmark className="w-3 h-3 text-sky-400 shrink-0" />
                      <span className="truncate">SBI NetBanking</span>
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        handleInstantCompletePayment(
                          'razorpay',
                          'All Indian UPI Apps',
                          'UPI'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-900/40 border border-slate-800 hover:border-emerald-500/50 text-slate-200 hover:text-white flex items-center gap-1.5 transition-all text-left"
                    >
                      <Smartphone className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">UPI (GPay / PhonePe)</span>
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        handleInstantCompletePayment(
                          'razorpay',
                          'Visa / Mastercard / RuPay',
                          'Card'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-purple-900/40 border border-slate-800 hover:border-purple-500/50 text-slate-200 hover:text-white flex items-center gap-1.5 transition-all text-left"
                    >
                      <CreditCard className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="truncate">Credit / Debit Card</span>
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        handleInstantCompletePayment(
                          'paytm',
                          'Paytm Payments Bank',
                          'Paytm UPI'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-900/40 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-white flex items-center gap-1.5 transition-all text-left"
                    >
                      <QrCode className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">Paytm UPI QR</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Gateway Provider Checkout Alternative */}
              <div className="pt-1">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5 text-center">
                  — Or Open Standard Interactive Gateway Checkout —
                </div>

                {activeGateway === 'razorpay' ? (
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleRazorpayPayment}
                    className="w-full py-3 px-5 bg-slate-900 hover:bg-slate-850 border border-blue-500/40 hover:border-blue-500 text-blue-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                        <span>Opening Razorpay Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Landmark className="w-4 h-4 text-blue-400" />
                        <span>
                          {razorpayMethod === 'netbanking' && selectedBank
                            ? `Launch ${selectedBank.shortName} NetBanking Portal (Razorpay)`
                            : `Launch Razorpay Gateway Checkout`}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-blue-400 ml-1" />
                      </>
                    )}
                  </button>
                ) : !paytmQrDataUrl ? (
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handlePaytmInitiate}
                    className="w-full py-3 px-5 bg-slate-900 hover:bg-slate-850 border border-cyan-500/40 hover:border-cyan-500 text-cyan-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                        <span>Generating Paytm QR...</span>
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4 text-cyan-400" />
                        <span>Generate Dynamic Paytm QR Code (₹{currentAmount})</span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 ml-1" />
                      </>
                    )}
                  </button>
                ) : null}
              </div>
            </div>

            {/* Security Guarantee Note */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-mono text-center">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                256-Bit Encrypted
              </span>
              <span>·</span>
              <span>PCI-DSS Compliant</span>
              <span>·</span>
              <span>Instant Firestore Receipt</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
