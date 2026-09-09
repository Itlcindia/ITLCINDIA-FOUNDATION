'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  Heart, 
  Repeat, 
  User, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Loader2,
  Download,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { useDonationModal } from '@/context/donation-modal-context';
import { downloadReceiptPdf, printReceiptInvoice } from '@/lib/donation-receipt';

function loadRazorpaySdk(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function DonationModal() {
  const { isOpen, closeDonationModal, initialAmount, initialIsMonthly } = useDonationModal();

  // Dynamic configuration from Admin CMS
  const [modalConfig, setModalConfig] = useState<any>({
    title: "Make a Difference Today",
    subtitle: "Empowering children, protecting nature & strengthening communities in UP.",
    logoImage: "/ref/logo.png",
    qrImage: "/qr.png",
    qrTitle: "Official UPI Barcode Payment",
    qrDescription: "Scan using Google Pay, PhonePe, Paytm, or BHIM. Or click below to proceed with Gateway / Cards / UPI.",
    upiId: "itlc@upi",
    presetAmounts: [500, 1000, 2000],
    defaultAmount: 1000,
    taxExemptionNote: "50% Tax Exemption under Section 80G. Slip will download automatically.",
    buttonText: "Proceed to Pay",
    buttonSubtext: "⚡ Payment hote hi data automatically sync ho jayega aur 80G Receipt Slip automatically download ho jayegi.",
    successTitle: "Thanks for your support!",
    successSubtitle: "Aapka chhota sa sahyog kisi ki zindagi badal sakta hai 🌿",
    successMessage: "Dear {donorName}, your donation of ₹{amount} will directly help educate children, plant trees, and rescue animals across Lucknow and Uttar Pradesh.",
    successImage: "/ref/hero_boy_hd.jpg"
  });

  // Fetch dynamic CMS configuration
  useEffect(() => {
    fetch('/api/content/cms', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data?.donationModal) {
          setModalConfig((prev: any) => ({ ...prev, ...data.donationModal }));
          if (data.donationModal.presetAmounts && data.donationModal.presetAmounts.length > 0 && !initialAmount) {
            setAmount(data.donationModal.defaultAmount || data.donationModal.presetAmounts[0]);
          }
        }
      })
      .catch(err => console.warn('Could not fetch modal cms config:', err));
  }, [initialAmount, isOpen]);

  // Form states
  const [isMonthly, setIsMonthly] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // UI / Action states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; amount?: string }>({});

  // Receipt Details after success
  const [receiptDetails, setReceiptDetails] = useState<{
    receiptNo: string;
    amount: number;
    type: string;
    donorName: string;
    donorEmail: string;
    donorPhone: string;
    date: string;
    paymentId: string;
  } | null>(null);

  // Sync initial values if passed from context
  useEffect(() => {
    if (initialAmount && initialAmount > 0) {
      setAmount(initialAmount);
      if (modalConfig?.presetAmounts && !modalConfig.presetAmounts.includes(initialAmount)) {
        setCustomAmount(initialAmount.toString());
      } else {
        setCustomAmount('');
      }
    }
    if (initialIsMonthly !== undefined) {
      setIsMonthly(initialIsMonthly);
    }
  }, [initialAmount, initialIsMonthly, modalConfig]);

  // Reset form on modal close/open
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
        setReceiptDetails(null);
        setErrors({});
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmount('');
    setErrors(prev => ({ ...prev, amount: undefined }));
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    if (val && Number(val) > 0) {
      setAmount(Number(val));
      setErrors(prev => ({ ...prev, amount: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; amount?: string } = {};

    if (!fullName.trim()) {
      newErrors.name = 'Please enter your full name';
    } else if (fullName.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!amount || amount < 10) {
      newErrors.amount = 'Minimum donation amount is ₹10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const year = new Date().getFullYear();
      const generatedReceiptNo = `ITLC-80G-${Math.floor(100000 + Math.random() * 900000)}-${year}`;

      // Helper to finalize donation after payment
      const finalizeDonation = async (confirmedPaymentId: string, customReceiptNo?: string) => {
        const finalReceiptNo = customReceiptNo || generatedReceiptNo;
        try {
          await fetch('/api/donations/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              donor_name: fullName.trim(),
              donor_email: email.trim(),
              donor_phone: '9336188402',
              amount: amount,
              type: isMonthly ? 'monthly' : 'one-time',
              payment_id: confirmedPaymentId,
              receipt_no: finalReceiptNo,
            }),
          });
        } catch (notifyErr) {
          console.warn('Could not dispatch receipt notification:', notifyErr);
        }

        const details = {
          receiptNo: finalReceiptNo,
          amount: amount,
          type: isMonthly ? 'Monthly Support' : 'One-time Donation',
          donorName: fullName.trim(),
          donorEmail: email.trim(),
          donorPhone: '9336188402',
          date: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          paymentId: confirmedPaymentId,
        };

        setReceiptDetails(details);
        setIsLoading(false);
        setIsSuccess(true);

        // AUTOMATIC AUTO-DOWNLOAD: Slip automatically downloads to user's computer/phone
        setTimeout(() => {
          try {
            downloadReceiptPdf(details);
          } catch (pdfErr) {
            console.warn('Auto PDF download error:', pdfErr);
          }
        }, 400);
      };

      // 1. Create order on backend with Razorpay (Step 1: POST /api/create-order)
      let orderData: any = null;
      try {
        const orderRes = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(Number(amount) * 100), // in paise (minimum 100 paise)
            currency: 'INR',
            receipt: `rcpt_${Date.now().toString(36)}`,
            notes: {
              donor_name: fullName.trim(),
              donor_email: email.trim(),
              donation_type: isMonthly ? 'monthly' : 'one-time',
            },
          }),
        });

        if (orderRes.ok) {
          orderData = await orderRes.json();
        } else {
          const errData = await orderRes.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to create Razorpay order');
        }
      } catch (orderErr: any) {
        console.error('Could not create Razorpay order:', orderErr);
        setIsLoading(false);
        alert(orderErr?.message || 'Could not initiate payment order. Please try again.');
        return;
      }

      // 2. Load Razorpay Checkout SDK (Step 2: Frontend Checkout)
      const isSdkLoaded = await loadRazorpaySdk();
      if (!isSdkLoaded || !(window as any).Razorpay) {
        setIsLoading(false);
        alert('Payment gateway SDK could not be loaded. Please check your internet connection.');
        return;
      }

      // 3. Open Razorpay Checkout modal
      const options: any = {
        key: orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'ITLC Foundation',
        description: isMonthly ? 'Monthly Support Donation' : 'Section 80G Tax-Exempt Contribution',
        image: modalConfig?.logoImage || '/ref/logo.png',
        order_id: orderData.order_id,
        handler: async function (response: any) {
          setIsLoading(true);
          try {
            // STEP 3: Verify signature on backend (POST /api/verify-payment)
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || orderData.order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: amount,
                donor_name: fullName.trim(),
                donor_email: email.trim(),
                donor_phone: '9336188402',
                type: isMonthly ? 'monthly' : 'one-time',
              }),
            });

            const verifyData = await verifyRes.json().catch(() => ({}));
            if (verifyRes.ok && verifyData.success) {
              await finalizeDonation(response.razorpay_payment_id, verifyData.receipt_no);
            } else {
              setIsLoading(false);
              alert(verifyData.error || 'Payment signature verification failed. Please contact support.');
            }
          } catch (verifyErr) {
            console.error('Error during signature verification:', verifyErr);
            setIsLoading(false);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: fullName.trim(),
          email: email.trim(),
          contact: '9336188402',
        },
        theme: {
          color: '#168039',
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (errResp: any) {
        setIsLoading(false);
        const errorMsg = errResp?.error?.description || 'Payment was unsuccessful. Please try again.';
        console.error('Razorpay payment failed:', errResp);
        alert(errorMsg);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Donation payment error:', err);
      setIsLoading(false);
      alert('An error occurred while processing the payment. Please try again.');
    }
  };

  const handleDownloadPdf = () => {
    if (!receiptDetails) return;
    setIsDownloading(true);
    try {
      downloadReceiptPdf(receiptDetails);
    } finally {
      setTimeout(() => setIsDownloading(false), 600);
    }
  };

  const handlePrintReceipt = () => {
    if (!receiptDetails) return;
    printReceiptInvoice(receiptDetails);
  };

  const activePresets = modalConfig?.presetAmounts || [500, 1000, 2000];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDonationModal();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={closeDonationModal}
          aria-label="Close donation modal"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Banner */}
        <div className="bg-gradient-to-r from-[#083a27] via-[#0d4f34] to-[#083a27] text-white p-6 pt-7 text-center relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-white p-1 shrink-0 shadow-md border border-white/30">
              <Image
                src={modalConfig?.logoImage || '/ref/logo.png'}
                alt="ITLC Foundation"
                fill
                sizes="64px"
                className="object-contain rounded-full"
              />
            </div>
            <span className="font-bold tracking-wider text-base uppercase font-headline">
              ITLC FOUNDATION
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {isSuccess ? (modalConfig?.successTitle || 'Donation Received') : (modalConfig?.title || 'Make a Difference Today')}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-sm mx-auto">
            {isSuccess
              ? (modalConfig?.successSubtitle || 'Thank you for your generosity! Your receipt has been sent.')
              : (modalConfig?.subtitle || 'Empowering children, protecting nature & strengthening communities in UP.')}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: PAYMENT FORM (FULL NAME + EMAIL + BARCODE + PROCEED TO PAY)      */}
        {/* ========================================================================= */}
        {!isSuccess ? (
          <form onSubmit={handlePayment} className="p-6 sm:p-7 space-y-4">
            
            {/* 1. Frequency Tabs (One-time vs Monthly side by side) */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Donation Frequency
              </label>
              <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl gap-1.5 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsMonthly(false)}
                  className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    !isMonthly
                      ? 'bg-[#168039] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${!isMonthly ? 'fill-white' : ''}`} />
                  <span>One-time</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsMonthly(true)}
                  className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isMonthly
                      ? 'bg-[#168039] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                  <span>Monthly</span>
                </button>
              </div>
            </div>

            {/* 2. Dynamic Amount Selection (From Admin CMS) */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Select Amount (INR)
              </label>
              <div className={`grid gap-2 ${activePresets.length <= 3 ? 'grid-cols-4' : 'grid-cols-4 sm:grid-cols-5'}`}>
                {activePresets.map((preset: number) => {
                  const isSelected = amount === preset && !customAmount;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAmountSelect(preset)}
                      className={`py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm transition-all border cursor-pointer text-center ${
                        isSelected
                          ? 'bg-[#168039] text-white border-[#168039] shadow-sm'
                          : 'bg-white text-gray-800 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50'
                      }`}
                    >
                      ₹{preset.toLocaleString('en-IN')}
                    </button>
                  );
                })}

                {/* Custom Amount Field */}
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    ₹
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Custom"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className={`w-full h-full min-h-[40px] pl-6 pr-2 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all outline-none ${
                      customAmount
                        ? 'border-[#168039] bg-emerald-50/50 text-[#168039] ring-1 ring-[#168039]'
                        : 'border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-emerald-500'
                    }`}
                  />
                </div>
              </div>
              {errors.amount && (
                <p className="text-xs text-red-600 mt-1">{errors.amount}</p>
              )}
            </div>

            {/* 3. Donor Personal Details (Full Name & Verified Email) */}
            <div className="space-y-3 pt-1">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder=""
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                    }}
                    className={`w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border bg-white outline-none transition-all ${
                      errors.name ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-gray-200 focus:border-[#168039] focus:ring-1 focus:ring-[#168039]'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Verified Email Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Verified Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder=""
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    className={`w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border bg-white outline-none transition-all ${
                      errors.email ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-gray-200 focus:border-[#168039] focus:ring-1 focus:ring-[#168039]'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* 4. Official UPI Barcode Section (Dynamic from Admin CMS) */}
            <div className="bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/50 border-2 border-emerald-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#083a27]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{modalConfig?.qrTitle || 'Official UPI Barcode Payment'}</span>
                </div>
                <span className="text-[10px] font-bold bg-[#168039] text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                  80G Certified
                </span>
              </div>

              <div className="flex items-center gap-3.5 bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                {/* Barcode QR Image (Managed from Admin) */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-white p-1 rounded-xl border border-gray-200 shrink-0 shadow-xs">
                  <Image
                    src={modalConfig?.qrImage || '/qr.png'}
                    alt="ITLC Foundation UPI Barcode"
                    fill
                    sizes="112px"
                    className="object-contain p-0.5 rounded-lg"
                  />
                </div>

                {/* Info & Instructions */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900">
                    Scan Barcode to Pay <span className="text-[#168039] font-black text-sm">₹{amount.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    {modalConfig?.qrDescription || 'Scan using Google Pay, PhonePe, Paytm, or BHIM. Or click below to proceed with Gateway / Cards / UPI.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    <span className="text-[10px] bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded-md">GPay</span>
                    <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-md">PhonePe</span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md">Paytm</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md">BHIM</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono pt-0.5">
                    UPI ID: <span className="font-semibold text-gray-600">{modalConfig?.upiId || 'itlc@upi'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Tax Exemption & Security Badge */}
            <div className="flex items-center gap-2 bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5 text-[11px] text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-[#168039] shrink-0" />
              <span>
                {modalConfig?.taxExemptionNote || '50% Tax Exemption under Section 80G. Slip will download automatically.'}
              </span>
            </div>

            {/* 6. Proceed to Pay Button */}
            <div className="space-y-1.5 pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#168039] hover:bg-[#137233] text-white py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Connecting Payment Gateway...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{modalConfig?.buttonText || 'Proceed to Pay'} ₹{amount.toLocaleString('en-IN')}{isMonthly ? ' / month' : ''}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-gray-500 leading-snug">
                {modalConfig?.buttonSubtext || '⚡ Payment hote hi data automatically sync ho jayega aur 80G Receipt Slip automatically download ho jayegi.'}
              </p>
            </div>
          </form>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: BEAUTIFUL THANK YOU & RECEIPT CONFIRMATION SCREEN                 */
          /* ========================================================================= */
          <div className="p-6 sm:p-7 text-center space-y-4 animate-in fade-in duration-300">
            
            {/* Celebratory Emojis & Thanks Heading */}
            <div className="pt-1">
              <div className="text-3xl sm:text-4xl mb-1 select-none animate-bounce">
                🙏 ❤️ 🎉
              </div>
              <h3 className="text-2xl sm:text-[26px] font-extrabold text-[#083a27] font-headline tracking-tight">
                {modalConfig?.successTitle || 'Thanks for your support!'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-700 font-semibold mt-0.5">
                {modalConfig?.successSubtitle || 'Aapka chhota sa sahyog kisi ki zindagi badal sakta hai 🌿'}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed max-w-md mx-auto">
                {(modalConfig?.successMessage || 'Dear {donorName}, your donation of ₹{amount} will directly help educate children, plant trees, and rescue animals across Lucknow and Uttar Pradesh.')
                  .replace('{donorName}', receiptDetails?.donorName || 'Supporter')
                  .replace('{amount}', receiptDetails?.amount ? receiptDetails.amount.toLocaleString('en-IN') : '0')}
              </p>

              {/* Automatic Download Notice Badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2 max-w-md mx-auto mt-2">
                <CheckCircle2 className="w-4 h-4 text-[#168039] shrink-0" />
                <span>Aapka official 80G Receipt Slip device me <strong>automatically download</strong> ho gaya hai!</span>
              </div>
            </div>

            {/* Heartwarming Hero Photo (From Admin CMS) */}
            <div className="relative w-full h-36 sm:h-40 rounded-2xl overflow-hidden shadow-sm border border-emerald-200 bg-emerald-50">
              <Image
                src={modalConfig?.successImage || '/ref/hero_boy_hd.jpg'}
                alt="Child with green plant sapling - ITLC Foundation"
                fill
                sizes="500px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between text-white">
                <span className="font-cursive text-lg sm:text-xl font-bold drop-shadow">
                  A Kinder, Stronger UP
                </span>
                <span className="bg-emerald-600/90 backdrop-blur-xs text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  80G Verified
                </span>
              </div>
            </div>

            {/* Receipt Summary Card */}
            {receiptDetails && (
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 sm:p-4 text-left space-y-2">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                  <span className="text-xs font-semibold text-emerald-900">Official Receipt No:</span>
                  <span className="font-mono text-xs font-bold text-[#083a27] bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {receiptDetails.receiptNo}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
                  <div>
                    <span className="text-gray-500 block">Amount Paid:</span>
                    <span className="font-bold text-sm text-[#168039]">₹{receiptDetails.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Frequency:</span>
                    <span className="font-semibold text-gray-800">{receiptDetails.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Date:</span>
                    <span className="text-gray-800">{receiptDetails.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Tax Exemption:</span>
                    <span className="font-semibold text-emerald-800">50% (Sec 80G)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Primary Action: Download 80G Receipt PDF (if user wants to re-download) */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="w-full bg-[#168039] hover:bg-[#137233] active:scale-[0.99] text-white py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-75"
              >
                <Download className="w-5 h-5" />
                <span>{isDownloading ? 'Generating & Downloading...' : 'Download 80G Receipt Slip (PDF) Again'}</span>
              </button>

              {/* Secondary Actions: Print Invoice & Close */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="bg-emerald-50 hover:bg-emerald-100 text-[#083a27] border border-emerald-200 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🖨️ Print Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={closeDonationModal}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Close &amp; Continue
                </button>
              </div>
            </div>

            {/* Confirmation Dispatches */}
            <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-left">
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <Mail className="w-3.5 h-3.5 shrink-0 text-[#168039]" />
                <span>80G Tax Invoice emailed to <strong>{receiptDetails?.donorEmail}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#168039]" />
                <span>Digitally Verified &amp; Recorded in ITLC Foundation 80G Registry</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
