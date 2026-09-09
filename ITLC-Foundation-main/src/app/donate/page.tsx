'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, ShieldCheck, Leaf, Users, HeartHandshake } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/constants';

const sectionVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};

const suggestedAmounts = [500, 1000, 2000];

const impactData = [
  {
    icon: <Leaf className="w-10 h-10 text-[#168039]" />,
    title: 'Environmental Protection',
    description: 'Your donation helps our environmental NGO plant trees and run cleanliness drives in Lucknow.'
  },
  {
    icon: <Users className="w-10 h-10 text-[#168039]" />,
    title: 'Community Welfare',
    description: 'Support our food distribution, education, and women empowerment programs in Uttar Pradesh.'
  },
  {
    icon: <HeartHandshake className="w-10 h-10 text-[#168039]" />,
    title: 'Animal Welfare',
    description: 'Help our animal welfare NGO rescue, feed, and provide medical care for stray animals in Lucknow.'
  }
];

const fallbackFaqs = [
  {
    q: 'Is my donation to your NGO secure?',
    a: 'Yes, your donation is 100% secure. We use industry-standard encrypted payment gateways to ensure your information is safe. You can donate with confidence to our NGO in Lucknow.'
  },
  {
    q: 'Can I get a tax receipt for my donation?',
    a: 'Yes, all donations made to ITLC Foundation, a registered NGO, are eligible for tax exemption under section 80G of the Income Tax Act, India. You will receive the 80G receipt via email.'
  },
  {
    q: 'How is my donation used by your NGO?',
    a: 'We believe in 100% transparency. 90% of your donation goes directly to our social welfare, education, and environmental projects in Lucknow. The remaining 10% is used for administrative and logistical expenses to ensure smooth operations.'
  },
  {
    q: 'Can I set up a recurring monthly donation?',
    a: "Yes, you can become a regular supporter of our NGO. Simply choose the 'Monthly' option on the donation form to set up a recurring donation and provide continuous support to our causes in Uttar Pradesh."
  }
];

export default function DonatePage() {
  const { toast } = useToast();
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [isMonthly, setIsMonthly] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>(fallbackFaqs);
  const [loading, setLoading] = useState(false);

  // Dynamic content states
  const [mainHeading, setMainHeading] = useState('Make a Difference in Lucknow Today');
  const [mainSubheading, setMainSubheading] = useState('Your support is crucial for our social welfare mission in Uttar Pradesh.');
  const [sideImageUrl, setSideImageUrl] = useState('/pro/c.png');
  const [qrTitle, setQrTitle] = useState('Scan to Support Our NGO');
  const [qrDescription, setQrDescription] = useState('Quickly donate to our Lucknow projects via any UPI App');
  const [qrImageUrl, setQrImageUrl] = useState('/qr.png');
  const [transparencyText, setTransparencyText] = useState('Hum har donation ka proper utilization record maintain karte hain aur donors ko updates provide karte hain. Your trust is our biggest asset. As a top NGO in Lucknow, transparency is our priority.');

  useEffect(() => {
    // Load Razorpay library dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Fetch dynamic FAQs
    fetch(`${API_URL}/content/faqs?page=donate`)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setFaqs(data.map((f) => ({ q: f.question, a: f.answer })));
        }
      })
      .catch((err) => {
        console.warn('Could not fetch dynamic FAQs for donate page, using fallback:', err);
      });

    // Fetch dynamic donate page content
    fetch(`${API_URL}/content/donate-content`)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (data) {
          setMainHeading(data.main_heading || '');
          setMainSubheading(data.main_subheading || '');
          setSideImageUrl(data.side_image_url || '');
          setQrTitle(data.qr_title || '');
          setQrDescription(data.qr_description || '');
          setQrImageUrl(data.qr_image_url || '');
          setTransparencyText(data.transparency_text || '');
        }
      })
      .catch((err) => {
        console.warn('Could not fetch dynamic donate page content, using defaults:', err);
      });

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAmountClick = (value: number) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (Number(value) > 0) {
      setAmount(Number(value));
    }
  };

  const handleDonate = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fill in your name, email, and mobile number.',
      });
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.trim())) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a valid 10-digit mobile number.',
      });
      return;
    }

    setLoading(true);
    const endpoint = isMonthly ? '/donations/create-subscription' : '/donations/create-order';

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, amount })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      const options: any = {
        key: data.keyId,
        amount: data.amount * 100, // in paise
        currency: 'INR',
        name: 'ITLC Foundation',
        description: isMonthly ? 'Monthly Support Subscription' : 'One-time Donation Support',
        image: '/favicon.ico',
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(`${API_URL}/donations/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: isMonthly ? undefined : data.orderId,
                razorpay_subscription_id: isMonthly ? data.subscriptionId : undefined,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                donationId: data.donationId,
                isMock: data.isMock
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.status === 'success') {
              toast({
                title: 'Donation Successful!',
                description: 'Thank you for your support. Your 80G tax receipt has been emailed.',
              });
              setName('');
              setEmail('');
              setPhone('');
              setCustomAmount('');
              setAmount(1000);
            } else {
              throw new Error(verifyData.message || 'Signature verification failed');
            }
          } catch (err: any) {
            toast({
              variant: 'destructive',
              title: 'Verification Failed',
              description: err.message || 'We could not verify the payment status.',
            });
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: phone
        },
        theme: {
          color: '#1B5E20'
        }
      };

      if (isMonthly) {
        options.subscription_id = data.subscriptionId;
      } else {
        options.order_id = data.orderId;
      }

      if (data.isMock) {
        toast({
          variant: 'destructive',
          title: 'Configuration Required',
          description: 'Razorpay API keys are not configured in the backend .env file. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to accept real payments.',
        });
        setLoading(false);
        return;
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        toast({
          variant: 'destructive',
          title: 'Payment Failed',
          description: resp.error.description || 'Transaction could not be completed.',
        });
      });
      rzp.open();

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Payment Error',
        description: error.message || 'Could not connect to payment gateway.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 space-y-16 md:space-y-20">
        
        <motion.section
          className={cn("grid gap-12 items-center", sideImageUrl ? "lg:grid-cols-2" : "grid-cols-1 max-w-2xl mx-auto")}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
          {sideImageUrl && (
            <div className="relative aspect-square lg:aspect-auto lg:h-full w-full rounded-2xl overflow-hidden shadow-soft">
              <Image
                src={sideImageUrl}
                alt="Happy family in Lucknow benefiting from an NGO donation"
                fill
                className="object-cover"
                data-ai-hint="happy community family"
              />
            </div>
          )}

          <Card className="p-4 sm:p-8 rounded-2xl shadow-deep bg-white/60 backdrop-blur-md border border-white/20">
            <CardHeader className="text-center p-0">
              <CardTitle className="text-3xl font-bold text-foreground">{mainHeading}</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                {mainSubheading}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-8">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Label htmlFor="donation-type" className={cn(!isMonthly && 'text-primary font-semibold')}>One-time</Label>
                <Switch id="donation-type" checked={isMonthly} onCheckedChange={setIsMonthly} />
                <Label htmlFor="donation-type" className={cn(isMonthly && 'text-primary font-semibold')}>Monthly</Label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {suggestedAmounts.map((val) => (
                  <Button
                    key={val}
                    variant="outline"
                    className={cn(
                      'w-full h-12 text-lg rounded-xl',
                      amount === val && customAmount === '' && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                    )}
                    onClick={() => handleAmountClick(val)}
                  >
                    ₹{val}
                  </Button>
                ))}
                <Input
                  type="number"
                  placeholder="Custom"
                  className="h-12 text-lg rounded-xl text-center"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                />
              </div>

              <div className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Your Name" 
                    className="rounded-xl" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address (for 80G Tax Receipt)</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    className="rounded-xl" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Mobile Number (for SMS Confirmation)</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="10-digit mobile number" 
                    className="rounded-xl" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="mt-8 w-full h-14 text-xl rounded-xl shadow-[0_10px_30px_rgba(46,139,87,0.3)] hover:bg-[#256F46]"
                onClick={handleDonate}
                disabled={loading}
              >
                {loading ? 'Initiating Secure Payment...' : 'Complete Your Secure Donation'}
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Secure payment through our trusted partners. All donations are tax-deductible.
              </p>
            </CardContent>
          </Card>
        </motion.section>
        
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">See Your Impact in Uttar Pradesh</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Every contribution to our Lucknow NGO, big or small, creates a ripple of positive change across communities.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactData.map((item) => (
              <Card key={item.title} className="text-center p-6 bg-secondary rounded-2xl shadow-soft border-0 transition-all hover:scale-105">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
                <Button variant="outline" className="mt-6 rounded-full bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground">Learn More</Button>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section
          className={cn("grid gap-12 items-start", qrImageUrl ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 max-w-3xl mx-auto")}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Frequently Asked Questions (FAQ)
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item, index) => (
                <AccordionItem value={`item-${index + 1}`} key={index} className="bg-white/70 rounded-xl mb-2 px-4 shadow-soft border-0">
                  <AccordionTrigger className="hover:no-underline font-semibold">{item.q}</AccordionTrigger>
                  <AccordionContent>
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {qrImageUrl && (
            <Card className="rounded-2xl bg-secondary shadow-soft border-0 transition-all hover:scale-105">
              <CardHeader>
                <CardTitle className="text-primary text-2xl">{qrTitle}</CardTitle>
                <CardDescription>{qrDescription}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <div className="relative w-52 h-52 mb-4 p-2 bg-white rounded-lg shadow-inner">
                  <img
                    src={qrImageUrl}
                    alt="UPI QR Code for donating to NGO in Lucknow"
                    className="w-full h-full rounded-md object-contain"
                  />
                </div>
                <p className="text-sm text-muted-foreground font-semibold">
                  Scan & Pay with any UPI App
                </p>
              
                <div className="mt-6 w-full space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-[#168039]" />
                    <span>100% Secure & Encrypted</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span className="font-bold text-[#168039] text-xs border border-[#168039] rounded-sm px-1">80G</span>
                    <span>80G Tax Benefit Certified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.section>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
          <Card className="max-w-4xl mx-auto transition-all hover:scale-105">
            <CardHeader>
              <CardTitle className="text-[#168039] flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#168039]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l4.5-4.5M12 14a4 4 0 100-8 4 4 0 000 8z" /></svg>
                A Note on Transparency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {transparencyText}
              </p>
              <Button variant="link" asChild className="p-0 mt-2">
                <Link href="/transparency">View Our NGO's Reports</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
