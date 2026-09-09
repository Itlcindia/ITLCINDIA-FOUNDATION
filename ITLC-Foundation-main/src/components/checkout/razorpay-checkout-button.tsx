'use client';

import React, { useState } from 'react';
import { CreditCard, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface RazorpayCheckoutButtonProps {
  amountInRupees?: number;
  label?: string;
  className?: string;
  onSuccess?: (paymentDetails: {
    payment_id: string;
    order_id: string;
    receipt_no?: string;
  }) => void;
  onFailure?: (error: any) => void;
}

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayCheckoutButton({
  amountInRupees = 500,
  label,
  className = '',
  onSuccess,
  onFailure,
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setStatusMessage(null);

    try {
      // 1. Convert amount to paise (min 100 paise = ₹1)
      const amountInPaise = Math.max(100, Math.round(amountInRupees * 100));

      // 2. Call backend endpoint to create order (STEP 1)
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${Date.now().toString(36)}`,
        }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create payment order');
      }

      const orderData = await orderRes.json();

      // 3. Load Razorpay Checkout SDK (STEP 2)
      const isLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!isLoaded || !(window as any).Razorpay) {
        throw new Error('Razorpay Checkout SDK failed to load. Please check your internet connection.');
      }

      // 4. Configure and open Razorpay modal
      const options = {
        key: orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'ITLC Foundation',
        description: 'Standard Payment Checkout',
        image: '/ref/logo.png',
        order_id: orderData.order_id,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          setLoading(true);
          try {
            // 5. Verify payment signature on backend (STEP 3)
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: amountInRupees,
              }),
            });

            const verifyData = await verifyRes.json().catch(() => ({}));

            if (verifyRes.ok && verifyData.success) {
              setStatusMessage({
                type: 'success',
                text: `Payment verified! ID: ${response.razorpay_payment_id}`,
              });
              onSuccess?.({
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                receipt_no: verifyData.receipt_no,
              });
            } else {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }
          } catch (verifyError: any) {
            console.error('Signature verification error:', verifyError);
            setStatusMessage({
              type: 'error',
              text: verifyError?.message || 'Payment verification failed.',
            });
            onFailure?.(verifyError);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: 'ITLC Supporter',
          email: 'donor@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#168039',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            console.log('Payment modal dismissed by user');
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);

      razorpayInstance.on('payment.failed', function (resp: any) {
        setLoading(false);
        const desc = resp?.error?.description || 'Payment transaction failed.';
        setStatusMessage({ type: 'error', text: desc });
        onFailure?.(resp);
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error('Razorpay Checkout error:', err);
      setLoading(false);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'An error occurred while launching payment checkout.',
      });
      onFailure?.(err);
    }
  };

  return (
    <div className="inline-flex flex-col gap-2">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={
          className ||
          'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#168039] hover:bg-[#137233] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer'
        }
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            <span>{label || `Pay ₹${amountInRupees}`}</span>
          </>
        )}
      </button>

      {statusMessage && (
        <div
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
}
