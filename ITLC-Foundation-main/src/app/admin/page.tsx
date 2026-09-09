'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Heart, ShieldCheck, Leaf, Users, LogIn, LayoutDashboard, Menu, 
  Settings, FolderKanban, HelpCircle, Image as ImageIcon, FileText, 
  ArrowRight, Key, Upload, Trash2, Plus, Edit, LogOut, Save,
  Mail, MapPin, DollarSign, Calendar, X, Sprout, Check, Loader2,
  Phone, Clock, Sparkles, Globe, BookOpen, ExternalLink, RefreshCw,
  Eye, EyeOff, Search, Download, Printer, Filter, CreditCard, Send,
  CheckCircle2, AlertCircle, Copy, ArrowUpRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { MediaGalleryModal } from '@/components/admin/media-gallery-modal';
import { downloadReceiptPdf, printReceiptInvoice } from '@/lib/donation-receipt';
import { BlogsManagerTab } from '@/components/admin/blogs-manager-tab';
import { ProjectsManagerTab } from '@/components/admin/projects-manager-tab';
import { BlogAdsTab } from '@/components/admin/blog-ads-tab';
import { VolunteersTab } from '@/components/admin/volunteers-tab';
import { LegalPagesTab } from '@/components/admin/legal-pages-tab';
import { AdminAccountsTab } from '@/components/admin/admin-accounts-tab';
import { ActivityLogsTab } from '@/components/admin/activity-logs-tab';
import { ContactInquiriesTab } from '@/components/admin/contact-inquiries-tab';
import { TeamMembersTab } from '@/components/admin/team-members-tab';
import { WebsiteInfoTab } from '@/components/admin/website-info-tab';

export default function AdminPage() {
  const { toast } = useToast();

  // Authentication states
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('info@itlcfoundation.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<'password' | 'otp' | 'forgot_password'>('password');
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSentMessage, setOtpSentMessage] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [showResetPass, setShowResetPass] = useState(false);
  const [adminProfile, setAdminProfile] = useState<{ email: string; username: string; role: string }>({
    email: 'info@itlcfoundation.com',
    username: 'admin',
    role: 'super_admin',
  });
  const [newAdminEmailInput, setNewAdminEmailInput] = useState('info@itlcfoundation.com');
  const [isUpdatingProfileEmail, setIsUpdatingProfileEmail] = useState(false);
  const [isUpdatingProfilePass, setIsUpdatingProfilePass] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sub-tabs for Home Page CMS
  const [homeSubTab, setHomeSubTab] = useState<'hero' | 'features' | 'updates' | 'stats' | 'projects' | 'cta' | 'stories'>('hero');
  // Sub-tabs for Services CMS: all 6 causes
  const [servicesSubTab, setServicesSubTab] = useState<'animal' | 'environment' | 'women' | 'education' | 'water' | 'social'>('animal');

  // Full CMS Data State
  const [cms, setCms] = useState<any>(null);
  const [isLoadingCms, setIsLoadingCms] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Donations logs state & Real-time Auto-sync
  const [donationsData, setDonationsData] = useState<{
    totalRaised: number;
    totalDonations: number;
    oneTimeCount: number;
    monthlyCount: number;
    donations: any[];
  }>({
    totalRaised: 0,
    totalDonations: 0,
    oneTimeCount: 0,
    monthlyCount: 0,
    donations: [],
  });
  const [isLoadingDonations, setIsLoadingDonations] = useState(false);
  const [lastDonationSync, setLastDonationSync] = useState<string>('');
  const [donationsSearch, setDonationsSearch] = useState('');
  const [donationsTypeFilter, setDonationsTypeFilter] = useState<'all' | 'one-time' | 'monthly'>('all');

  // Environment Settings (SMTP & Razorpay) State
  const [settings, setSettings] = useState({
    smtpHost: 'smtp.hostinger.com',
    smtpPort: '465',
    smtpUser: 'donation@itlcfoundation.com',
    smtpPass: '',
    smtpFrom: '"ITLC Foundation" <donation@itlcfoundation.com>',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    fast2smsApiKey: '',
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [showRzpSecret, setShowRzpSecret] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState('pankajkumarpreet4@gmail.com');
  const [isSendingTestMail, setIsSendingTestMail] = useState(false);

  // Media Library state
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  // Modal states for creating/editing items
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: string; // 'feature' | 'stat' | 'home-project' | 'story' | 'value' | 'full-project' | 'gallery-item' | 'faq';
    item: any | null;
  }>({ isOpen: false, type: '', item: null });

  // Modal form input states
  const [modalTitle, setModalTitle] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const [modalCategory, setModalCategory] = useState('');
  const [modalValue, setModalValue] = useState('');
  const [modalIcon, setModalIcon] = useState('Users');
  const [modalImage, setModalImage] = useState('');
  const [modalLink, setModalLink] = useState('');
  const [modalBadge, setModalBadge] = useState('');
  const [modalGoal, setModalGoal] = useState<number>(0);
  const [modalRaised, setModalRaised] = useState<number>(0);
  const [modalStatus, setModalStatus] = useState('Ongoing');
  const [modalQuestion, setModalQuestion] = useState('');
  const [modalAnswer, setModalAnswer] = useState('');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPresetAmount, setNewPresetAmount] = useState<string>('');

  // Fetch current admin profile info
  const fetchAdminProfile = async () => {
    try {
      const res = await fetch('/api/admin/auth');
      const data = await res.json();
      if (data.success && data.adminEmail) {
        setAdminProfile({
          email: data.adminEmail,
          username: data.username || 'admin',
          role: data.role || 'super_admin',
        });
        setAdminEmail(data.adminEmail);
        setNewAdminEmailInput(data.adminEmail);
      }
    } catch (err) {}
  };

  // OTP Countdown timer
  useEffect(() => {
    if (otpCountdown > 0) {
      const t = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [otpCountdown]);

  // Load Auth, CMS, Donations & Settings on Mount
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedEmail = localStorage.getItem('adminEmail');
    if (savedToken) {
      setToken(savedToken);
    }
    if (savedEmail) {
      setAdminEmail(savedEmail);
      setNewAdminEmailInput(savedEmail);
    }
    fetchAdminProfile();
    fetchCmsData();
    fetchDonations();
    fetchSettings();

    // Auto-poll donations every 5 seconds for live real-time sync
    const interval = setInterval(() => {
      fetchDonations(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchCmsData = async () => {
    setIsLoadingCms(true);
    try {
      const res = await fetch('/api/content/cms');
      const data = await res.json();
      if (data && !data.error) {
        setCms(data);
      }
    } catch (err) {
      console.error('Failed to load CMS data:', err);
    } finally {
      setIsLoadingCms(false);
    }
  };

  const fetchDonations = async (silent = false) => {
    if (!silent) setIsLoadingDonations(true);
    try {
      const res = await fetch('/api/donations');
      const data = await res.json();
      if (data.success) {
        setDonationsData(data);
        setLastDonationSync(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error('Failed to load donations:', err);
    } finally {
      if (!silent) setIsLoadingDonations(false);
    }
  };

  const fetchSettings = async () => {
    setIsLoadingSettings(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        if (data.settings.smtpUser && !testEmailRecipient) {
          setTestEmailRecipient('pankajkumarpreet4@gmail.com');
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Settings Saved', description: 'SMTP & Razorpay credentials updated in .env.local and runtime successfully.' });
      } else {
        toast({ title: 'Error Saving Settings', description: data.error || 'Failed to save', variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Error Saving Settings', description: err.message, variant: 'destructive' });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleSendTestMail = async () => {
    if (!testEmailRecipient) {
      toast({ title: 'Missing Recipient', description: 'Please enter an email address to send the test email to.', variant: 'destructive' });
      return;
    }
    setIsSendingTestMail(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_smtp',
          toEmail: testEmailRecipient.trim(),
          smtpHost: settings.smtpHost,
          smtpPort: settings.smtpPort,
          smtpUser: settings.smtpUser,
          smtpPass: settings.smtpPass,
          smtpFrom: settings.smtpFrom,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Live Test Email Sent!', description: `Delivered to ${testEmailRecipient} via Hostinger SMTP.` });
      } else {
        toast({ title: 'SMTP Test Failed', description: data.error || 'Could not dispatch test email.', variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsSendingTestMail(false);
    }
  };

  const handleDeleteDonation = async (id: string, donorName: string) => {
    if (!confirm(`Are you sure you want to delete the donation record for "${donorName}"?`)) return;
    try {
      const res = await fetch(`/api/donations?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Donation Deleted', description: `Record for ${donorName} removed successfully.` });
        fetchDonations(true);
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const fetchMediaLibrary = async () => {
    setIsMediaLoading(true);
    try {
      const res = await fetch('/api/content/media');
      const data = await res.json();
      if (data.media) {
        setMediaItems(data.media);
      }
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setIsMediaLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'media-library') {
      fetchMediaLibrary();
    }
  }, [activeTab]);

  // 1. Password Login Handler
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please enter both Admin Email ID and Password.' });
      return;
    }
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login_password', email: adminEmail, password: adminPassword }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminEmail', data.user.email);
        setToken(data.token);
        setAdminProfile(data.user);
        toast({ title: 'Welcome Administrator', description: `Logged in successfully as ${data.user.email}` });
      } else {
        throw new Error(data.error || 'Invalid credentials');
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Login Failed', description: err.message });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 2. Send OTP (Login or Forgot Password)
  const handleSendOtp = async (purpose: 'login' | 'reset' = 'login') => {
    if (!adminEmail) {
      toast({ variant: 'destructive', title: 'Email Required', description: 'Please enter your Admin Email ID.' });
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_otp', email: adminEmail, purpose }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSentMessage(data.message);
        setOtpCountdown(60);
        toast({ title: 'Verification Code Dispatched', description: data.message });
      } else {
        throw new Error(data.error || 'Failed to generate OTP');
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 3. Verify OTP Login
  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      toast({ variant: 'destructive', title: 'Invalid OTP', description: 'Please enter the complete 6-digit verification code.' });
      return;
    }
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_otp_login', email: adminEmail, otp: otpCode }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminEmail', data.user.email);
        setToken(data.token);
        setAdminProfile(data.user);
        toast({ title: 'OTP Verified Successfully', description: `Logged in as ${data.user.email}` });
      } else {
        throw new Error(data.error || 'Invalid or expired OTP code');
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Verification Failed', description: err.message });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 4. Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      toast({ variant: 'destructive', title: 'Invalid OTP', description: 'Please enter the 6-digit verification code.' });
      return;
    }
    if (resetNewPassword.length < 6) {
      toast({ variant: 'destructive', title: 'Weak Password', description: 'New password must be at least 6 characters long.' });
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      toast({ variant: 'destructive', title: 'Passwords Mismatch', description: 'New password and confirm password do not match.' });
      return;
    }
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_password',
          email: adminEmail,
          otp: otpCode,
          newPassword: resetNewPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Password Reset Completed!', description: data.message });
        setLoginMode('password');
        setAdminPassword(resetNewPassword);
        setOtpCode('');
        setResetNewPassword('');
        setResetConfirmPassword('');
      } else {
        throw new Error(data.error || 'Failed to reset password');
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Reset Failed', description: err.message });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 5. Update Admin Email from Admin Panel
  const handleUpdateAdminEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmailInput || !newAdminEmailInput.includes('@')) {
      toast({ variant: 'destructive', title: 'Invalid Email', description: 'Please enter a valid administrator email address.' });
      return;
    }
    setIsUpdatingProfileEmail(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          email: adminProfile.email,
          newEmail: newAdminEmailInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminProfile((prev) => ({ ...prev, email: data.admin.email }));
        setAdminEmail(data.admin.email);
        localStorage.setItem('adminEmail', data.admin.email);
        toast({ title: 'Admin Email Updated', description: `Administrator email changed to ${data.admin.email}` });
      } else {
        throw new Error(data.error || 'Failed to update email');
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Update Failed', description: err.message });
    } finally {
      setIsUpdatingProfileEmail(false);
    }
  };

  // 6. Update Password from Admin Panel
  const handleUpdateAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast({ variant: 'destructive', title: 'Error', description: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Error', description: 'New password and confirm password do not match.' });
      return;
    }
    setIsUpdatingProfilePass(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          email: adminProfile.email,
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Password Changed Successfully', description: 'Your administrator password has been updated in database.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(data.error || 'Failed to update password');
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Update Failed', description: err.message });
    } finally {
      setIsUpdatingProfilePass(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setOtpCode('');
    setLoginMode('password');
    toast({ title: 'Logged Out', description: 'You have been safely signed out of ITLC Admin Portal.' });
  };

  // Save full CMS Data
  const saveCmsData = async (newCmsState?: any) => {
    const payload = newCmsState || cms;
    if (!payload) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/content/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Changes Saved Successfully', description: 'Your updates are now live across the website.' });
      } else {
        throw new Error(data.error || 'Failed to save changes');
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Save Failed', description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoSyncLatestUpdates = async () => {
    try {
      const res = await fetch('/api/content/blogs');
      const data = await res.json();
      const blogList = (data && Array.isArray(data.blogs) && data.blogs.length > 0) ? data.blogs : [];
      if (blogList.length === 0) {
        toast({ title: 'No Blogs Found', description: 'Could not find published blogs to sync from.' });
        return;
      }

      const first = blogList[0];
      const rest = (blogList.length > 1 ? blogList.slice(1, 5) : []).concat(blogList).slice(0, 4);

      const updated = { ...cms };
      if (!updated.home) updated.home = {};
      updated.home.latestUpdates = {
        eyebrow: 'LATEST UPDATES —',
        heading: 'Latest Updates & Ground Stories',
        viewAllText: 'View All Stories',
        viewAllLink: '/blog',
        mainCard: {
          id: 'main-' + Date.now(),
          title: first.title,
          category: first.category,
          image: first.image || '/pro/tree.png',
          author: first.author || 'ITLC Editorial',
          date: first.date || 'Recent',
          link: `/blog/${first.slug}`,
        },
        subCards: rest.map((b: any, i: number) => ({
          id: `sub-${Date.now()}-${i}`,
          title: b.title,
          category: b.category,
          image: b.image || '/pro/ab.png',
          link: `/blog/${b.slug}`,
        })),
      };

      setCms(updated);
      await saveCmsData(updated);
      toast({ title: 'Auto-Synced!', description: 'Populated with the latest 5 published blogs and saved successfully!' });
    } catch (err: any) {
      toast({ title: 'Sync Failed', description: err.message, variant: 'destructive' });
    }
  };

  // Modal open handlers
  const openAddModal = (type: string) => {
    setModalState({ isOpen: true, type, item: null });
    setModalTitle('');
    setModalDesc('');
    setModalCategory('');
    setModalValue('');
    setModalIcon('Users');
    setModalImage('');
    setModalLink('');
    setModalBadge('');
    setModalGoal(100000);
    setModalRaised(50000);
    setModalStatus('Ongoing');
    setModalQuestion('');
    setModalAnswer('');
  };

  const openEditModal = (type: string, item: any) => {
    setModalState({ isOpen: true, type, item });
    setModalTitle(item.title || item.name || '');
    setModalDesc(item.description || item.alt || '');
    setModalCategory(item.category || '');
    setModalValue(item.value || '');
    setModalIcon(item.icon || 'Users');
    setModalImage(item.image || '');
    setModalLink(item.link || '');
    setModalBadge(item.badge || '');
    setModalGoal(item.goal || 0);
    setModalRaised(item.raised || 0);
    setModalStatus(item.status || 'Ongoing');
    setModalQuestion(item.question || '');
    setModalAnswer(item.answer || '');
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: '', item: null });
  };

  // Save Modal Item (Add or Update)
  const handleModalSave = async () => {
    if (!cms) return;
    const newCms = JSON.parse(JSON.stringify(cms));
    const isEdit = Boolean(modalState.item);
    const itemId = isEdit ? modalState.item.id : `id-${Date.now()}`;

    if (modalState.type === 'feature') {
      const newItem = { id: itemId, title: modalTitle, description: modalDesc, icon: modalIcon };
      if (isEdit) {
        newCms.home.features = newCms.home.features.map((f: any) => f.id === itemId ? newItem : f);
      } else {
        newCms.home.features.push(newItem);
      }
    } else if (modalState.type === 'stat') {
      const newItem = { id: itemId, value: modalValue, label: modalTitle, icon: modalIcon };
      if (isEdit) {
        newCms.home.stats = newCms.home.stats.map((s: any) => s.id === itemId ? newItem : s);
      } else {
        newCms.home.stats.push(newItem);
      }
    } else if (modalState.type === 'home-project') {
      const newItem = { id: itemId, title: modalTitle, description: modalDesc, image: modalImage, badge: modalBadge, link: modalLink || '/projects' };
      if (isEdit) {
        newCms.home.projects = newCms.home.projects.map((p: any) => p.id === itemId ? newItem : p);
      } else {
        newCms.home.projects.push(newItem);
      }
    } else if (modalState.type === 'home-subcard') {
      const newItem = { id: itemId, title: modalTitle, category: modalCategory || 'General', image: modalImage || '/pro/tree.png', link: modalLink || '/blog' };
      if (!newCms.home.latestUpdates) {
        newCms.home.latestUpdates = {
          eyebrow: 'LATEST UPDATES —',
          heading: 'Latest Updates & Ground Stories',
          viewAllText: 'View All Stories',
          viewAllLink: '/blog',
          mainCard: {},
          subCards: []
        };
      }
      if (!Array.isArray(newCms.home.latestUpdates.subCards)) {
        newCms.home.latestUpdates.subCards = [];
      }
      if (isEdit) {
        newCms.home.latestUpdates.subCards = newCms.home.latestUpdates.subCards.map((c: any) => c.id === itemId ? newItem : c);
      } else {
        newCms.home.latestUpdates.subCards.push(newItem);
      }
    } else if (modalState.type === 'story') {
      const newItem = { id: itemId, image: modalImage, alt: modalDesc };
      if (isEdit) {
        newCms.home.stories = newCms.home.stories.map((s: any) => s.id === itemId ? newItem : s);
      } else {
        newCms.home.stories.push(newItem);
      }
    } else if (modalState.type === 'value') {
      const newItem = { id: itemId, name: modalTitle, description: modalDesc };
      if (isEdit) {
        newCms.about.values = newCms.about.values.map((v: any) => v.id === itemId ? newItem : v);
      } else {
        newCms.about.values.push(newItem);
      }
    } else if (modalState.type === 'full-project') {
      const progress = modalGoal > 0 ? Math.min(100, Math.round((modalRaised / modalGoal) * 100)) : 0;
      const newItem = {
        id: itemId,
        title: modalTitle,
        category: modalCategory || 'Community',
        description: modalDesc,
        image: modalImage,
        goal: modalGoal,
        raised: modalRaised,
        progress,
        status: modalStatus
      };
      if (isEdit) {
        newCms.projects = newCms.projects.map((p: any) => p.id === itemId ? newItem : p);
      } else {
        newCms.projects.push(newItem);
      }
    } else if (modalState.type === 'gallery-item') {
      const newItem = { id: itemId, title: modalTitle, image: modalImage, category: modalCategory || 'General' };
      if (isEdit) {
        newCms.gallery = newCms.gallery.map((g: any) => g.id === itemId ? newItem : g);
      } else {
        newCms.gallery.push(newItem);
      }
    } else if (modalState.type === 'faq') {
      const newItem = { id: itemId, question: modalQuestion, answer: modalAnswer };
      if (isEdit) {
        newCms.donate.faqs = newCms.donate.faqs.map((f: any) => f.id === itemId ? newItem : f);
      } else {
        newCms.donate.faqs.push(newItem);
      }
    }

    setCms(newCms);
    closeModal();
    await saveCmsData(newCms);
  };

  // Delete Item handler
  const handleDeleteItem = async (listType: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    if (!cms) return;
    const newCms = JSON.parse(JSON.stringify(cms));

    if (listType === 'feature') newCms.home.features = newCms.home.features.filter((f: any) => f.id !== id);
    if (listType === 'stat') newCms.home.stats = newCms.home.stats.filter((s: any) => s.id !== id);
    if (listType === 'home-project') newCms.home.projects = newCms.home.projects.filter((p: any) => p.id !== id);
    if (listType === 'home-subcard') {
      if (newCms.home?.latestUpdates?.subCards) {
        newCms.home.latestUpdates.subCards = newCms.home.latestUpdates.subCards.filter((c: any) => c.id !== id);
      }
    }
    if (listType === 'story') newCms.home.stories = newCms.home.stories.filter((s: any) => s.id !== id);
    if (listType === 'value') newCms.about.values = newCms.about.values.filter((v: any) => v.id !== id);
    if (listType === 'full-project') newCms.projects = newCms.projects.filter((p: any) => p.id !== id);
    if (listType === 'gallery-item') newCms.gallery = newCms.gallery.filter((g: any) => g.id !== id);
    if (listType === 'faq') newCms.donate.faqs = newCms.donate.faqs.filter((f: any) => f.id !== id);

    setCms(newCms);
    await saveCmsData(newCms);
  };

  // Change Password


  // IF NOT LOGGED IN -> RENDER LOGIN FORM
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#083a27] via-[#0d4f34] to-[#083a27] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-7 sm:p-8 shadow-2xl border border-emerald-100 relative overflow-hidden">
          
          {/* Header Brand */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-white p-2 flex items-center justify-center shadow-lg border border-emerald-200 mb-3.5">
              <div className="relative w-full h-full">
                <Image src="/ref/logo.png" alt="ITLC Logo" fill sizes="80px" className="object-contain" priority />
              </div>
            </div>
            <h1 className="text-xl font-black text-gray-900 font-headline uppercase tracking-wider">
              ITLC FOUNDATION
            </h1>
            <p className="text-xs text-[#168039] font-bold mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal &bull; info@itlcfoundation.com</span>
            </p>
          </div>

          {/* Mode Switcher Tabs (Only shown when not resetting password) */}
          {loginMode !== 'forgot_password' && (
            <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
              <button
                type="button"
                onClick={() => {
                  setLoginMode('password');
                  setOtpCode('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginMode === 'password'
                    ? 'bg-white text-[#168039] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Password Login</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMode('otp');
                  setAdminPassword('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginMode === 'otp'
                    ? 'bg-white text-[#168039] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Login with OTP</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: LOGIN WITH PASSWORD                                                */}
          {/* ========================================================================= */}
          {loginMode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Admin Email ID
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="info@itlcfoundation.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium outline-none focus:border-[#168039] focus:ring-1 focus:ring-[#168039]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Default SuperAdmin: info@itlcfoundation.com</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('forgot_password');
                      setOtpCode('');
                      setResetNewPassword('');
                      setResetConfirmPassword('');
                    }}
                    className="text-[11px] text-[#0f5b9e] hover:text-[#168039] font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 text-sm font-medium outline-none focus:border-[#168039] focus:ring-1 focus:ring-[#168039]"
                  />
                  <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#168039] hover:bg-[#137233] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                <span>Sign In with Password</span>
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: LOGIN WITH OTP                                                     */}
          {/* ========================================================================= */}
          {loginMode === 'otp' && (
            <form onSubmit={handleOtpLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Admin Email ID
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="info@itlcfoundation.com"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium outline-none focus:border-[#168039]"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="button"
                    disabled={isSendingOtp || otpCountdown > 0}
                    onClick={() => handleSendOtp('login')}
                    className="bg-emerald-50 hover:bg-emerald-100 text-[#168039] border border-emerald-300 px-3.5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-colors disabled:opacity-60 cursor-pointer flex items-center gap-1"
                  >
                    {isSendingOtp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>{otpCountdown > 0 ? `${otpCountdown}s` : 'Send OTP'}</span>
                  </button>
                </div>
                {otpSentMessage && (
                  <div className="mt-2 bg-emerald-50/90 border border-emerald-200 rounded-xl p-2.5 text-center">
                    <p className="text-xs text-[#168039] font-semibold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-[#168039]" />
                      <span>{otpSentMessage}</span>
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Please check your email inbox (or spam folder) for the 6-digit verification code.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full px-4 py-3 text-center tracking-[8px] font-mono text-lg font-bold rounded-xl border border-gray-300 outline-none focus:border-[#168039] focus:ring-1 focus:ring-[#168039]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn || otpCode.length < 6}
                className="w-full bg-[#168039] hover:bg-[#137233] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>Verify OTP &amp; Sign In</span>
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: FORGOT / RESET PASSWORD                                            */}
          {/* ========================================================================= */}
          {loginMode === 'forgot_password' && (
            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 mb-2">
                <h3 className="text-xs font-bold text-[#0f5b9e] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  <span>Reset Administrator Password</span>
                </h3>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Enter your admin email to receive a 6-digit OTP code to verify and reset your master password.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Admin Email ID
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="info@itlcfoundation.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs font-medium outline-none focus:border-[#168039]"
                    />
                    <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="button"
                    disabled={isSendingOtp || otpCountdown > 0}
                    onClick={() => handleSendOtp('reset')}
                    className="bg-emerald-50 hover:bg-emerald-100 text-[#168039] border border-emerald-300 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors disabled:opacity-60 cursor-pointer flex items-center gap-1"
                  >
                    {isSendingOtp ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    <span>{otpCountdown > 0 ? `${otpCountdown}s` : 'Get Code'}</span>
                  </button>
                </div>
                {otpSentMessage && (
                  <div className="mt-2 bg-emerald-50/90 border border-emerald-200 rounded-xl p-2 text-center">
                    <p className="text-xs text-[#168039] font-semibold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#168039]" />
                      <span>{otpSentMessage}</span>
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Check your email inbox (or spam folder) for the 6-digit reset code.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full px-4 py-2.5 text-center tracking-[6px] font-mono text-base font-bold rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showResetPass ? 'text' : 'password'}
                    required
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-9 py-2 rounded-xl border border-gray-300 text-xs font-medium outline-none focus:border-[#168039]"
                  />
                  <Key className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowResetPass(!showResetPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showResetPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showResetPass ? 'text' : 'password'}
                  required
                  value={resetConfirmPassword}
                  onChange={(e) => setResetConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-medium outline-none focus:border-[#168039]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#0f5b9e] hover:bg-[#0d4f8b] text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoggingIn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Set New Password &amp; Login</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('password');
                    setOtpCode('');
                  }}
                  className="text-xs text-gray-500 hover:text-gray-800 font-semibold cursor-pointer"
                >
                  &larr; Back to Login
                </button>
              </div>
            </form>
          )}

          <div className="mt-5 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            Secure Encrypted Session &bull; ITLC Foundation Lucknow
          </div>
        </div>
      </div>
    );
  }

  // SIDEBAR NAVIGATION ITEMS
  const sidebarItems = [
    { id: 'overview', label: '1. Overview & Analytics', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'home-cms', label: '2. Home Page CMS', icon: <Globe className="w-5 h-5" /> },
    { id: 'about-cms', label: '3. About Us Page', icon: <Users className="w-5 h-5" /> },
    { id: 'team-cms', label: '4. Team Members', icon: <Users className="w-5 h-5" /> },
    { id: 'projects-cms', label: '5. Projects Page', icon: <FolderKanban className="w-5 h-5" /> },
    { id: 'gallery-cms', label: '6. Gallery Page', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 'services-cms', label: '7. Services & 6 Causes', icon: <Leaf className="w-5 h-5" /> },
    { id: 'blogs-cms', label: '8. Blogs & Multi-Image CMS', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'blog-ads', label: '9. Blog Ads (4 Slots & Monetization)', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'volunteers-cms', label: '10. Volunteer Applications', icon: <Heart className="w-5 h-5" /> },
    { id: 'contact-inquiries', label: '11. Contact Inquiries Inbox', icon: <Mail className="w-5 h-5" /> },
    { id: 'site-info', label: '12. Website Info (Logo & Favicon)', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'legal-cms', label: '13. Legal & Policy Pages', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'contact-cms', label: '13. Contact & Office Info', icon: <MapPin className="w-5 h-5" /> },
    { id: 'donate-cms', label: '14. Donate Landing Page', icon: <Heart className="w-5 h-5" /> },
    { id: 'modal-cms', label: '15. Donation Popup Modal', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'footer-cms', label: '16. Footer Management', icon: <FileText className="w-5 h-5" /> },
    { id: 'donations-logs', label: '17. Donation Records (80G)', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'media-library', label: '18. Media Library', icon: <Upload className="w-5 h-5" /> },
    { id: 'admin-accounts', label: '19. Admin Accounts & RBAC', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'activity-logs', label: '20. Activity Audit Logs', icon: <Clock className="w-5 h-5" /> },
    { id: 'settings', label: '21. Settings & Razorpay', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#f3f7f4] flex text-gray-900">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* SIDEBAR                                                                   */}
      {/* ========================================================================= */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#083a27] text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative h-12 md:h-14 w-auto flex items-center shrink-0">
              <Image 
                src={cms?.site?.logo || "/ref/logo.png"} 
                alt="ITLC Logo" 
                width={160} 
                height={56} 
                className="h-11 md:h-13 w-auto object-contain" 
              />
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
          <div className="px-3 py-1.5 text-[10px] font-bold text-emerald-300/70 uppercase tracking-wider">
            Site Navigation Order
          </div>

          {sidebarItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#168039] text-white font-bold shadow-sm'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom User Bar */}
        <div className="p-4 border-t border-white/10 bg-black/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#168039] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="text-left overflow-hidden">
              <div className="text-xs font-bold text-white truncate" title={adminProfile.email}>
                {adminProfile.email}
              </div>
              <div className="text-[10px] text-emerald-300 font-medium capitalize">
                {adminProfile.role.replace('_', ' ')}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            className="p-2 text-white/70 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA                                                         */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col text-left">
              <span className="text-[#168039] font-bold text-[10px] tracking-widest uppercase font-headline">
                CONTROL PANEL —
              </span>
              <h1 className="text-base sm:text-lg font-extrabold capitalize tracking-tight font-headline">
                <span className="text-[#0f5b9e]">{sidebarItems.find((s) => s.id === activeTab)?.label?.split(' ')[0] || 'Dashboard'}</span>{' '}
                <span className="text-[#168039]">{sidebarItems.find((s) => s.id === activeTab)?.label?.split(' ').slice(1).join(' ') || 'Control'}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-[#168039] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-bold">{adminProfile.email}</span>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </a>

            {cms && (
              <button
                type="button"
                disabled={isSaving}
                onClick={() => saveCmsData()}
                className="bg-[#168039] hover:bg-[#137233] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-75"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Save All Changes</span>
              </button>
            )}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {isLoadingCms ? (
            <div className="py-24 flex flex-col items-center justify-center text-gray-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#168039]" />
              <p className="text-xs font-medium">Loading CMS configuration...</p>
            </div>
          ) : !cms ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-red-200 text-red-600 text-sm">
              Failed to load CMS content file. Please check server logs.
            </div>
          ) : (
            <div>

              {/* ========================================================================= */}
              {/* TAB 1: OVERVIEW & ANALYTICS                                               */}
              {/* ========================================================================= */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Top Welcome Banner */}
                  <div className="bg-gradient-to-r from-[#083a27] via-[#0d4f34] to-[#083a27] text-white p-7 rounded-3xl shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                      <span className="text-emerald-300 font-bold text-xs uppercase tracking-widest block font-headline mb-2">
                        CMS &amp; DONATION CONTROLS —
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black font-headline">
                        <span>Welcome to </span>
                        <span className="text-emerald-300">ITLC Foundation Control Panel</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-emerald-100 mt-1.5 max-w-2xl leading-relaxed">
                        Full site-wide management with real-time donation tracking, instant Section 80G tax invoices, and comprehensive direct-device media gallery uploads.
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2.5">
                        <button
                          type="button"
                          onClick={() => setActiveTab('donations-logs')}
                          className="bg-emerald-400 hover:bg-emerald-300 text-[#083a27] px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
                        >
                          <Heart className="w-4 h-4 fill-[#083a27]" /> View All Donations ({donationsData.totalDonations})
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('home-cms')}
                          className="bg-white text-[#083a27] hover:bg-emerald-50 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          Edit Home Page
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('settings')}
                          className="bg-white/15 hover:bg-white/25 text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                        >
                          <Settings className="w-4 h-4" /> SMTP &amp; Razorpay Config
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* REAL-TIME DONATION ANALYTICS (CLICKABLE TO OPEN DONATIONS LOGS) */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
                          FINANCIAL MONITORING —
                        </span>
                        <h3 className="text-base sm:text-lg font-bold tracking-tight font-headline flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-[#168039]" />
                          <span className="text-[#0f5b9e]">Live Donation Analytics</span>{' '}
                          <span className="text-[#168039]">&amp; Funds</span>
                        </h3>
                        <p className="text-xs text-gray-500">Real-time sync with website donation modal &amp; payment gateway.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Live Sync Active {lastDonationSync ? `(${lastDonationSync})` : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            fetchDonations(false);
                            toast({ title: 'Refreshed', description: 'Live donations synchronized.' });
                          }}
                          className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                          title="Refresh Now"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDonations ? 'animate-spin text-[#168039]' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Total Funds Raised Card (Clickable) */}
                      <div
                        onClick={() => setActiveTab('donations-logs')}
                        className="bg-gradient-to-br from-white to-emerald-50/50 p-5 rounded-2xl border-2 border-emerald-100 hover:border-[#168039] transition-all cursor-pointer shadow-2xs hover:shadow-md group"
                      >
                        <div className="flex items-center justify-between text-gray-500 mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#168039]">Total Funds Raised</span>
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 group-hover:bg-[#168039] text-[#168039] group-hover:text-white flex items-center justify-center transition-colors">
                            <DollarSign className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-gray-900 font-headline">
                          ₹ {donationsData.totalRaised.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="flex items-center justify-between mt-2 text-[11px] text-gray-500 font-medium">
                          <span>Across {donationsData.totalDonations} contributions</span>
                          <span className="text-[#168039] font-bold inline-flex items-center gap-0.5 group-hover:underline">
                            View all <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>

                      {/* Total Verified Donors Card (Clickable) */}
                      <div
                        onClick={() => setActiveTab('donations-logs')}
                        className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-[#168039] transition-all cursor-pointer shadow-2xs hover:shadow-md group"
                      >
                        <div className="flex items-center justify-between text-gray-500 mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider">Total Donors</span>
                          <div className="w-8 h-8 rounded-xl bg-gray-100 group-hover:bg-[#168039] text-gray-700 group-hover:text-white flex items-center justify-center transition-colors">
                            <Users className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-gray-900 font-headline">
                          {donationsData.totalDonations} <span className="text-xs font-normal text-gray-500">Supporters</span>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-[11px] text-gray-500 font-medium">
                          <span className="text-emerald-700 font-semibold">✓ 100% 80G Certified</span>
                          <span className="text-[#168039] font-bold inline-flex items-center gap-0.5 group-hover:underline">
                            Logs <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>

                      {/* Donation Distribution Card (Clickable) */}
                      <div
                        onClick={() => setActiveTab('donations-logs')}
                        className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-[#168039] transition-all cursor-pointer shadow-2xs hover:shadow-md group"
                      >
                        <div className="flex items-center justify-between text-gray-500 mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider">Contribution Types</span>
                          <div className="w-8 h-8 rounded-xl bg-gray-100 group-hover:bg-[#168039] text-gray-700 group-hover:text-white flex items-center justify-center transition-colors">
                            <CreditCard className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-lg font-black text-gray-900 flex items-center gap-2 mt-1">
                          <span className="text-emerald-700">{donationsData.oneTimeCount} One-time</span>
                          <span className="text-gray-300">|</span>
                          <span className="text-blue-700">{donationsData.monthlyCount} Monthly</span>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-[11px] text-gray-500 font-medium">
                          <span>Recurring + Lump-sum</span>
                          <span className="text-[#168039] font-bold inline-flex items-center gap-0.5 group-hover:underline">
                            Filter <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>

                      {/* Average Contribution Card (Clickable) */}
                      <div
                        onClick={() => setActiveTab('donations-logs')}
                        className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-[#168039] transition-all cursor-pointer shadow-2xs hover:shadow-md group"
                      >
                        <div className="flex items-center justify-between text-gray-500 mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider">Avg Contribution</span>
                          <div className="w-8 h-8 rounded-xl bg-gray-100 group-hover:bg-[#168039] text-gray-700 group-hover:text-white flex items-center justify-center transition-colors">
                            <Sparkles className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-gray-900 font-headline">
                          ₹ {Math.round(donationsData.totalDonations ? donationsData.totalRaised / donationsData.totalDonations : 0).toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-center justify-between mt-2 text-[11px] text-gray-500 font-medium">
                          <span>Per donation average</span>
                          <span className="text-[#168039] font-bold inline-flex items-center gap-0.5 group-hover:underline">
                            Details <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RECENT LIVE DONATIONS FEED (CLICKABLE) */}
                  <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-2xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
                          DONATION AUDIT TRAIL —
                        </span>
                        <h4 className="text-base sm:text-lg font-bold tracking-tight font-headline flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#168039]" />
                          <span className="text-[#0f5b9e]">Recent Live Donations</span>{' '}
                          <span className="text-[#168039]">&amp; 80G Receipts</span>
                        </h4>
                        <p className="text-xs text-gray-500">Instant updates as donors contribute through the website modal.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('donations-logs')}
                        className="text-xs font-bold text-[#168039] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                      >
                        View All Records ({donationsData.totalDonations}) <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {donationsData.donations.length === 0 ? (
                      <div className="text-center py-10 text-gray-400 text-xs">
                        No donations recorded yet. Contributions made via the website will appear here in real-time.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-gray-100 rounded-2xl overflow-hidden">
                          <thead className="bg-gray-50/80 text-gray-600 font-bold border-b border-gray-200">
                            <tr>
                              <th className="p-3">Donor</th>
                              <th className="p-3">Contact</th>
                              <th className="p-3">Receipt No</th>
                              <th className="p-3">Frequency</th>
                              <th className="p-3 text-right">Amount</th>
                              <th className="p-3 text-center">Receipt Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {donationsData.donations.slice(0, 5).map((don: any) => (
                              <tr
                                key={don.id || don.receiptNo}
                                className="hover:bg-emerald-50/40 transition-colors"
                              >
                                <td className="p-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#083a27] font-bold text-xs flex items-center justify-center shrink-0">
                                      {(don.donorName || 'D').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="font-bold text-gray-900">{don.donorName}</div>
                                      <div className="text-[10px] text-gray-400">{don.date || 'Recent'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="text-gray-700 font-medium">{don.donorEmail}</div>
                                  <div className="text-[11px] text-gray-400">+91 {don.donorPhone}</div>
                                </td>
                                <td className="p-3">
                                  <span className="font-mono text-[11px] bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md font-semibold">
                                    {don.receiptNo}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    (don.type || '').toLowerCase().includes('month')
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-emerald-100 text-[#168039]'
                                  }`}>
                                    {(don.type || '').toLowerCase().includes('month') ? 'Monthly' : 'One-time'}
                                  </span>
                                </td>
                                <td className="p-3 text-right font-black text-gray-900 text-sm">
                                  ₹ {Number(don.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        downloadReceiptPdf({
                                          receiptNo: don.receiptNo,
                                          donorName: don.donorName,
                                          donorEmail: don.donorEmail,
                                          donorPhone: don.donorPhone,
                                          amount: Number(don.amount),
                                          type: don.type || 'One-time',
                                          date: don.date || 'September 2026',
                                          paymentId: don.paymentId || 'pay_verified',
                                        });
                                        toast({ title: 'Downloading 80G Receipt', description: `PDF for ${don.donorName} generated.` });
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#168039] font-bold text-[11px] border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                                      title="Download Official 80G PDF"
                                    >
                                      <Download className="w-3 h-3" /> PDF
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        printReceiptInvoice({
                                          receiptNo: don.receiptNo,
                                          donorName: don.donorName,
                                          donorEmail: don.donorEmail,
                                          donorPhone: don.donorPhone,
                                          amount: Number(don.amount),
                                          type: don.type || 'One-time',
                                          date: don.date || 'September 2026',
                                          paymentId: don.paymentId || 'pay_verified',
                                        });
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                                      title="Print Official Invoice"
                                    >
                                      <Printer className="w-3 h-3" /> Print
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Website CMS Content Summary Cards */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
                        CONTENT REPOSITORY —
                      </span>
                      <h3 className="text-base sm:text-lg font-bold tracking-tight font-headline flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-[#168039]" />
                        <span className="text-[#0f5b9e]">Website CMS</span>{' '}
                        <span className="text-[#168039]">Structure Overview</span>
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div
                        onClick={() => setActiveTab('home-cms')}
                        className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-[#168039] shadow-2xs transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between text-gray-500 mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider">Home Focus Areas</span>
                          <BookOpen className="w-5 h-5 text-[#168039] group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-2xl font-black text-gray-900">{cms.home.features.length}</div>
                        <div className="text-[11px] text-gray-400 mt-1">Active focus cards under Hero</div>
                      </div>

                      <div
                        onClick={() => setActiveTab('home-cms')}
                        className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-[#168039] shadow-2xs transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between text-gray-500 mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider">Impact Counters</span>
                          <Users className="w-5 h-5 text-[#168039] group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-2xl font-black text-gray-900">{cms.home.stats.length}</div>
                        <div className="text-[11px] text-gray-400 mt-1">Live metrics across the portal</div>
                      </div>

                      <div
                        onClick={() => setActiveTab('projects-cms')}
                        className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-[#168039] shadow-2xs transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between text-gray-500 mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider">Campaign Projects</span>
                          <FolderKanban className="w-5 h-5 text-[#168039] group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-2xl font-black text-gray-900">{cms.projects.length}</div>
                        <div className="text-[11px] text-gray-400 mt-1">Full fundraising drives</div>
                      </div>

                      <div
                        onClick={() => setActiveTab('gallery-cms')}
                        className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-[#168039] shadow-2xs transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between text-gray-500 mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider">Moments of Impact</span>
                          <ImageIcon className="w-5 h-5 text-[#168039] group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-2xl font-black text-gray-900">{cms.gallery.length}</div>
                        <div className="text-[11px] text-gray-400 mt-1">Categorized gallery photos</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: HOME PAGE CMS                                                      */}
              {/* ========================================================================= */}
              {activeTab === 'home-cms' && (
                <div className="space-y-6">
                  {/* Home Sub-navigation bar */}
                  <div className="bg-white p-2 rounded-2xl border border-gray-200 flex flex-wrap gap-1.5 shadow-2xs">
                    {[
                      { id: 'hero', label: '1. Hero Section' },
                      { id: 'features', label: '2. Focus Areas' },
                      { id: 'updates', label: '3. Latest Updates (Blog Grid)' },
                      { id: 'stats', label: '4. Impact Stats' },
                      { id: 'projects', label: '5. Key Projects' },
                      { id: 'cta', label: '6. "Be Part of Change"' },
                      { id: 'stories', label: '7. Stories from Ground' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setHomeSubTab(tab.id as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          homeSubTab === tab.id
                            ? 'bg-[#168039] text-white shadow-xs'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* 1. HERO SECTION */}
                  {homeSubTab === 'hero' && (
                    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Hero Section Content &amp; Photograph</h3>
                        <p className="text-xs text-gray-500">Edit the primary headline, intro text, action buttons, and the unboxed HD photo.</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Main Headline
                          </label>
                          <input
                            type="text"
                            value={cms.home.hero.heading}
                            onChange={(e) => {
                              const updated = { ...cms };
                              updated.home.hero.heading = e.target.value;
                              setCms(updated);
                            }}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold outline-none focus:border-[#168039]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Introductory Subtitle / Paragraph
                          </label>
                          <textarea
                            rows={3}
                            value={cms.home.hero.subtitle}
                            onChange={(e) => {
                              const updated = { ...cms };
                              updated.home.hero.subtitle = e.target.value;
                              setCms(updated);
                            }}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#168039]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                              Primary Button Text
                            </label>
                            <input
                              type="text"
                              value={cms.home.hero.primaryBtnText}
                              onChange={(e) => {
                                const updated = { ...cms };
                                updated.home.hero.primaryBtnText = e.target.value;
                                setCms(updated);
                              }}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#168039]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                              Secondary Button Text
                            </label>
                            <input
                              type="text"
                              value={cms.home.hero.secondaryBtnText}
                              onChange={(e) => {
                                const updated = { ...cms };
                                updated.home.hero.secondaryBtnText = e.target.value;
                                setCms(updated);
                              }}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#168039]"
                            />
                          </div>
                        </div>

                        {/* Direct Image Upload for Hero */}
                        <ImageUploadField
                          label="Right-Side Hero Photograph"
                          hint="Unboxed HD photo covering right side of section"
                          value={cms.home.hero.image}
                          onChange={(url) => {
                            const updated = { ...cms };
                            updated.home.hero.image = url;
                            setCms(updated);
                          }}
                          aspect="wide"
                        />
                      </div>
                    </div>
                  )}

                  {/* 2. FOCUS AREAS / FEATURES */}
                  {homeSubTab === 'features' && (
                    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Focus Areas &amp; Pillars</h3>
                          <p className="text-xs text-gray-500">The 4 key pillars highlighted below the hero section.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openAddModal('feature')}
                          className="bg-[#168039] hover:bg-[#137233] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Pillar</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {cms.home.features.map((feat: any) => (
                          <div key={feat.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-sm text-gray-900">{feat.title}</span>
                                <span className="text-[10px] font-mono text-[#168039] bg-emerald-100 px-2 py-0.5 rounded-md">{feat.icon}</span>
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed">{feat.description}</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal('feature', feat)}
                                className="text-gray-700 hover:text-[#168039] text-xs font-semibold px-2.5 py-1 rounded-lg border border-gray-300 hover:border-[#168039] flex items-center gap-1 cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem('feature', feat.id)}
                                className="text-red-600 hover:text-red-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-red-200 hover:bg-red-50 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. LATEST UPDATES (BLOG HERO GRID) */}
                  {homeSubTab === 'updates' && (
                    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Latest Updates (Home Blog Hero Section)</h3>
                          <p className="text-xs text-gray-500">
                            Configure all elements of the blog grid: section titles, the large hero card, and the 4 sub-cards.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={handleAutoSyncLatestUpdates}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Auto-fill with Latest Blogs</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => saveCmsData(cms)}
                            disabled={isSaving}
                            className="bg-[#168039] hover:bg-[#137233] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 transition-all"
                          >
                            <Save className="w-4 h-4" />
                            <span>{isSaving ? 'Saving...' : 'Save Updates'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Section Header Controls */}
                      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Section Header</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Eyebrow Tagline</label>
                            <input
                              type="text"
                              value={cms.home?.latestUpdates?.eyebrow || ''}
                              onChange={(e) => {
                                const updated = { ...cms };
                                if (!updated.home.latestUpdates) updated.home.latestUpdates = {};
                                updated.home.latestUpdates.eyebrow = e.target.value;
                                setCms(updated);
                              }}
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold outline-none focus:border-[#168039]"
                              placeholder="e.g. LATEST UPDATES —"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Main Heading</label>
                            <input
                              type="text"
                              value={cms.home?.latestUpdates?.heading || ''}
                              onChange={(e) => {
                                const updated = { ...cms };
                                if (!updated.home.latestUpdates) updated.home.latestUpdates = {};
                                updated.home.latestUpdates.heading = e.target.value;
                                setCms(updated);
                              }}
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold outline-none focus:border-[#168039]"
                              placeholder="e.g. Latest Updates & Ground Stories"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Button / Link Text</label>
                            <input
                              type="text"
                              value={cms.home?.latestUpdates?.viewAllText || ''}
                              onChange={(e) => {
                                const updated = { ...cms };
                                if (!updated.home.latestUpdates) updated.home.latestUpdates = {};
                                updated.home.latestUpdates.viewAllText = e.target.value;
                                setCms(updated);
                              }}
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold outline-none focus:border-[#168039]"
                              placeholder="e.g. View All Stories"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Button Link URL</label>
                            <input
                              type="text"
                              value={cms.home?.latestUpdates?.viewAllLink || ''}
                              onChange={(e) => {
                                const updated = { ...cms };
                                if (!updated.home.latestUpdates) updated.home.latestUpdates = {};
                                updated.home.latestUpdates.viewAllLink = e.target.value;
                                setCms(updated);
                              }}
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold outline-none focus:border-[#168039]"
                              placeholder="/blog"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Large Main Featured Card */}
                      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Large Featured Card (Left ~50% Column)</h4>
                          <p className="text-[11px] text-gray-500">The primary prominent hero card displayed on the left.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 mb-1">Card Title</label>
                            <input
                              type="text"
                              value={cms.home?.latestUpdates?.mainCard?.title || ''}
                              onChange={(e) => {
                                const updated = { ...cms };
                                if (!updated.home.latestUpdates) updated.home.latestUpdates = {};
                                if (!updated.home.latestUpdates.mainCard) updated.home.latestUpdates.mainCard = {};
                                updated.home.latestUpdates.mainCard.title = e.target.value;
                                setCms(updated);
                              }}
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold outline-none focus:border-[#168039]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Category Badge</label>
                            <input
                              type="text"
                              value={cms.home?.latestUpdates?.mainCard?.category || ''}
                              onChange={(e) => {
                                const updated = { ...cms };
                                if (!updated.home.latestUpdates) updated.home.latestUpdates = {};
                                if (!updated.home.latestUpdates.mainCard) updated.home.latestUpdates.mainCard = {};
                                updated.home.latestUpdates.mainCard.category = e.target.value;
                                setCms(updated);
                              }}
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold outline-none focus:border-[#168039]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Target Link URL</label>
                            <input
                              type="text"
                              value={cms.home?.latestUpdates?.mainCard?.link || ''}
                              onChange={(e) => {
                                const updated = { ...cms };
                                if (!updated.home.latestUpdates) updated.home.latestUpdates = {};
                                if (!updated.home.latestUpdates.mainCard) updated.home.latestUpdates.mainCard = {};
                                updated.home.latestUpdates.mainCard.link = e.target.value;
                                setCms(updated);
                              }}
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold outline-none focus:border-[#168039]"
                              placeholder="/blog/slug-or-link"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Author Name</label>
                            <input
                              type="text"
                              value={cms.home?.latestUpdates?.mainCard?.author || ''}
                              onChange={(e) => {
                                const updated = { ...cms };
                                if (!updated.home.latestUpdates) updated.home.latestUpdates = {};
                                if (!updated.home.latestUpdates.mainCard) updated.home.latestUpdates.mainCard = {};
                                updated.home.latestUpdates.mainCard.author = e.target.value;
                                setCms(updated);
                              }}
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold outline-none focus:border-[#168039]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Published Date</label>
                            <input
                              type="text"
                              value={cms.home?.latestUpdates?.mainCard?.date || ''}
                              onChange={(e) => {
                                const updated = { ...cms };
                                if (!updated.home.latestUpdates) updated.home.latestUpdates = {};
                                if (!updated.home.latestUpdates.mainCard) updated.home.latestUpdates.mainCard = {};
                                updated.home.latestUpdates.mainCard.date = e.target.value;
                                setCms(updated);
                              }}
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold outline-none focus:border-[#168039]"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <ImageUploadField
                              label="Main Featured Image (Upload or Pick from Library)"
                              value={cms.home?.latestUpdates?.mainCard?.image || ''}
                              onChange={(url) => {
                                const updated = { ...cms };
                                if (!updated.home.latestUpdates) updated.home.latestUpdates = {};
                                if (!updated.home.latestUpdates.mainCard) updated.home.latestUpdates.mainCard = {};
                                updated.home.latestUpdates.mainCard.image = url;
                                setCms(updated);
                              }}
                              aspect="video"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Sub-cards (Right 2x2 Grid) */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                              Sub-Cards (Right 2x2 Grid: {cms.home?.latestUpdates?.subCards?.length || 0} cards)
                            </h4>
                            <p className="text-[11px] text-gray-500">The 4 cards displayed on the right side of the section.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => openAddModal('home-subcard')}
                            className="bg-[#168039] hover:bg-[#137233] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Sub-Card</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {(cms.home?.latestUpdates?.subCards || []).map((card: any, idx: number) => (
                            <div key={card.id || idx} className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-xs flex flex-col justify-between">
                              <div>
                                <div className="relative h-28 w-full bg-gray-100">
                                  {card.image && (
                                    <Image src={card.image} alt={card.title} fill sizes="250px" className="object-cover" />
                                  )}
                                  <span className="absolute top-2 left-2 bg-[#0f5b9e] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-2xs">
                                    {card.category}
                                  </span>
                                </div>
                                <div className="p-3">
                                  <h5 className="font-bold text-xs text-gray-900 line-clamp-2 leading-snug">{card.title}</h5>
                                  <p className="text-[10px] text-gray-400 mt-1 truncate">{card.link || '/blog'}</p>
                                </div>
                              </div>
                              <div className="p-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEditModal('home-subcard', card)}
                                  className="text-gray-700 hover:text-[#168039] text-xs font-semibold px-2.5 py-1 rounded-lg border border-gray-300 hover:border-[#168039] flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem('home-subcard', card.id)}
                                  className="text-red-600 hover:text-red-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-red-200 hover:bg-red-50 flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. IMPACT STATS */}
                  {homeSubTab === 'stats' && (
                    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Impact Numbers &amp; Statistics</h3>
                          <p className="text-xs text-gray-500">Live impact counters shown on the home page.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openAddModal('stat')}
                          className="bg-[#168039] hover:bg-[#137233] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Stat Counter</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {cms.home.stats.map((stat: any) => (
                          <div key={stat.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50 text-center flex flex-col justify-between">
                            <div>
                              <div className="text-2xl font-extrabold text-[#168039]">{stat.value}</div>
                              <div className="text-xs font-bold text-gray-800 mt-1">{stat.label}</div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal('stat', stat)}
                                className="text-gray-700 hover:text-[#168039] text-xs font-semibold p-1.5 rounded-lg border border-gray-300 hover:border-[#168039] cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem('stat', stat.id)}
                                className="text-red-600 hover:text-red-700 text-xs font-semibold p-1.5 rounded-lg border border-red-200 hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. KEY PROJECTS */}
                  {homeSubTab === 'projects' && (
                    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Key Projects Highlight</h3>
                          <p className="text-xs text-gray-500">Projects cards showcased on the home page with direct images.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openAddModal('home-project')}
                          className="bg-[#168039] hover:bg-[#137233] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Project Card</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {cms.home.projects.map((proj: any) => (
                          <div key={proj.id} className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-xs flex flex-col justify-between">
                            <div>
                              <div className="relative h-36 w-full bg-gray-100">
                                {proj.image && (
                                  <Image src={proj.image} alt={proj.title} fill sizes="300px" className="object-cover" />
                                )}
                                <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-md text-[#168039]">
                                  {proj.badge}
                                </span>
                              </div>
                              <div className="p-4">
                                <h4 className="font-bold text-sm text-gray-900">{proj.title}</h4>
                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{proj.description}</p>
                              </div>
                            </div>
                            <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal('home-project', proj)}
                                className="text-gray-700 hover:text-[#168039] text-xs font-semibold px-2.5 py-1 rounded-lg border border-gray-300 hover:border-[#168039] flex items-center gap-1 cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem('home-project', proj.id)}
                                className="text-red-600 hover:text-red-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-red-200 hover:bg-red-50 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. CTA SECTION */}
                  {homeSubTab === 'cta' && (
                    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">&ldquo;Be a Part of the Change&rdquo; Section</h3>
                        <p className="text-xs text-gray-500">CTA section before stories, including floating quote and unboxed photograph.</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            CTA Heading
                          </label>
                          <input
                            type="text"
                            value={cms.home.cta.heading}
                            onChange={(e) => {
                              const updated = { ...cms };
                              updated.home.cta.heading = e.target.value;
                              setCms(updated);
                            }}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold outline-none focus:border-[#168039]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            CTA Subtitle
                          </label>
                          <textarea
                            rows={3}
                            value={cms.home.cta.subtitle}
                            onChange={(e) => {
                              const updated = { ...cms };
                              updated.home.cta.subtitle = e.target.value;
                              setCms(updated);
                            }}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#168039]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                              Button Text
                            </label>
                            <input
                              type="text"
                              value={cms.home.cta.btnText}
                              onChange={(e) => {
                                const updated = { ...cms };
                                updated.home.cta.btnText = e.target.value;
                                setCms(updated);
                              }}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#168039]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                              Floating Handwritten Quote
                            </label>
                            <input
                              type="text"
                              value={cms.home.cta.quoteText}
                              onChange={(e) => {
                                const updated = { ...cms };
                                updated.home.cta.quoteText = e.target.value;
                                setCms(updated);
                              }}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#168039]"
                            />
                          </div>
                        </div>

                        {/* CTA Image Upload */}
                        <ImageUploadField
                          label="Right-Side CTA Photograph"
                          hint="Direct unboxed photograph covering right side"
                          value={cms.home.cta.image}
                          onChange={(url) => {
                            const updated = { ...cms };
                            updated.home.cta.image = url;
                            setCms(updated);
                          }}
                          aspect="wide"
                        />
                      </div>
                    </div>
                  )}

                  {/* 6. STORIES FROM THE GROUND */}
                  {homeSubTab === 'stories' && (
                    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Stories from the Ground (Photo Cards)</h3>
                          <p className="text-xs text-gray-500">The 4 full HDR photo cards displayed at the bottom of the home page.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openAddModal('story')}
                          className="bg-[#168039] hover:bg-[#137233] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Photo Card</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {cms.home.stories.map((story: any) => (
                          <div key={story.id} className="rounded-2xl border border-gray-200 overflow-hidden bg-white flex flex-col justify-between shadow-xs">
                            <div>
                              <div className="relative aspect-[16/11] w-full bg-gray-100">
                                {story.image && (
                                  <Image src={story.image} alt={story.alt || 'Story'} fill sizes="300px" className="object-cover" />
                                )}
                              </div>
                              <div className="p-3">
                                <p className="text-xs text-gray-600 line-clamp-2">{story.alt || 'No description'}</p>
                              </div>
                            </div>
                            <div className="p-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEditModal('story', story)}
                                className="text-gray-700 hover:text-[#168039] text-xs font-semibold px-2 py-1 rounded-lg border border-gray-300 hover:border-[#168039] flex items-center gap-1 cursor-pointer"
                              >
                                <Edit className="w-3 h-3" /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem('story', story.id)}
                                className="text-red-600 hover:text-red-700 text-xs font-semibold px-2 py-1 rounded-lg border border-red-200 hover:bg-red-50 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: ABOUT US PAGE CMS                                                  */}
              {/* ========================================================================= */}
              {activeTab === 'about-cms' && (
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-7">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">About Us Page Management (/about)</h3>
                    <p className="text-xs text-gray-500">Edit hero banner, about narrative, 4 core values, and Section 80G legal registration certificate data.</p>
                  </div>

                  <div className="space-y-6">
                    {/* Hero */}
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                      <h4 className="font-bold text-sm text-gray-800">1. Hero Banner</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Hero Title</label>
                          <input
                            type="text"
                            value={cms.about.hero.title}
                            onChange={(e) => {
                              const updated = { ...cms };
                              updated.about.hero.title = e.target.value;
                              setCms(updated);
                            }}
                            className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Hero Subtitle</label>
                          <input
                            type="text"
                            value={cms.about.hero.subtitle}
                            onChange={(e) => {
                              const updated = { ...cms };
                              updated.about.hero.subtitle = e.target.value;
                              setCms(updated);
                            }}
                            className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                          />
                        </div>
                      </div>
                      <ImageUploadField
                        label="Hero Banner Background"
                        value={cms.about.hero.image}
                        onChange={(url) => {
                          const updated = { ...cms };
                          updated.about.hero.image = url;
                          setCms(updated);
                        }}
                        aspect="wide"
                      />
                    </div>

                    {/* Story Narrative */}
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                      <h4 className="font-bold text-sm text-gray-800">2. Foundation Story &amp; Mission Narrative</h4>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Section Heading</label>
                        <input
                          type="text"
                          value={cms.about.story.heading}
                          onChange={(e) => {
                            const updated = { ...cms };
                            updated.about.story.heading = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold outline-none focus:border-[#168039]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Paragraph 1</label>
                        <textarea
                          rows={3}
                          value={cms.about.story.paragraph1}
                          onChange={(e) => {
                            const updated = { ...cms };
                            updated.about.story.paragraph1 = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Paragraph 2</label>
                        <textarea
                          rows={3}
                          value={cms.about.story.paragraph2}
                          onChange={(e) => {
                            const updated = { ...cms };
                            updated.about.story.paragraph2 = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                        />
                      </div>
                    </div>

                    {/* 4 Core Values */}
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-gray-800">3. Core Values Cards</h4>
                        <button
                          type="button"
                          onClick={() => openAddModal('value')}
                          className="text-[#168039] hover:text-[#137233] text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Value
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {cms.about.values.map((v: any) => (
                          <div key={v.id} className="p-3.5 bg-white rounded-xl border border-gray-200 flex items-start justify-between">
                            <div>
                              <div className="font-bold text-xs text-gray-900">{v.name}</div>
                              <div className="text-[11px] text-gray-600 mt-0.5">{v.description}</div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 ml-2">
                              <button
                                type="button"
                                onClick={() => openEditModal('value', v)}
                                className="p-1 hover:text-[#168039] text-gray-500 cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem('value', v.id)}
                                className="p-1 hover:text-red-600 text-gray-500 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 80G Legal Info */}
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                      <h4 className="font-bold text-sm text-gray-800">4. Section 80G &amp; Legal Registration Document Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Document Identification No (DIN)</label>
                          <input
                            type="text"
                            value={cms.about.legal.din}
                            onChange={(e) => {
                              const updated = { ...cms };
                              updated.about.legal.din = e.target.value;
                              setCms(updated);
                            }}
                            className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-mono outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Trust PAN Number</label>
                          <input
                            type="text"
                            value={cms.about.legal.pan}
                            onChange={(e) => {
                              const updated = { ...cms };
                              updated.about.legal.pan = e.target.value;
                              setCms(updated);
                            }}
                            className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-mono outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Registration Approval Number</label>
                          <input
                            type="text"
                            value={cms.about.legal.regNo}
                            onChange={(e) => {
                              const updated = { ...cms };
                              updated.about.legal.regNo = e.target.value;
                              setCms(updated);
                            }}
                            className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-mono outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Approval Validity Period</label>
                          <input
                            type="text"
                            value={cms.about.legal.validity}
                            onChange={(e) => {
                              const updated = { ...cms };
                              updated.about.legal.validity = e.target.value;
                              setCms(updated);
                            }}
                            className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 4: PROJECTS PAGE CMS                                                  */}
              {/* ========================================================================= */}
              {activeTab === 'projects-cms' && (
                <ProjectsManagerTab />
              )}

              {/* ========================================================================= */}
              {/* TAB 5: GALLERY PAGE CMS                                                   */}
              {/* ========================================================================= */}
              {activeTab === 'gallery-cms' && (
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Gallery &amp; Moments of Impact (/gallery)</h3>
                      <p className="text-xs text-gray-500">Add, edit, or remove photos from the public gallery with direct device image upload.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openAddModal('gallery-item')}
                      className="bg-[#168039] hover:bg-[#137233] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload Gallery Photo</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {cms.gallery.map((item: any) => (
                      <div key={item.id} className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="relative aspect-square w-full bg-gray-100">
                            {item.image && <Image src={item.image} alt={item.title || 'Photo'} fill sizes="250px" className="object-cover" />}
                            <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {item.category}
                            </span>
                          </div>
                          <div className="p-2.5">
                            <div className="text-xs font-bold text-gray-900 truncate">{item.title}</div>
                          </div>
                        </div>

                        <div className="p-2 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal('gallery-item', item)}
                            className="text-gray-700 hover:text-[#168039] text-xs font-semibold p-1.5 rounded-lg border border-gray-300 hover:border-[#168039] cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem('gallery-item', item.id)}
                            className="text-red-600 hover:text-red-700 text-xs font-semibold p-1.5 rounded-lg border border-red-200 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 6: SERVICES & CAUSES CMS                                              */}
              {/* ========================================================================= */}
              {activeTab === 'services-cms' && (
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Services &amp; Key Cause Programs</h3>
                    <p className="text-xs text-gray-500">Edit content for Animal Welfare, Paryavaran Sanrakshan, and Social Welfare sub-pages.</p>
                  </div>

                  {/* Sub-tab selection */}
                  <div className="flex gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
                    {[
                      { id: 'animal', label: '1. Animal Welfare' },
                      { id: 'environment', label: '2. Paryavaran Sanrakshan' },
                      { id: 'women', label: '3. Women Empowerment' },
                      { id: 'education', label: '4. Education Support' },
                      { id: 'water', label: '5. Clean Water' },
                      { id: 'social', label: '6. Social Welfare' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setServicesSubTab(tab.id as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          servicesSubTab === tab.id
                            ? 'bg-[#168039] text-white shadow-xs'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Program Editor */}
                  {servicesSubTab === 'animal' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Page Title</label>
                        <input
                          type="text"
                          value={cms.services.animalWelfare.title}
                          onChange={(e) => {
                            const updated = { ...cms };
                            updated.services.animalWelfare.title = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={cms.services.animalWelfare.subtitle}
                          onChange={(e) => {
                            const updated = { ...cms };
                            updated.services.animalWelfare.subtitle = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Program Details</label>
                        <textarea
                          rows={3}
                          value={cms.services.animalWelfare.description}
                          onChange={(e) => {
                            const updated = { ...cms };
                            updated.services.animalWelfare.description = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                        />
                      </div>
                      <ImageUploadField
                        label="Animal Welfare Cover Image"
                        value={cms.services.animalWelfare.image}
                        onChange={(url) => {
                          const updated = { ...cms };
                          updated.services.animalWelfare.image = url;
                          setCms(updated);
                        }}
                        aspect="wide"
                      />
                    </div>
                  )}

                  {servicesSubTab === 'environment' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Page Title</label>
                        <input
                          type="text"
                          value={cms.services.environment.title}
                          onChange={(e) => {
                            const updated = { ...cms };
                            updated.services.environment.title = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={cms.services.environment.subtitle}
                          onChange={(e) => {
                            const updated = { ...cms };
                            updated.services.environment.subtitle = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Program Details</label>
                        <textarea
                          rows={3}
                          value={cms.services.environment.description}
                          onChange={(e) => {
                            const updated = { ...cms };
                            updated.services.environment.description = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                        />
                      </div>
                      <ImageUploadField
                        label="Environmental Program Cover Image"
                        value={cms.services.environment.image}
                        onChange={(url) => {
                          const updated = { ...cms };
                          updated.services.environment.image = url;
                          setCms(updated);
                        }}
                        aspect="wide"
                      />
                    </div>
                  )}

                  {servicesSubTab === 'social' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Page Title</label>
                        <input
                          type="text"
                          value={cms.services.socialWelfare.title}
                          onChange={(e) => {
                            const updated = { ...cms };
                            updated.services.socialWelfare.title = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={cms.services.socialWelfare.subtitle}
                          onChange={(e) => {
                            const updated = { ...cms };
                            updated.services.socialWelfare.subtitle = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Program Details</label>
                        <textarea
                          rows={3}
                          value={cms.services.socialWelfare.description}
                          onChange={(e) => {
                            const updated = { ...cms };
                            updated.services.socialWelfare.description = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                        />
                      </div>
                      <ImageUploadField
                        label="Social Welfare Cover Image"
                        value={cms.services?.socialWelfare?.image || '/pro/ab.png'}
                        onChange={(url) => {
                          const updated = { ...cms };
                          if (!updated.services.socialWelfare) updated.services.socialWelfare = {};
                          updated.services.socialWelfare.image = url;
                          setCms(updated);
                        }}
                        aspect="wide"
                      />
                    </div>
                  )}

                  {/* Women Empowerment Cause Editor */}
                  {servicesSubTab === 'women' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Page Title (/women-empowerment)</label>
                        <input
                          type="text"
                          value={cms.services?.womenEmpowerment?.title || 'Women Empowerment & Vocational Training'}
                          onChange={(e) => {
                            const updated = { ...cms };
                            if (!updated.services.womenEmpowerment) updated.services.womenEmpowerment = {};
                            updated.services.womenEmpowerment.title = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={cms.services?.womenEmpowerment?.subtitle || ''}
                          onChange={(e) => {
                            const updated = { ...cms };
                            if (!updated.services.womenEmpowerment) updated.services.womenEmpowerment = {};
                            updated.services.womenEmpowerment.subtitle = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Program Details</label>
                        <textarea
                          rows={3}
                          value={cms.services?.womenEmpowerment?.description || ''}
                          onChange={(e) => {
                            const updated = { ...cms };
                            if (!updated.services.womenEmpowerment) updated.services.womenEmpowerment = {};
                            updated.services.womenEmpowerment.description = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                        />
                      </div>
                      <ImageUploadField
                        label="Women Empowerment Cover Image"
                        value={cms.services?.womenEmpowerment?.image || '/pro/ser.png'}
                        onChange={(url) => {
                          const updated = { ...cms };
                          if (!updated.services.womenEmpowerment) updated.services.womenEmpowerment = {};
                          updated.services.womenEmpowerment.image = url;
                          setCms(updated);
                        }}
                        aspect="wide"
                      />
                    </div>
                  )}

                  {/* Education Support Cause Editor */}
                  {servicesSubTab === 'education' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Page Title (/education)</label>
                        <input
                          type="text"
                          value={cms.services?.education?.title || 'Education Support for Slum Children'}
                          onChange={(e) => {
                            const updated = { ...cms };
                            if (!updated.services.education) updated.services.education = {};
                            updated.services.education.title = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={cms.services?.education?.subtitle || ''}
                          onChange={(e) => {
                            const updated = { ...cms };
                            if (!updated.services.education) updated.services.education = {};
                            updated.services.education.subtitle = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Program Details</label>
                        <textarea
                          rows={3}
                          value={cms.services?.education?.description || ''}
                          onChange={(e) => {
                            const updated = { ...cms };
                            if (!updated.services.education) updated.services.education = {};
                            updated.services.education.description = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                        />
                      </div>
                      <ImageUploadField
                        label="Education Support Cover Image"
                        value={cms.services?.education?.image || '/ref/hero_boy_hd.jpg'}
                        onChange={(url) => {
                          const updated = { ...cms };
                          if (!updated.services.education) updated.services.education = {};
                          updated.services.education.image = url;
                          setCms(updated);
                        }}
                        aspect="wide"
                      />
                    </div>
                  )}

                  {/* Clean Water Cause Editor */}
                  {servicesSubTab === 'water' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Page Title (/clean-water)</label>
                        <input
                          type="text"
                          value={cms.services?.cleanWater?.title || 'Clean Water & Sanitation Campaign'}
                          onChange={(e) => {
                            const updated = { ...cms };
                            if (!updated.services.cleanWater) updated.services.cleanWater = {};
                            updated.services.cleanWater.title = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={cms.services?.cleanWater?.subtitle || ''}
                          onChange={(e) => {
                            const updated = { ...cms };
                            if (!updated.services.cleanWater) updated.services.cleanWater = {};
                            updated.services.cleanWater.subtitle = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Program Details</label>
                        <textarea
                          rows={3}
                          value={cms.services?.cleanWater?.description || ''}
                          onChange={(e) => {
                            const updated = { ...cms };
                            if (!updated.services.cleanWater) updated.services.cleanWater = {};
                            updated.services.cleanWater.description = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                        />
                      </div>
                      <ImageUploadField
                        label="Clean Water Cover Image"
                        value={cms.services?.cleanWater?.image || '/ref/project_water_hd.jpg'}
                        onChange={(url) => {
                          const updated = { ...cms };
                          if (!updated.services.cleanWater) updated.services.cleanWater = {};
                          updated.services.cleanWater.image = url;
                          setCms(updated);
                        }}
                        aspect="wide"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB: BLOG & INSIGHTS CMS (MULTI-IMAGE)                                    */}
              {/* ========================================================================= */}
              {activeTab === 'blogs-cms' && (
                <BlogsManagerTab />
              )}

              {/* ========================================================================= */}
              {/* TAB: BLOG ADS (4 SLOTS & MONETIZATION)                                     */}
              {/* ========================================================================= */}
              {activeTab === 'blog-ads' && (
                <BlogAdsTab cms={cms} setCms={setCms} onSaveAll={() => saveCmsData()} />
              )}

              {/* ========================================================================= */}
              {/* TAB: VOLUNTEER APPLICATIONS                                               */}
              {/* ========================================================================= */}
              {activeTab === 'volunteers-cms' && (
                <VolunteersTab />
              )}

              {/* ========================================================================= */}
              {/* TAB: LEGAL & POLICY PAGES                                                 */}
              {/* ========================================================================= */}
              {activeTab === 'legal-cms' && (
                <LegalPagesTab cms={cms} setCms={setCms} onSaveAll={() => saveCmsData()} />
              )}

              {/* ========================================================================= */}
              {/* TAB 7: CONTACT & VOLUNTEER CMS                                            */}
              {/* ========================================================================= */}
              {activeTab === 'contact-cms' && (
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Contact &amp; Volunteer Management (/contact)</h3>
                    <p className="text-xs text-gray-500">Edit organization contact details, office location, and volunteer call to action.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Office Address</label>
                      <input
                        type="text"
                        value={cms.contact.address}
                        onChange={(e) => {
                          const updated = { ...cms };
                          updated.contact.address = e.target.value;
                          setCms(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Contact Email Address</label>
                      <input
                        type="email"
                        value={cms.contact.email}
                        onChange={(e) => {
                          const updated = { ...cms };
                          updated.contact.email = e.target.value;
                          setCms(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Official Mobile / Phone Number</label>
                      <input
                        type="text"
                        value={cms.contact.phone}
                        onChange={(e) => {
                          const updated = { ...cms };
                          updated.contact.phone = e.target.value;
                          setCms(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Working Hours</label>
                      <input
                        type="text"
                        value={cms.contact.hours}
                        onChange={(e) => {
                          const updated = { ...cms };
                          updated.contact.hours = e.target.value;
                          setCms(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Volunteer Heading</label>
                      <input
                        type="text"
                        value={cms.contact.volunteerTitle}
                        onChange={(e) => {
                          const updated = { ...cms };
                          updated.contact.volunteerTitle = e.target.value;
                          setCms(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 8: DONATE PAGE & FLOW CMS                                             */}
              {/* ========================================================================= */}
              {activeTab === 'donate-cms' && (
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Donate Page &amp; Modal Flow (/donate)</h3>
                    <p className="text-xs text-gray-500">Edit donation landing page headings, side image, UPI QR code image, and donation FAQs.</p>
                  </div>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Donate Page Main Heading</label>
                        <input
                          type="text"
                          value={cms.donate.heading}
                          onChange={(e) => {
                            const updated = { ...cms };
                            updated.donate.heading = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">UPI ID</label>
                        <input
                          type="text"
                          value={cms.donate.upiId}
                          onChange={(e) => {
                            const updated = { ...cms };
                            updated.donate.upiId = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-mono outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Donate Page Subheading</label>
                        <input
                          type="text"
                          value={cms.donate.subheading}
                          onChange={(e) => {
                            const updated = { ...cms };
                            updated.donate.subheading = e.target.value;
                            setCms(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <ImageUploadField
                        label="Donate Page Side Image"
                        value={cms.donate.sideImage}
                        onChange={(url) => {
                          const updated = { ...cms };
                          updated.donate.sideImage = url;
                          setCms(updated);
                        }}
                        aspect="square"
                      />

                      <ImageUploadField
                        label="Official UPI QR Code Image"
                        hint="Displayed on /donate for instant scanning"
                        value={cms.donate.qrImage}
                        onChange={(url) => {
                          const updated = { ...cms };
                          updated.donate.qrImage = url;
                          setCms(updated);
                        }}
                        aspect="square"
                      />
                    </div>

                    {/* FAQs */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-sm text-gray-800">Donation FAQs</h4>
                        <button
                          type="button"
                          onClick={() => openAddModal('faq')}
                          className="text-[#168039] hover:text-[#137233] text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add FAQ
                        </button>
                      </div>

                      <div className="space-y-3">
                        {cms.donate.faqs.map((faq: any) => (
                          <div key={faq.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="font-bold text-xs text-gray-900">{faq.question}</div>
                              <div className="text-[11px] text-gray-600">{faq.answer}</div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 ml-3">
                              <button
                                type="button"
                                onClick={() => openEditModal('faq', faq)}
                                className="p-1 hover:text-[#168039] text-gray-500 cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem('faq', faq.id)}
                                className="p-1 hover:text-red-600 text-gray-500 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              
              {/* ========================================================================= */}
              {/* TAB 9: DONATION POPUP MODAL CMS (BARCODE, PRESETS, TEXTS, SUCCESS)        */}
              {/* ========================================================================= */}
              {activeTab === 'modal-cms' && (
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-8">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#168039]" />
                        <h3 className="text-lg font-bold text-gray-900">Donation Popup Modal Manager</h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Change Razorpay &amp; UPI Barcode QR codes, preset amount buttons, header texts, 80G tax notices, and celebratory thank-you screens.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => saveCmsData()}
                      className="bg-[#168039] hover:bg-[#137233] text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5"
                    >
                      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      Save Modal Configuration
                    </button>
                  </div>

                  {/* SECTION 1: RAZORPAY & UPI BARCODE / QR MANAGEMENT */}
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-2">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#168039]" /> 1. Razorpay &amp; UPI Barcode / QR Code
                      </h4>
                      <p className="text-[11px] text-gray-500">Upload your custom QR barcode directly from your phone/computer or media gallery.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <ImageUploadField
                        label="Official UPI Barcode / QR Code Image"
                        hint="Displayed inside the popup modal for instant scanning via GPay, PhonePe, Paytm, BHIM"
                        value={cms.donationModal?.qrImage || '/qr.png'}
                        onChange={(url) => {
                          const updated = { ...cms };
                          if (!updated.donationModal) updated.donationModal = {};
                          updated.donationModal.qrImage = url;
                          setCms(updated);
                        }}
                        aspect="square"
                      />

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Official UPI ID</label>
                          <input
                            type="text"
                            value={cms.donationModal?.upiId || 'itlc@upi'}
                            onChange={(e) => {
                              const updated = { ...cms };
                              if (!updated.donationModal) updated.donationModal = {};
                              updated.donationModal.upiId = e.target.value;
                              setCms(updated);
                            }}
                            placeholder="itlc@upi"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono font-semibold outline-none focus:border-[#168039]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Barcode Card Heading</label>
                          <input
                            type="text"
                            value={cms.donationModal?.qrTitle || 'Official UPI Barcode Payment'}
                            onChange={(e) => {
                              const updated = { ...cms };
                              if (!updated.donationModal) updated.donationModal = {};
                              updated.donationModal.qrTitle = e.target.value;
                              setCms(updated);
                            }}
                            placeholder="Official UPI Barcode Payment"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Barcode Card Subtitle / Help Text</label>
                          <textarea
                            rows={2}
                            value={cms.donationModal?.qrDescription || 'Scan using Google Pay, PhonePe, Paytm, or BHIM. Or click below to proceed with Gateway / Cards / UPI.'}
                            onChange={(e) => {
                              const updated = { ...cms };
                              if (!updated.donationModal) updated.donationModal = {};
                              updated.donationModal.qrDescription = e.target.value;
                              setCms(updated);
                            }}
                            className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: MODAL HEADER & BRANDING */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="border-b border-gray-100 pb-2">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#168039]" /> 2. Modal Header &amp; Organization Branding
                      </h4>
                      <p className="text-[11px] text-gray-500">Customize the top banner, logo icon, and purpose text of the donation popup.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <ImageUploadField
                          label="Header Brand Logo"
                          value={cms.donationModal?.logoImage || '/ref/logo.png'}
                          onChange={(url) => {
                            const updated = { ...cms };
                            if (!updated.donationModal) updated.donationModal = {};
                            updated.donationModal.logoImage = url;
                            setCms(updated);
                          }}
                          aspect="square"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Modal Main Title</label>
                          <input
                            type="text"
                            value={cms.donationModal?.title || 'Make a Difference Today'}
                            onChange={(e) => {
                              const updated = { ...cms };
                              if (!updated.donationModal) updated.donationModal = {};
                              updated.donationModal.title = e.target.value;
                              setCms(updated);
                            }}
                            placeholder="Make a Difference Today"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold outline-none focus:border-[#168039]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Modal Subtitle</label>
                          <textarea
                            rows={2}
                            value={cms.donationModal?.subtitle || 'Empowering children, protecting nature & strengthening communities in UP.'}
                            onChange={(e) => {
                              const updated = { ...cms };
                              if (!updated.donationModal) updated.donationModal = {};
                              updated.donationModal.subtitle = e.target.value;
                              setCms(updated);
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: PRESET AMOUNTS (ADD, EDIT, DELETE) */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="border-b border-gray-100 pb-2">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#168039]" /> 3. Preset Donation Amounts (Add, Delete &amp; Configure)
                      </h4>
                      <p className="text-[11px] text-gray-500">Manage the quick amount buttons available to donors in the popup (plus Custom amount option).</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        {(cms.donationModal?.presetAmounts || [500, 1000, 2000]).map((amt: number) => (
                          <div
                            key={amt}
                            className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-[#083a27] px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs"
                          >
                            <span>₹{amt.toLocaleString('en-IN')}</span>
                            {cms.donationModal?.defaultAmount === amt && (
                              <span className="text-[9px] bg-[#168039] text-white px-1.5 py-0.5 rounded-full">Default</span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = { ...cms };
                                if (!updated.donationModal) updated.donationModal = {};
                                const list = (updated.donationModal.presetAmounts || [500, 1000, 2000]).filter((a: number) => a !== amt);
                                updated.donationModal.presetAmounts = list;
                                if (updated.donationModal.defaultAmount === amt) {
                                  updated.donationModal.defaultAmount = list[0] || 500;
                                }
                                setCms(updated);
                                toast({ title: 'Amount Removed', description: `Preset ₹${amt} removed.` });
                              }}
                              className="hover:bg-emerald-200/80 text-emerald-900 rounded-full p-0.5 transition-colors cursor-pointer"
                              title="Delete preset amount"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add New Amount Form */}
                      <div className="flex items-center gap-2.5 pt-2 max-w-sm">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">₹</span>
                          <input
                            type="number"
                            placeholder="Add amount (e.g. 5000)"
                            value={newPresetAmount}
                            onChange={(e) => setNewPresetAmount(e.target.value)}
                            className="w-full pl-7 pr-3 py-2 rounded-xl border border-gray-300 text-xs font-bold outline-none focus:border-[#168039]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const val = Number(newPresetAmount);
                            if (!val || val < 10) {
                              toast({ title: 'Invalid Amount', description: 'Enter an amount of at least ₹10', variant: 'destructive' });
                              return;
                            }
                            const updated = { ...cms };
                            if (!updated.donationModal) updated.donationModal = {};
                            const list = [...(updated.donationModal.presetAmounts || [500, 1000, 2000])];
                            if (!list.includes(val)) {
                              list.push(val);
                              list.sort((a: number, b: number) => a - b);
                            }
                            updated.donationModal.presetAmounts = list;
                            setCms(updated);
                            setNewPresetAmount('');
                            toast({ title: 'Preset Added', description: `Preset ₹${val} added to donation modal.` });
                          }}
                          className="bg-[#168039] hover:bg-[#137233] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Preset
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: BUTTON & TAX EXEMPTION SETTINGS */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="border-b border-gray-100 pb-2">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#168039]" /> 4. Action Button &amp; 80G Tax Exemption Notes
                      </h4>
                      <p className="text-[11px] text-gray-500">Configure button texts and legal exemption assurances.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Proceed Button Label</label>
                        <input
                          type="text"
                          value={cms.donationModal?.buttonText || 'Proceed to Pay'}
                          onChange={(e) => {
                            const updated = { ...cms };
                            if (!updated.donationModal) updated.donationModal = {};
                            updated.donationModal.buttonText = e.target.value;
                            setCms(updated);
                          }}
                          placeholder="Proceed to Pay"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold outline-none focus:border-[#168039]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Tax Exemption Note (80G)</label>
                        <input
                          type="text"
                          value={cms.donationModal?.taxExemptionNote || '50% Tax Exemption under Section 80G. Slip will download automatically.'}
                          onChange={(e) => {
                            const updated = { ...cms };
                            if (!updated.donationModal) updated.donationModal = {};
                            updated.donationModal.taxExemptionNote = e.target.value;
                            setCms(updated);
                          }}
                          placeholder="50% Tax Exemption under Section 80G..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Under-Button Auto-Download Notice</label>
                        <input
                          type="text"
                          value={cms.donationModal?.buttonSubtext || '⚡ Payment hote hi data automatically sync ho jayega aur 80G Receipt Slip automatically download ho jayegi.'}
                          onChange={(e) => {
                            const updated = { ...cms };
                            if (!updated.donationModal) updated.donationModal = {};
                            updated.donationModal.buttonSubtext = e.target.value;
                            setCms(updated);
                          }}
                          placeholder="Notice below proceed button"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: CELEBRATORY THANK YOU & AUTO-DOWNLOAD CONFIRMATION */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="border-b border-gray-100 pb-2">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-[#168039]" /> 5. Celebratory Thank You &amp; Auto-Download Screen
                      </h4>
                      <p className="text-[11px] text-gray-500">Configure what the donor sees after payment completion and automatic receipt slip generation.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <ImageUploadField
                          label="Success Hero Photo"
                          hint="Photo shown on the thank-you confirmation card"
                          value={cms.donationModal?.successImage || '/ref/hero_boy_hd.jpg'}
                          onChange={(url) => {
                            const updated = { ...cms };
                            if (!updated.donationModal) updated.donationModal = {};
                            updated.donationModal.successImage = url;
                            setCms(updated);
                          }}
                          aspect="video"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Success Heading</label>
                          <input
                            type="text"
                            value={cms.donationModal?.successTitle || 'Thanks for your support!'}
                            onChange={(e) => {
                              const updated = { ...cms };
                              if (!updated.donationModal) updated.donationModal = {};
                              updated.donationModal.successTitle = e.target.value;
                              setCms(updated);
                            }}
                            placeholder="Thanks for your support!"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold outline-none focus:border-[#168039]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Success Subtitle</label>
                          <input
                            type="text"
                            value={cms.donationModal?.successSubtitle || 'Aapka chhota sa sahyog kisi ki zindagi badal sakta hai 🌿'}
                            onChange={(e) => {
                              const updated = { ...cms };
                              if (!updated.donationModal) updated.donationModal = {};
                              updated.donationModal.successSubtitle = e.target.value;
                              setCms(updated);
                            }}
                            placeholder="Tagline..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Thank You Message Template <span className="text-gray-400 font-normal">(use &#123;donorName&#125; and &#123;amount&#125;)</span>
                          </label>
                          <textarea
                            rows={3}
                            value={cms.donationModal?.successMessage || 'Dear {donorName}, your donation of ₹{amount} will directly help educate children, plant trees, and rescue animals across Lucknow and Uttar Pradesh.'}
                            onChange={(e) => {
                              const updated = { ...cms };
                              if (!updated.donationModal) updated.donationModal = {};
                              updated.donationModal.successMessage = e.target.value;
                              setCms(updated);
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 6: BOTTOM SAVE BUTTON */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => saveCmsData()}
                      className="bg-[#168039] hover:bg-[#137233] text-white px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold cursor-pointer transition-colors shadow-md flex items-center gap-2"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Save All Modal Changes
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 9: FOOTER MANAGEMENT CMS                                              */}
              {/* ========================================================================= */}
              {activeTab === 'footer-cms' && (
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Footer Content &amp; Social Links</h3>
                    <p className="text-xs text-gray-500">Manage footer taglines, social media links, contact info, and copyright text.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Main Footer Tagline</label>
                      <input
                        type="text"
                        value={cms.footer.tagline}
                        onChange={(e) => {
                          const updated = { ...cms };
                          updated.footer.tagline = e.target.value;
                          setCms(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Sub-Tagline</label>
                      <input
                        type="text"
                        value={cms.footer.subTagline}
                        onChange={(e) => {
                          const updated = { ...cms };
                          updated.footer.subTagline = e.target.value;
                          setCms(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Facebook URL</label>
                      <input
                        type="text"
                        value={cms.footer.social.facebook}
                        onChange={(e) => {
                          const updated = { ...cms };
                          updated.footer.social.facebook = e.target.value;
                          setCms(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Instagram URL</label>
                      <input
                        type="text"
                        value={cms.footer.social.instagram}
                        onChange={(e) => {
                          const updated = { ...cms };
                          updated.footer.social.instagram = e.target.value;
                          setCms(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">YouTube URL</label>
                      <input
                        type="text"
                        value={cms.footer.social.youtube}
                        onChange={(e) => {
                          const updated = { ...cms };
                          updated.footer.social.youtube = e.target.value;
                          setCms(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={cms.footer.social.linkedin}
                        onChange={(e) => {
                          const updated = { ...cms };
                          updated.footer.social.linkedin = e.target.value;
                          setCms(updated);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 10: DONATIONS & 80G RECEIPTS LOGS                                     */}
              {/* ========================================================================= */}
              {activeTab === 'donations-logs' && (() => {
                const filteredDonations = donationsData.donations.filter((d: any) => {
                  const matchesType = donationsTypeFilter === 'all' 
                    ? true 
                    : donationsTypeFilter === 'monthly'
                      ? (d.type || '').toLowerCase().includes('month')
                      : (d.type || '').toLowerCase().includes('one');
                  
                  const q = donationsSearch.toLowerCase().trim();
                  const matchesSearch = !q || 
                    (d.donorName || '').toLowerCase().includes(q) ||
                    (d.donorEmail || '').toLowerCase().includes(q) ||
                    (d.donorPhone || '').toLowerCase().includes(q) ||
                    (d.receiptNo || '').toLowerCase().includes(q) ||
                    (d.paymentId || '').toLowerCase().includes(q);

                  return matchesType && matchesSearch;
                });

                const filteredSum = filteredDonations.reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);

                return (
                  <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
                    {/* Header with Title and Refresh */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900">Donation Records &amp; 80G Tax Invoices</h3>
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live Sync Active
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Persistent database of all contributions made through the website modal. Download Section 80G tax certificates in PDF or print invoices on demand.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            fetchDonations(false);
                            toast({ title: 'Refreshed', description: 'All donation records up to date.' });
                          }}
                          className="text-xs font-bold text-[#168039] border border-emerald-200 bg-emerald-50 px-3.5 py-2 rounded-xl flex items-center gap-1.5 hover:bg-emerald-100 cursor-pointer transition-colors shadow-2xs"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDonations ? 'animate-spin' : ''}`} /> Refresh Records
                        </button>
                      </div>
                    </div>

                    {/* Quick Summary Pill Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                      <div>
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Donors</div>
                        <div className="text-xl font-black text-gray-900 mt-0.5">{donationsData.totalDonations}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Raised</div>
                        <div className="text-xl font-black text-[#168039] mt-0.5">
                          ₹ {donationsData.totalRaised.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">One-Time Donors</div>
                        <div className="text-xl font-black text-gray-900 mt-0.5">{donationsData.oneTimeCount}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Monthly Supporters</div>
                        <div className="text-xl font-black text-blue-700 mt-0.5">{donationsData.monthlyCount}</div>
                      </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                      {/* Search Bar */}
                      <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={donationsSearch}
                          onChange={(e) => setDonationsSearch(e.target.value)}
                          placeholder="Search by donor name, email, phone, or receipt number..."
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium outline-none focus:border-[#168039] focus:ring-1 focus:ring-[#168039] transition-all"
                        />
                        {donationsSearch && (
                          <button
                            type="button"
                            onClick={() => setDonationsSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Type Filter Pills */}
                      <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setDonationsTypeFilter('all')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            donationsTypeFilter === 'all'
                              ? 'bg-white text-gray-900 shadow-2xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          All ({donationsData.totalDonations})
                        </button>
                        <button
                          type="button"
                          onClick={() => setDonationsTypeFilter('one-time')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            donationsTypeFilter === 'one-time'
                              ? 'bg-white text-[#168039] shadow-2xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          One-time ({donationsData.oneTimeCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setDonationsTypeFilter('monthly')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            donationsTypeFilter === 'monthly'
                              ? 'bg-white text-blue-700 shadow-2xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Monthly ({donationsData.monthlyCount})
                        </button>
                      </div>
                    </div>

                    {/* Full Table */}
                    <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                          <tr>
                            <th className="p-3.5">Receipt No</th>
                            <th className="p-3.5">Donor Name</th>
                            <th className="p-3.5">Contact Details</th>
                            <th className="p-3.5">Type</th>
                            <th className="p-3.5 text-right">Amount</th>
                            <th className="p-3.5 text-center">Status</th>
                            <th className="p-3.5 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredDonations.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-8 text-center text-gray-400">
                                No donation records matched your search filter.
                              </td>
                            </tr>
                          ) : (
                            filteredDonations.map((don: any) => (
                              <tr key={don.id || don.receiptNo} className="hover:bg-emerald-50/40 transition-colors">
                                <td className="p-3.5">
                                  <div className="flex items-center gap-1 font-mono font-bold text-[#083a27]">
                                    <span>{don.receiptNo}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(don.receiptNo);
                                        toast({ title: 'Copied', description: `Receipt No ${don.receiptNo} copied to clipboard.` });
                                      }}
                                      className="text-gray-400 hover:text-gray-700 p-0.5"
                                      title="Copy Receipt No"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <div className="text-[10px] text-gray-400 mt-0.5">Ref: {don.paymentId || 'pay_online'}</div>
                                </td>
                                <td className="p-3.5">
                                  <div className="font-bold text-gray-900 text-xs">{don.donorName}</div>
                                  <div className="text-[11px] text-gray-500 mt-0.5">{don.date || 'September 2026'}</div>
                                </td>
                                <td className="p-3.5">
                                  <div className="text-gray-700 font-medium">
                                    <a href={`mailto:${don.donorEmail}`} className="hover:underline text-gray-800">
                                      {don.donorEmail}
                                    </a>
                                  </div>
                                  <div className="text-gray-500 text-[11px] mt-0.5">
                                    <a href={`tel:+91${don.donorPhone}`} className="hover:underline">
                                      +91 {don.donorPhone}
                                    </a>
                                  </div>
                                </td>
                                <td className="p-3.5">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    (don.type || '').toLowerCase().includes('month')
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-emerald-100 text-[#168039]'
                                  }`}>
                                    {(don.type || '').toLowerCase().includes('month') ? 'Monthly' : 'One-time'}
                                  </span>
                                </td>
                                <td className="p-3.5 text-right font-black text-gray-900 text-sm">
                                  ₹ {Number(don.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="p-3.5 text-center">
                                  <span className="bg-emerald-100 text-[#168039] px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Verified (80G)
                                  </span>
                                </td>
                                <td className="p-3.5 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    {/* Download PDF button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        downloadReceiptPdf({
                                          receiptNo: don.receiptNo,
                                          donorName: don.donorName,
                                          donorEmail: don.donorEmail,
                                          donorPhone: don.donorPhone,
                                          amount: Number(don.amount),
                                          type: don.type || 'One-time',
                                          date: don.date || 'September 2026',
                                          paymentId: don.paymentId || 'pay_verified',
                                        });
                                        toast({ title: 'Downloading 80G Receipt', description: `Official PDF for ${don.donorName} generated.` });
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#168039] border border-emerald-200 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                                      title="Download Official 80G Tax Exemption PDF"
                                    >
                                      <Download className="w-3.5 h-3.5" /> PDF
                                    </button>

                                    {/* Print Invoice button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        printReceiptInvoice({
                                          receiptNo: don.receiptNo,
                                          donorName: don.donorName,
                                          donorEmail: don.donorEmail,
                                          donorPhone: don.donorPhone,
                                          amount: Number(don.amount),
                                          type: don.type || 'One-time',
                                          date: don.date || 'September 2026',
                                          paymentId: don.paymentId || 'pay_verified',
                                        });
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                                      title="Print Official 80G Invoice"
                                    >
                                      <Printer className="w-3.5 h-3.5" /> Print
                                    </button>

                                    {/* Delete record button */}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteDonation(don.id, don.donorName)}
                                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                      title="Delete Donation Record"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Filter Summary Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span>Showing {filteredDonations.length} of {donationsData.totalDonations} total records</span>
                      <span className="font-bold text-gray-900">Total Filtered Amount: ₹ {filteredSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                );
              })()}

              {/* ========================================================================= */}
              {/* TAB 11: FULL MEDIA LIBRARY & BULK UPLOAD                                  */}
              {/* ========================================================================= */}
              {activeTab === 'media-library' && (
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Media Library &amp; Direct Photo Uploader</h3>
                      <p className="text-xs text-gray-500">Upload new photographs directly from your phone/computer to use anywhere across the site.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsMediaModalOpen(true)}
                      className="bg-[#168039] hover:bg-[#137233] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload / Browse Files</span>
                    </button>
                  </div>

                  {isMediaLoading ? (
                    <div className="py-20 flex justify-center text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin text-[#168039]" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {mediaItems.map((item) => (
                        <div key={item.url} className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-2xs group relative aspect-square">
                          <Image src={item.url} alt={item.name} fill sizes="200px" className="object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-2 text-[10px] text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <MediaGalleryModal
                    isOpen={isMediaModalOpen}
                    onClose={() => {
                      setIsMediaModalOpen(false);
                      fetchMediaLibrary();
                    }}
                    onSelect={(url) => {
                      toast({ title: 'Image Selected', description: `Path: ${url}` });
                    }}
                  />
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 12: ACCOUNT & SECURITY SETTINGS                                       */}
              {/* ========================================================================= */}
              {activeTab === 'settings' && (
                <div className="space-y-8 max-w-4xl">
                  {/* Top Intro */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-[#168039]" /> System &amp; Environment Configuration
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Manage Hostinger Domain SMTP credentials, Razorpay Payment Gateway API keys, and Admin Account security. All credentials persist safely in .env.local and runtime.
                    </p>
                  </div>

                  {/* 1. HOSTINGER DOMAIN SMTP CONFIGURATION */}
                  <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-5 h-5 text-[#168039]" />
                          <h4 className="text-base font-bold text-gray-900">Hostinger Domain SMTP Mail Server</h4>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Sends automated Section 80G tax invoices and thank-you receipts directly to donor email addresses upon successful payment.
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#168039]" />
                        Active (Port 465 SSL)
                      </span>
                    </div>

                    <form onSubmit={handleSaveSettings} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            SMTP Host <span className="text-gray-400 font-normal">(Hostinger server)</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={settings.smtpHost}
                            onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                            placeholder="smtp.hostinger.com"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium outline-none focus:border-[#168039] focus:ring-1 focus:ring-[#168039]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            SMTP Port <span className="text-gray-400 font-normal">(465 SSL or 587 TLS)</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={settings.smtpPort}
                            onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                            placeholder="465"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium outline-none focus:border-[#168039] focus:ring-1 focus:ring-[#168039]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            SMTP Username / Email <span className="text-gray-400 font-normal">(Authenticated address)</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={settings.smtpUser}
                            onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                            placeholder="donation@itlcfoundation.com"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium outline-none focus:border-[#168039] focus:ring-1 focus:ring-[#168039]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            SMTP Password
                          </label>
                          <div className="relative">
                            <input
                              type={showSmtpPass ? 'text' : 'password'}
                              required
                              value={settings.smtpPass}
                              onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                              placeholder="••••••••"
                              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-gray-300 text-xs font-medium outline-none focus:border-[#168039] focus:ring-1 focus:ring-[#168039]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowSmtpPass(!showSmtpPass)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                              {showSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            From Sender Display Header
                          </label>
                          <input
                            type="text"
                            required
                            value={settings.smtpFrom}
                            onChange={(e) => setSettings({ ...settings, smtpFrom: e.target.value })}
                            placeholder='"ITLC Foundation" <donation@itlcfoundation.com>'
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium outline-none focus:border-[#168039] focus:ring-1 focus:ring-[#168039]"
                          />
                          <p className="text-[11px] text-gray-400 mt-1">Must contain the same domain or email account as SMTP Username for Hostinger security policies.</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={isSavingSettings}
                          className="bg-[#168039] hover:bg-[#137233] text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5"
                        >
                          {isSavingSettings ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          Save SMTP Configuration
                        </button>
                      </div>
                    </form>

                    {/* Send Live Test Email Sub-section */}
                    <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 mt-4">
                      <h5 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-[#168039]" /> Test Outgoing SMTP Mail Delivery
                      </h5>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        Send a live test verification email through Hostinger SMTP to confirm delivery to your inbox.
                      </p>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mt-3">
                        <input
                          type="email"
                          value={testEmailRecipient}
                          onChange={(e) => setTestEmailRecipient(e.target.value)}
                          placeholder="recipient@example.com"
                          className="flex-1 px-3.5 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-medium outline-none focus:border-[#168039]"
                        />
                        <button
                          type="button"
                          onClick={handleSendTestMail}
                          disabled={isSendingTestMail}
                          className="bg-[#083a27] hover:bg-[#06291b] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
                        >
                          {isSendingTestMail ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-300" />
                              Sending via Hostinger...
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              Send Live Test Email
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 2. RAZORPAY PAYMENT GATEWAY CONFIGURATION */}
                  <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-[#168039]" />
                          <h4 className="text-base font-bold text-gray-900">Razorpay Payment Gateway API Keys</h4>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Connects the donation checkout modal to process live UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and Monthly recurring mandates.
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full ${
                        (settings.razorpayKeyId || '').startsWith('rzp_live')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : (settings.razorpayKeyId || '').startsWith('rzp_test')
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {(settings.razorpayKeyId || '').startsWith('rzp_live')
                          ? '● Production (Live Mode)'
                          : (settings.razorpayKeyId || '').startsWith('rzp_test')
                            ? '▲ Sandbox (Test Mode)'
                            : '○ Not Configured'}
                      </span>
                    </div>

                    <form onSubmit={handleSaveSettings} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Razorpay Key ID <span className="text-gray-400 font-normal">(Public Key)</span>
                          </label>
                          <input
                            type="text"
                            value={settings.razorpayKeyId}
                            onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                            placeholder="rzp_test_... or rzp_live_..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono font-semibold outline-none focus:border-[#168039] focus:ring-1 focus:ring-[#168039]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Razorpay Key Secret <span className="text-gray-400 font-normal">(Private Key)</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showRzpSecret ? 'text' : 'password'}
                              value={settings.razorpayKeySecret}
                              onChange={(e) => setSettings({ ...settings, razorpayKeySecret: e.target.value })}
                              placeholder="••••••••••••••••"
                              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-gray-300 text-xs font-mono font-semibold outline-none focus:border-[#168039] focus:ring-1 focus:ring-[#168039]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowRzpSecret(!showRzpSecret)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                              {showRzpSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-[11px] text-gray-600 leading-relaxed">
                        <strong>Important Security Note:</strong> Your credentials are encrypted and stored in <code className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded font-mono text-[10px]">.env.local</code> on your server. They are never pushed to public git repositories.
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingSettings}
                        className="bg-[#168039] hover:bg-[#137233] text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5"
                      >
                        {isSavingSettings ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Save Razorpay Credentials
                      </button>
                    </form>
                  </div>

                  {/* 3. ADMINISTRATOR SECURITY, EMAIL & PASSWORD */}
                  <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
                    <div className="border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-2">
                        <Key className="w-5 h-5 text-[#168039]" />
                        <h4 className="text-base font-bold text-gray-900">Administrator Credentials &amp; Email Settings</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Manage your master administrator login email ID (<strong className="text-emerald-700">{adminProfile.email}</strong>) and update your dashboard access password.
                      </p>
                    </div>

                    {/* Sub-form 1: Update Admin Email */}
                    <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200/80">
                      <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#168039]" /> Update Admin Login Email ID
                      </h5>
                      <p className="text-[11px] text-gray-500 mb-3">
                        This email is used for all admin dashboard logins, OTP verification codes, and security alerts.
                      </p>
                      <form onSubmit={handleUpdateAdminEmail} className="flex flex-col sm:flex-row gap-2.5 max-w-xl">
                        <input
                          type="email"
                          required
                          value={newAdminEmailInput}
                          onChange={(e) => setNewAdminEmailInput(e.target.value)}
                          placeholder="info@itlcfoundation.com"
                          className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold outline-none focus:border-[#168039] bg-white"
                        />
                        <button
                          type="submit"
                          disabled={isUpdatingProfileEmail}
                          className="bg-[#168039] hover:bg-[#137233] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs shrink-0 flex items-center justify-center gap-1.5"
                        >
                          {isUpdatingProfileEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          <span>Update Email Address</span>
                        </button>
                      </form>
                    </div>

                    {/* Sub-form 2: Change Password */}
                    <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200/80">
                      <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-[#0f5b9e]" /> Change Administrator Password
                      </h5>
                      <p className="text-[11px] text-gray-500 mb-3">
                        Update your password. Changes persist in the backend database immediately.
                      </p>
                      <form onSubmit={handleUpdateAdminPassword} className="space-y-3.5 max-w-md">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Current Password</label>
                          <input
                            type="password"
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039] bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">New Password (Min 6 chars)</label>
                          <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new strong password"
                            className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039] bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039] bg-white"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isUpdatingProfilePass}
                          className="bg-[#0f5b9e] hover:bg-[#0d4f8b] text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5"
                        >
                          {isUpdatingProfilePass ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          <span>Update Master Password</span>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}


              {/* ========================================================================= */}
              {/* TAB: WEBSITE INFO, LOGO & FAVICON                                         */}
              {/* ========================================================================= */}
              {activeTab === 'site-info' && (
                <WebsiteInfoTab cms={cms} setCms={setCms} onSaveAll={() => saveCmsData()} />
              )}

              {/* ========================================================================= */}
              {/* TAB: CONTACT INQUIRIES INBOX                                              */}
              {/* ========================================================================= */}
              {activeTab === 'contact-inquiries' && (
                <ContactInquiriesTab />
              )}

              {/* ========================================================================= */}
              {/* TAB: TEAM MEMBERS MANAGEMENT                                              */}
              {/* ========================================================================= */}
              {activeTab === 'team-cms' && (
                <TeamMembersTab />
              )}

              {/* ========================================================================= */}
              {/* TAB: ADMIN ACCOUNTS & RBAC SECURITY                                       */}
              {/* ========================================================================= */}
              {activeTab === 'admin-accounts' && (
                <AdminAccountsTab />
              )}

              {/* ========================================================================= */}
              {/* TAB: ACTIVITY AUDIT LOGS                                                  */}
              {/* ========================================================================= */}
              {activeTab === 'activity-logs' && (
                <ActivityLogsTab />
              )}
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* UNIVERSAL CREATE / EDIT MODAL                                             */}
      {/* ========================================================================= */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 my-auto">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-900 text-base">
                {modalState.item ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Title / Name */}
              {(modalState.type === 'feature' || modalState.type === 'home-project' || modalState.type === 'home-subcard' || modalState.type === 'value' || modalState.type === 'full-project' || modalState.type === 'gallery-item' || modalState.type === 'stat') && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Title / Label</label>
                  <input
                    type="text"
                    required
                    value={modalTitle}
                    onChange={(e) => setModalTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold outline-none"
                  />
                </div>
              )}

                            {/* Target Link for subcard or project */}
              {(modalState.type === 'home-subcard' || modalState.type === 'home-project') && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Link URL</label>
                  <input
                    type="text"
                    placeholder="e.g. /blog/post-slug or /projects"
                    value={modalLink}
                    onChange={(e) => setModalLink(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                  />
                </div>
              )}

              {/* Stat Value */}
              {modalState.type === 'stat' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Stat Value (e.g. 10,000+)</label>
                  <input
                    type="text"
                    required
                    value={modalValue}
                    onChange={(e) => setModalValue(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold outline-none"
                  />
                </div>
              )}

              {/* Category */}
              {(modalState.type === 'full-project' || modalState.type === 'gallery-item' || modalState.type === 'home-subcard') && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Women Empowerment, Clean Water & Sanitation, Education Support, Social Welfare, Plantation, Animal Care, Events"
                    value={modalCategory}
                    onChange={(e) => setModalCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                  />
                  {modalState.type === 'gallery-item' && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[
                        'Women Empowerment',
                        'Clean Water & Sanitation',
                        'Education Support',
                        'Social Welfare',
                        'Plantation',
                        'Animal Care',
                        'Events',
                      ].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setModalCategory(cat)}
                          className={`text-[10px] px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                            modalCategory === cat
                              ? 'bg-[#168039] text-white border-[#168039] font-bold'
                              : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Description / Alt Text */}
              {(modalState.type === 'feature' || modalState.type === 'home-project' || modalState.type === 'story' || modalState.type === 'value' || modalState.type === 'full-project') && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {modalState.type === 'story' ? 'Photo Description / Caption' : 'Description'}
                  </label>
                  <textarea
                    rows={3}
                    value={modalDesc}
                    onChange={(e) => setModalDesc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                  />
                </div>
              )}

              {/* FAQ Fields */}
              {modalState.type === 'faq' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Question</label>
                    <input
                      type="text"
                      required
                      value={modalQuestion}
                      onChange={(e) => setModalQuestion(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Answer</label>
                    <textarea
                      rows={3}
                      required
                      value={modalAnswer}
                      onChange={(e) => setModalAnswer(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                    />
                  </div>
                </>
              )}

              {/* Project Goals */}
              {modalState.type === 'full-project' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Goal Amount (₹)</label>
                    <input
                      type="number"
                      value={modalGoal}
                      onChange={(e) => setModalGoal(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Raised Amount (₹)</label>
                    <input
                      type="number"
                      value={modalRaised}
                      onChange={(e) => setModalRaised(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Image Upload Field for Modals */}
              {(modalState.type === 'home-project' || modalState.type === 'home-subcard' || modalState.type === 'story' || modalState.type === 'full-project' || modalState.type === 'gallery-item') && (
                <ImageUploadField
                  label="Item Image (Upload from Device or Choose from Gallery)"
                  value={modalImage}
                  onChange={(url) => setModalImage(url)}
                  aspect={modalState.type === 'story' ? 'video' : 'video'}
                />
              )}

            </div>

            <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSave}
                className="bg-[#168039] hover:bg-[#137233] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
