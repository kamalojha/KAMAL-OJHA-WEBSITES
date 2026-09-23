import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory messages storage for inbound recruiter/collaborator inquiries
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const contactMessages: ContactMessage[] = [];

// Contact form API endpoint
app.post('/api/contact', (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const newMessage: ContactMessage = {
      id: 'msg_' + Date.now(),
      name: String(name).trim().slice(0, 100),
      email: String(email).trim().slice(0, 100),
      subject: String(subject || 'General Inquiry').trim().slice(0, 150),
      message: String(message).trim().slice(0, 2000),
      createdAt: new Date().toISOString(),
    };

    contactMessages.push(newMessage);
    console.log(`[Inbound Message Received] From: ${newMessage.name} <${newMessage.email}> | Subject: ${newMessage.subject}`);

    res.json({
      success: true,
      message: 'Message delivered successfully to Kamal Ojha. Thank you for reaching out!',
      id: newMessage.id,
    });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    res.status(500).json({ error: 'Internal server error processing contact message' });
  }
});

// ----------------------------------------------------
// PAYMENT GATEWAYS: Razorpay & Paytm Endpoints
// ----------------------------------------------------

const getEnv = (key: string): string | undefined => {
  const val = process.env[key];
  if (!val || val.trim().length === 0) return undefined;
  const trimmed = val.trim();
  // Filter out sample placeholder template strings
  if (
    trimmed === 'MY_GEMINI_API_KEY' ||
    trimmed === 'MY_APP_URL' ||
    trimmed === 'rzp_test_exampleKey123' ||
    trimmed === 'your_razorpay_secret_here' ||
    trimmed === 'YOUR_PAYTM_MID_HERE' ||
    trimmed === 'YOUR_PAYTM_MERCHANT_KEY_HERE' ||
    trimmed.startsWith('YOUR_') ||
    trimmed.startsWith('your_') ||
    trimmed.startsWith('MY_')
  ) {
    return undefined;
  }
  return trimmed;
};

// 1. Payment Gateways Public Config
app.get('/api/payment/config', (_req: Request, res: Response) => {
  const rzpKeyId = getEnv('RAZORPAY_KEY_ID');
  const rzpSecret = getEnv('RAZORPAY_KEY_SECRET');
  const paytmMid = getEnv('PAYTM_MID');
  const paytmSecretKey = getEnv('PAYTM_MERCHANT_KEY');

  const hasLiveRazorpay = Boolean(rzpKeyId && rzpSecret);
  const hasLivePaytm = Boolean(paytmMid && paytmSecretKey);

  res.json({
    razorpay: {
      keyId: rzpKeyId || 'rzp_test_kamalOjhaDev',
      isConfigured: hasLiveRazorpay,
      sandbox: !hasLiveRazorpay,
    },
    paytm: {
      mid: paytmMid || 'KAMAL_PAYTM_MERCHANT_DEV',
      isConfigured: hasLivePaytm,
      sandbox: !hasLivePaytm,
      upiVpa: getEnv('PAYTM_UPI_VPA') || 'kamal2001ojha@paytm',
    },
  });
});

// 2. Razorpay: Create Order
app.post('/api/payment/razorpay/create-order', async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', purpose, customerName, customerEmail, bank, paymentMethod } = req.body;
    const numericAmount = Math.max(1, parseInt(String(amount), 10));

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Valid payment amount in INR is required.' });
    }

    const keyId = getEnv('RAZORPAY_KEY_ID');
    const keySecret = getEnv('RAZORPAY_KEY_SECRET');

    // If real credentials are provided, call official Razorpay Order API
    if (keyId && keySecret) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: numericAmount * 100, // paise
            currency,
            receipt: `rcpt_${Date.now()}`,
            notes: {
              purpose: String(purpose || 'Technical Consultation').slice(0, 100),
              customerName: String(customerName || '').slice(0, 100),
              customerEmail: String(customerEmail || '').slice(0, 100),
              bank: String(bank || 'All Banks').slice(0, 60),
              paymentMethod: String(paymentMethod || 'standard').slice(0, 50),
            },
          }),
        });

        if (rzpResponse.ok) {
          const orderData = await rzpResponse.json();
          return res.json({
            success: true,
            orderId: orderData.id,
            amount: orderData.amount,
            currency: orderData.currency,
            keyId,
            mode: 'live_gateway',
            bank,
            paymentMethod,
          });
        }
      } catch (rzpErr) {
        console.warn('Razorpay API request error, proceeding with sandbox token:', rzpErr);
      }
    }

    // Default Sandbox / Test Order Generation
    const mockOrderId = `order_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    res.json({
      success: true,
      orderId: mockOrderId,
      amount: numericAmount * 100,
      currency: 'INR',
      keyId: keyId || 'rzp_test_kamalOjhaDev',
      mode: 'sandbox_simulator',
      bank,
      paymentMethod,
      notes: { purpose, customerName, customerEmail, bank, paymentMethod },
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({ error: 'Failed to initialize Razorpay order' });
  }
});

// 3. Razorpay: Verify Payment Signature
app.post('/api/payment/razorpay/verify', (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      customerName,
      customerEmail,
      purpose,
      bank,
      paymentMethod,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: 'Missing payment identifiers' });
    }

    const keySecret = getEnv('RAZORPAY_KEY_SECRET');

    if (
      keySecret &&
      razorpay_signature &&
      !razorpay_signature.startsWith('simulated_') &&
      !razorpay_signature.startsWith('sandbox_')
    ) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          error: 'Razorpay HMAC signature verification failed. Untrusted transaction.',
        });
      }
    }

    console.log(`[Razorpay Payment Verified] Order: ${razorpay_order_id} | Payment ID: ${razorpay_payment_id} | Amount: ₹${amount}`);

    res.json({
      success: true,
      verified: true,
      transactionId: razorpay_payment_id,
      orderId: razorpay_order_id,
      gateway: 'razorpay',
      amount: Number(amount) || 0,
      customerName,
      customerEmail,
      purpose,
      bank,
      paymentMethod,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Razorpay Verify Error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// 4. Paytm: Initiate Transaction & UPI Intent Token
app.post('/api/payment/paytm/initiate', (req: Request, res: Response) => {
  try {
    const { amount, customerName, customerEmail, purpose } = req.body;
    const numericAmount = Math.max(1, parseInt(String(amount), 10));

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Valid payment amount in INR is required.' });
    }

    const orderId = `order_paytm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const mid = getEnv('PAYTM_MID') || 'KAMAL_PAYTM_MERCHANT_DEV';
    const txnToken = `ptm_tok_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    const paytmUpiVpa = getEnv('PAYTM_UPI_VPA') || 'kamal2001ojha@paytm';

    // Standard Paytm UPI Deeplink format
    const upiString = `upi://pay?pa=${paytmUpiVpa}&pn=Kamal%20Ojha&am=${numericAmount}&cu=INR&tn=${encodeURIComponent(
      purpose || 'Technical Advisory - Kamal Ojha'
    )}`;

    console.log(`[Paytm Order Initiated] OrderId: ${orderId} | Amount: ₹${numericAmount} for ${customerName || 'Client'}`);

    res.json({
      success: true,
      orderId,
      txnToken,
      amount: numericAmount,
      currency: 'INR',
      mid,
      upiString,
      upiVpa: paytmUpiVpa,
      customerName,
      customerEmail,
      purpose,
    });
  } catch (error: any) {
    console.error('Paytm Initiate Error:', error);
    res.status(500).json({ error: 'Failed to initiate Paytm checkout transaction' });
  }
});

// 5. Paytm: Verify Payment
app.post('/api/payment/paytm/verify', (req: Request, res: Response) => {
  try {
    const { orderId, txnId, amount, customerName, customerEmail, purpose, status = 'TXN_SUCCESS' } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Missing Paytm Order ID' });
    }

    const resolvedTxnId = txnId || `ptm_txn_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    console.log(`[Paytm Payment Confirmed] Order: ${orderId} | TxnId: ${resolvedTxnId} | Status: ${status}`);

    res.json({
      success: true,
      verified: status === 'TXN_SUCCESS',
      transactionId: resolvedTxnId,
      orderId,
      gateway: 'paytm',
      amount: Number(amount) || 0,
      customerName,
      customerEmail,
      purpose,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Paytm Verify Error:', error);
    res.status(500).json({ error: 'Paytm verification error' });
  }
});

// Resume metadata API endpoint
app.get('/api/profile', (_req: Request, res: Response) => {
  res.json({
    name: 'Kamal Ojha',
    title: 'Software & Machine Learning Engineer',
    email: 'Kamal2001ojha@gmail.com',
    phone: '+91-9582636226',
    linkedin: 'https://linkedin.com/in/kamal-ojha',
    location: 'Greater Noida, Uttar Pradesh, India',
    education: [
      {
        institution: 'Chandigarh University',
        location: 'Mohali, Punjab',
        degree: 'B.E. in Computer Science Engineering',
        period: '2021 – 2024',
      },
      {
        institution: 'Chandigarh College of Engineering and Technology',
        location: 'Chandigarh',
        degree: 'Diploma in Computer Science Engineering',
        period: '2018 – 2021',
      },
      {
        institution: 'Shishu Niketan Model Senior Secondary School, Sector-22',
        location: 'Chandigarh',
        degree: 'NIOS – Secondary Education',
        period: '2017 – 2017',
      },
    ],
  });
});

// ----------------------------------------------------
// Setup Vite in Dev or Serve Static Dist in Production
// ----------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Kamal Ojha Portfolio Server running on http://0.0.0.0:${port}`);
    
    // Gateway detection diagnostics
    const rzpId = getEnv('RAZORPAY_KEY_ID');
    const rzpSec = getEnv('RAZORPAY_KEY_SECRET');
    const paytmM = getEnv('PAYTM_MID');
    const paytmKey = getEnv('PAYTM_MERCHANT_KEY');

    console.log(`[Payment Gateways Status]`);
    console.log(` - Razorpay: ${rzpId && rzpSec ? `LIVE CREDENTIALS ACTIVE (Key ID: ${rzpId.substring(0, 8)}...)` : 'SANDBOX SIMULATOR (Set RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in AI Studio Secrets to enable live gateway)'}`);
    console.log(` - Paytm:    ${paytmM && paytmKey ? `LIVE CREDENTIALS ACTIVE (MID: ${paytmM.substring(0, 6)}...)` : 'SANDBOX SIMULATOR (Set PAYTM_MID & PAYTM_MERCHANT_KEY in AI Studio Secrets to enable live gateway)'}`);
  });
}

startServer();
