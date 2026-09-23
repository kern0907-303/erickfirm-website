import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const INITIAL_FORM = { name: '', email: '', completed: '' };

const OutlineRequestForm = ({ formName, title, description, downloadHref, fields = 'course' }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState('idle');
  const webhookUrl = import.meta.env.VITE_FORM_WEBHOOK_URL;
  const webhookForm = fields === 'consultant' ? 'consultant_details' : 'course_outline';

  const updateField = (field, value) => {
    setStatus('idle');
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const website = event.currentTarget.elements.website.value;
    const email = form.email.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (website) {
      console.warn('Outline request skipped: honeypot field was filled.');
      setStatus('fallback');
      return;
    }
    if (!form.name.trim() || !validEmail || (fields === 'consultant' && !form.completed)) {
      setStatus('invalid');
      return;
    }

    setStatus('submitting');
    const payload = {
      form: webhookForm,
      name: form.name.trim(),
      email,
      ...(fields === 'consultant' ? { completed_main_course: form.completed === 'yes' } : {}),
      source_path: typeof window !== 'undefined' ? window.location.pathname : '',
      submitted_at: new Date().toISOString(),
    };

    try {
      if (!webhookUrl) {
        console.warn('Outline request webhook is not configured; using PDF fallback.');
        setStatus('fallback');
        return;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Webhook request failed: ${response.status}`);
      setStatus('success');
    } catch (error) {
      console.warn('Outline request webhook failed; using PDF fallback.', error);
      setStatus('fallback');
    }
  };

  return (
    <div className="rounded-2xl border border-[#D7C9F2] bg-white p-6 md:p-8">
      <h2 className="mb-3 text-xl font-bold md:text-2xl">{title}</h2>
      <p className="mb-6 text-sm leading-loose text-[#55506B]">{description}</p>
      {status === 'success' ? (
        <div className="rounded-xl bg-[#F7F5FC] p-5 text-sm leading-loose text-[#55506B]" role="status">
          <p className="mb-3">資料已送出，完整內容可以先從這裡下載。</p>
          <a href={downloadHref} download rel="nofollow" className="font-bold text-[#5B3A9E] underline underline-offset-4">下載 PDF</a>
        </div>
      ) : (
        <form name={formName} onSubmit={handleSubmit} className="space-y-4">
          <label className="hidden">網站
            <input name="website" tabIndex="-1" autoComplete="off" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[#1F1A2E]">
              姓名
              <input name="name" required value={form.name} onChange={(event) => updateField('name', event.target.value)} className="mt-2 w-full rounded-lg border border-[#E7E3F0] px-4 py-3 font-normal outline-none transition focus:border-[#5B3A9E]" />
            </label>
            <label className="block text-sm font-medium text-[#1F1A2E]">
              Email
              <input name="email" type="email" required value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-lg border border-[#E7E3F0] px-4 py-3 font-normal outline-none transition focus:border-[#5B3A9E]" />
            </label>
          </div>
          {fields === 'consultant' && (
            <label className="block text-sm font-medium text-[#1F1A2E]">
              是否已完成主課
              <select name="completed" required value={form.completed} onChange={(event) => updateField('completed', event.target.value)} className="mt-2 w-full rounded-lg border border-[#E7E3F0] bg-white px-4 py-3 font-normal outline-none transition focus:border-[#5B3A9E]">
                <option value="">請選擇</option>
                <option value="yes">已完成</option>
                <option value="no">尚未完成</option>
              </select>
            </label>
          )}
          {status === 'invalid' && <p className="text-sm leading-relaxed text-[#9B3C3C]" role="alert">請填寫姓名、有效的 Email，並完成必要選項。</p>}
          {(status === 'fallback') && <p className="text-sm leading-relaxed text-[#55506B]" role="status">若未收到信件請直接下載目前的 PDF。</p>}
          <button type="submit" disabled={status === 'submitting'} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5B3A9E] px-6 py-3 font-medium text-white transition hover:bg-[#472D7D] disabled:cursor-wait disabled:opacity-60">
            {status === 'submitting' ? '送出中…' : '送出並取得 PDF'}<ArrowRight size={16} />
          </button>
          <a href={downloadHref} download rel="nofollow" className="block text-center text-xs text-[#918BA6] underline underline-offset-4">先下載目前的佔位檔</a>
        </form>
      )}
    </div>
  );
};

export default OutlineRequestForm;
