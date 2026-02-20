import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        
        <div className="bg-[#F8FAFC] rounded-2xl p-8 md:p-14 border border-slate-200">
          <div className="text-center mb-12">
            <h2 className="text-[#D4AF37] font-bold tracking-[0.3em] uppercase mb-3 text-sm">Book Consultation</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">預約專屬診斷</h3>
            {/* 說明文字加深 */}
            <p className="text-slate-600 font-medium">留下您的資訊，我們將安排專人與您聯繫，啟動關係結構修復。</p>
          </div>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                {/* 標籤加深為 slate-800 */}
                <label className="text-xs font-bold text-slate-800 tracking-wider uppercase">姓名 / Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-sm p-4 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder-slate-400 shadow-sm"
                  placeholder="請輸入姓名"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 tracking-wider uppercase">聯繫方式 / Email or Phone</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-sm p-4 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder-slate-400 shadow-sm"
                  placeholder="Email 或 手機號碼"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 tracking-wider uppercase">目前面臨的卡點 / Current Status</label>
              <textarea 
                rows="4"
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-sm p-4 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder-slate-400 resize-none shadow-sm"
                placeholder="請簡述您企業或個人目前遇到的瓶頸..."
              ></textarea>
            </div>

            <div className="pt-4">
              <button 
                type="button"
                className="w-full bg-slate-900 text-white font-bold tracking-widest text-base py-4 rounded-sm hover:bg-[#D4AF37] transition-all duration-300 uppercase shadow-md"
              >
                送出預約申請
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;
