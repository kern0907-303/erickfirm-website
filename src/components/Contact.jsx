import React from 'react';
import { getPreferredLocale, onLocaleChange } from '../lib/i18n';

const copy = {
  'zh-TW': {
    title: '預約專屬診斷',
    desc: '留下您的資訊，我們將安排專人與您聯繫，啟動關係結構修復。',
    name: '姓名 / Name',
    contact: '聯繫方式 / Email or Phone',
    status: '目前面臨的卡點 / Current Status',
    namePlaceholder: '請輸入姓名',
    contactPlaceholder: 'Email 或 手機號碼',
    statusPlaceholder: '請簡述您企業或個人目前遇到的瓶頸...',
    submit: '送出預約申請',
    submitting: '提交中...',
    success: '已收到您的預約！我們將盡快安排專人聯繫。',
    error: '提交失敗，請稍後再試。',
    validationError: '請填寫所有欄位。',
  },
  en: {
    title: 'Book a Private Assessment',
    desc: 'Share your context and our team will reach out with a focused next-step recommendation.',
    name: 'Name',
    contact: 'Email or Phone',
    status: 'Current Challenge',
    namePlaceholder: 'Your name',
    contactPlaceholder: 'Email or phone number',
    statusPlaceholder: 'Briefly describe your current business or personal challenge...',
    submit: 'Submit Request',
    submitting: 'Submitting...',
    success: 'Booking request received! We will be in touch shortly.',
    error: 'Failed to submit. Please try again later.',
    validationError: 'Please fill out all fields.',
  },
};

const Contact = () => {
  const [locale, setLocale] = React.useState(getPreferredLocale());
  React.useEffect(() => onLocaleChange(setLocale), []);
  const dict = copy[locale];

  const [formData, setFormData] = React.useState({ name: '', contact: '', status: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!formData.name.trim() || !formData.contact.trim() || !formData.status.trim()) {
      setErrorMsg(dict.validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/.netlify/functions/notion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.contact,
          message: formData.status,
          inquiry_type: 'consultation',
        }),
      });

      if (!res.ok) {
        throw new Error('Form submission failed');
      }

      setSuccessMsg(dict.success);
      setFormData({ name: '', contact: '', status: '' });
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMsg(dict.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        
        <div className="bg-surface rounded-lg p-8 md:p-14 border border-slate-200 shadow-sm">
          <div className="text-center mb-12">
            <h2 className="text-accent font-bold tracking-[0.3em] uppercase mb-3 text-sm font-sans">Book Consultation</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">{dict.title}</h3>
            <p className="text-slate-600 font-medium font-sans">{dict.desc}</p>
          </div>

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-sm font-semibold text-center font-sans">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-sm text-sm font-semibold text-center font-sans">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 font-sans">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 tracking-wider uppercase">{dict.name}</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={handleChange('name')}
                  disabled={isSubmitting}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-sm p-4 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder-slate-400 shadow-sm disabled:opacity-50"
                  placeholder={dict.namePlaceholder}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 tracking-wider uppercase">{dict.contact}</label>
                <input 
                  type="text" 
                  value={formData.contact}
                  onChange={handleChange('contact')}
                  disabled={isSubmitting}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-sm p-4 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder-slate-400 shadow-sm disabled:opacity-50"
                  placeholder={dict.contactPlaceholder}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 tracking-wider uppercase">{dict.status}</label>
              <textarea 
                rows="4"
                value={formData.status}
                onChange={handleChange('status')}
                disabled={isSubmitting}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-sm p-4 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder-slate-400 resize-none shadow-sm disabled:opacity-50"
                placeholder={dict.statusPlaceholder}
                required
              ></textarea>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white font-bold tracking-widest text-base py-4 rounded-sm hover:bg-accent hover:text-slate-900 transition-all duration-300 uppercase shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? dict.submitting : dict.submit}
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;
