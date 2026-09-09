'use client';

import React, { useState } from 'react';
import { RazorpayCheckoutButton } from '@/components/checkout/razorpay-checkout-button';
import { ShieldCheck, CreditCard, CheckCircle, Info, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RazorpayCheckoutTestPage() {
  const [amount, setAmount] = useState<number>(500);
  const [result, setResult] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-emerald-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#168039] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Razorpay Standard Web Checkout Integration</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Checkout &amp; Verification Test Portal
          </h1>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Test the live 3-step Razorpay payment flow: 1) Order creation backend, 2) Standard Web Checkout popup modal, and 3) HMAC-SHA256 signature verification.
          </p>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Select or Enter Test Amount (INR)
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[100, 500, 1000, 2500].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`py-2.5 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                    amount === val
                      ? 'border-[#168039] bg-[#168039] text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>

            <div className="pt-1">
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:border-[#168039] focus:ring-1 focus:ring-[#168039] outline-none"
                placeholder="Custom Amount"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500">Order Amount in Paise</p>
              <p className="text-lg font-black text-gray-900">
                ₹{amount} <span className="text-xs text-gray-400 font-normal">({amount * 100} paise)</span>
              </p>
            </div>

            <RazorpayCheckoutButton
              amountInRupees={amount}
              label={`Pay ₹${amount} with Razorpay`}
              className="px-6 py-3.5 rounded-xl bg-[#168039] hover:bg-[#137233] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              onSuccess={(details) => {
                setResult(details);
              }}
              onFailure={(err) => {
                setResult({ error: err?.message || 'Payment failed' });
              }}
            />
          </div>

          {/* Test Results Output */}
          {result && (
            <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between font-bold text-gray-700 font-sans">
                <span>Verification Response:</span>
                <span className={result.error ? 'text-red-600' : 'text-emerald-600'}>
                  {result.error ? 'FAILED' : 'SUCCESS (VERIFIED)'}
                </span>
              </div>
              <pre className="overflow-x-auto text-[11px] text-gray-800 bg-white p-3 rounded-lg border border-gray-100">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Integration Specs Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-1.5">
            <h3 className="text-xs font-bold text-gray-900 uppercase">1. Create Order</h3>
            <p className="text-xs text-gray-600">Endpoint: <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">POST /api/create-order</code></p>
            <p className="text-[11px] text-gray-500">Generates authenticated Razorpay Order ID server-side with Key Secret.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-1.5">
            <h3 className="text-xs font-bold text-gray-900 uppercase">2. Checkout Modal</h3>
            <p className="text-xs text-gray-600">SDK: <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">checkout.js</code></p>
            <p className="text-[11px] text-gray-500">Opens official Razorpay Standard UI modal with UPI, Cards, Netbanking.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-1.5">
            <h3 className="text-xs font-bold text-gray-900 uppercase">3. Verify Signature</h3>
            <p className="text-xs text-gray-600">Endpoint: <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">POST /api/verify-payment</code></p>
            <p className="text-[11px] text-gray-500">Computes HMAC-SHA256 signature and returns 200 only on matching token.</p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-800 hover:text-emerald-950 font-medium hover:underline"
          >
            <span>Return to ITLC Foundation Home</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>
    </div>
  );
}
