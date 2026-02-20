import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* 表單外部高級容器 */}
        <div className="bg-slate-900 rounded-3xl shadow-2xl p-8 md:p-14 border border-slate-800">
          <div className="text-center mb-12">
            <h2 className="text-[#D4AF37] font-bold tracking-[0.3em] uppercase mb-3 text-sm">Book Consultation</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">預約專屬診斷</h3>
            <p className="text-slate-400">留下您的資訊，我們將安排專人與您聯繫，啟動關係結構修復。</p>
          </div>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#D4AF37] tracking-wider uppercase">姓名 / Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-4 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder-slate-500"
                  placeholder="請輸入姓名"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#D4AF37] tracking-wider uppercase">聯繫方式 / Email or Phone</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-4 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder-slate-500"
                  placeholder="Email 或 手機號碼"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#D4AF37] tracking-wider uppercase">目前面臨的卡點 / Current Status</label>
              <textarea 
                rows="4"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-4 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder-slate-500 resize-none"
                placeholder="請簡述您企業或個人目前遇到的瓶頸..."
              ></textarea>
            </div>

            <button 
              type="button"
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B59530] text-slate-900 font-bold tracking-widest text-lg py-5 rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 mt-4 uppercase"
            >
              送出預約申請
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;
