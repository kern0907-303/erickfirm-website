import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Calendar, User, Mail, Activity } from 'lucide-react';

// --- 設定 Supabase 連線 ---
// 請確認這裡已填入真實的 URL 和 Key
const supabaseUrl = 'https://wbbnjasjyfuatkvnoogi.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiYm5qYXNqeWZ1YXRrdm5vb2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NDI2NjIsImV4cCI6MjA4MzAxODY2Mn0.uy7vPbCoviDntEMh9lG4UdTmoWhAODFAQ71BMJqCX2c'; 

const Contact = () => {
  const [supabase, setSupabase] = useState(null);

  useEffect(() => {
    if (window.supabase) {
      const client = window.supabase.createClient(supabaseUrl, supabaseKey);
      setSupabase(client);
    }
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthdate: '', 
    inquiryType: 'Abliene_Cleaning', // 預設：承接上方 Abliene 的流量
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) {
      alert("系統連線初始化中，請稍後再試。");
      return;
    }
    setStatus('sending');

    try {
      const { error } = await supabase
        .from('diagnoses')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            birthdate: formData.birthdate,
            inquiry_type: formData.inquiryType,
            message: formData.message
          }
        ]);

      if (error) throw error;
      setStatus('success');
      setFormData({ name: '', email: '', birthdate: '', inquiryType: 'Abliene_Cleaning', message: '' });
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 relative border-t border-[#333]">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* 修改點：強調人工與深度 */}
          <h2 className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-4 tracking-wide">
            預約深度諮詢
          </h2>
          <p className="text-slate-800 text-lg">
            數據只是起點，整合才是關鍵。<br/>
            此通道專為<span className="text-[#00F0FF] font-bold">「頻率調頻」</span>與<span className="text-[#00F0FF] font-bold">「全維度戰略」</span>設立。
          </p>
        </motion.div>

        <div className="bg-[#181818] p-8 md:p-12 rounded-sm border border-[#D4AF37]/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                  <User size={14} /> 預約人姓名 (Name)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  required
                  className="w-full bg-slate-50 border border-[#333] text-slate-900 p-4 rounded-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="Erick Wang"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                  <Mail size={14} /> 聯繫信箱 (Email)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  required
                  className="w-full bg-slate-50 border border-[#333] text-slate-900 p-4 rounded-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="contact@erickfirm.com"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                  <Calendar size={14} /> 出生日期 (Date of Birth)
                </label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  required
                  className="w-full bg-slate-50 border border-[#333] text-slate-600 p-4 rounded-sm focus:border-[#D4AF37] focus:outline-none transition-colors scheme-dark"
                  onChange={handleChange}
                />
                <p className="text-[10px] text-[#666]">*諮詢前置作業所需參數</p>
              </div>

              <div className="space-y-2">
                <label className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                  <Activity size={14} /> 預約項目 (Service)
                </label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  className="w-full bg-slate-50 border border-[#333] text-slate-900 p-4 rounded-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  onChange={handleChange}
                >
                  {/* 修改點：選項簡化，對齊戰略 */}
                  <option value="Abliene_Cleaning">Abliene - 艾伯林頻率雜訊清理</option>
                  <option value="Full_Strategy">Erick Protocol - 全維度結構戰略 (高階)</option>
                  <option value="Other_Collab">其他合作洽談</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase">當前核心卡點 (The Core Friction)</label>
              <textarea
                name="message"
                value={formData.message}
                rows="4"
                className="w-full bg-slate-50 border border-[#333] text-slate-900 p-4 rounded-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                placeholder="請簡述您希望透過諮詢解決的具體問題..."
                onChange={handleChange}
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-[#0A0A0A] font-bold text-lg uppercase tracking-widest hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300 rounded-sm flex items-center justify-center gap-2"
            >
              {status === 'sending' ? '加密連線中...' : (
                <>
                  <Send size={20} />
                  送出預約申請 (Submit Request)
                </>
              )}
            </motion.button>

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-[#00F0FF]/10 border border-[#00F0FF] text-[#00F0FF] text-center rounded-sm"
              >
                申請已送達。專案團隊將於 48 小時內與您聯繫安排時間。
              </motion.div>
            )}
            
            {status === 'error' && (
              <motion.div className="p-4 bg-red-500/10 border border-red-500 text-red-500 text-center rounded-sm">
                傳輸失敗，請稍後再試。
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;