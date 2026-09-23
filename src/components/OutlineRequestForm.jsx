import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const INITIAL_FORM = { name: '', email: '', completed: '' };

const OutlineRequestForm = ({ formName, title, description, downloadHref, fields = 'course' }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState('idle');

  const updateField = (field, value) => {
    setStatus('idle');
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('submitting');
    const data = new URLSearchParams({
      'form-name': formName,
      name: form.name,
      email: form.email,
      ...(fields === 'consultant' ? { completed: form.completed } : {}),
    });

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });
      if (!response.ok) throw new Error(`Form submission failed: ${response.status}`);
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
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
        <form name={formName} data-netlify="true" onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="form-name" value={formName} />
          <p className="hidden"><label>不要填這一欄：<input name="bot-field" /></label></p>
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
          {status === 'error' && <p className="text-sm leading-relaxed text-[#9B3C3C]" role="alert">送出時遇到問題，請稍後再試；你也可以直接下載目前的佔位檔。</p>}
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
