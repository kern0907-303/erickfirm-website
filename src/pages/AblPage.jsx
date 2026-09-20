import React, { useState, useEffect } from 'react';
import {
  Play,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  Video,
  AlertCircle,
  Cpu,
  Activity,
  Radio,
  FileText,
  ArrowRight,
  Zap,
  BatteryCharging,
  Smartphone,
  Flame,
  Search,
} from 'lucide-react';
import { LINE_CONFIG } from '../lib/constants';
import SEOHead, { updateMetaTags } from '../components/SEOHead';

const ABL_LINE_BOOKING_URL = `${LINE_CONFIG.LINE_MESSAGE_URL}%E3%80%90ABL%20TimeWaver%E8%AA%BF%E5%92%8C%E9%A0%90%E7%B4%84%E3%80%91`;

const AblPage = () => {
  // 10 分鐘解說影片解鎖狀態管理 (localStorage 記憶)
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    challenge: '每天醒來都像沒充飽電，意志力透支',
  });
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('erick_abl_vsl_unlocked');
    if (saved === 'true') {
      setIsUnlocked(true);
    }

    updateMetaTags({
      title: 'ABL 信息調和｜為什麼你每天醒來都像沒充飽電？德國 TimeWaver 幫你關閉生命後台耗電程式 - Erick Firm',
      description: '你不是不夠努力，是你的生命後台在漏電。德國 TimeWaver 量子科技：20 分鐘掃出吃光你精力的隱藏阻力，線上頻率支持重塑身心承接力。',
      url: 'https://erickfirm.com/abl',
    });
  }, []);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact.trim()) {
      alert('請填寫稱呼與聯絡方式，即可立即解鎖 10 分鐘實測影片！');
      return;
    }
    localStorage.setItem('erick_abl_vsl_unlocked', 'true');
    localStorage.setItem('erick_abl_lead_info', JSON.stringify({ ...formData, timestamp: new Date().toISOString() }));
    setIsUnlocked(true);

    const vslSection = document.getElementById('vsl-player');
    if (vslSection) {
      vslSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': 'https://erickfirm.com/abl#service',
        name: '艾伯林 ABL 信息調和（TimeWaver 遠距分析與頻率支持）',
        provider: {
          '@type': 'Person',
          '@id': 'https://erickfirm.com/#erick',
          name: '奧斯學長',
          alternateName: ['Erick'],
          jobTitle: '生命底層結構對位顧問 / TimeWaver 系統分析專家',
          url: 'https://erickfirm.com',
        },
        serviceType: 'TimeWaver Information Field Analysis & Frequency Optimization',
        description: '運用德國 TimeWaver 系統進行信息場深度掃描與遠距量子頻率調和，協助高壓決策者排除隱性阻力、重塑身心承接力。',
        areaServed: 'Worldwide (Online)',
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: 'https://erickfirm.com/abl',
          serviceLocation: {
            '@type': 'VirtualLocation',
            name: 'Google Meet 視訊解讀 + TimeWaver 遠距頻率支持',
          },
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://erickfirm.com/abl#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'TimeWaver 信息調和是什麼？它是如何幫到我的？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '就像手機背景開了太多耗電 App 導致發燙一樣，人的潛意識與信息場也會因為未釋放的壓力而持續漏能。德國 TimeWaver 能客觀掃描出吃光你精力的隱藏阻力，並透過遠距頻率共振幫你修補漏洞，重置深層精力。',
            },
          },
          {
            '@type': 'Question',
            name: '為什麼 TimeWaver 可以 100% 線上遠距進行？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '如同手機不需要插線也能接收 Wi-Fi 訊號一樣，量子信息場具備非定域性。在線上建立辨識後即可進行精準比對與頻率傳遞，完整解讀透過 Google Meet 視訊進行，完全不受空間限制。',
            },
          },
          {
            '@type': 'Question',
            name: '調和過程會有侵入性或副作用嗎？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '完全無侵入性、無副作用。絕大多數人回饋思緒沉靜放鬆、當晚睡眠深度顯著提升、日常焦慮感大幅減輕。',
            },
          },
          {
            '@type': 'Question',
            name: '如何開始預約？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '加入官方 LINE 點選【ABL TimeWaver 調和預約】，專人將於 24 小時內發送可預約時段與透明費用說明。',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-white text-slate-900 font-sans pt-24 pb-20 selection:bg-cyan-100 selection:text-cyan-900">
      <SEOHead
        title="ABL 信息調和｜為什麼你每天醒來都像沒充飽電？德國 TimeWaver 幫你關閉生命後台耗電程式 - Erick Firm"
        description="你不是不夠努力，是你的生命後台在漏電。德國 TimeWaver 量子科技：20 分鐘掃出吃光你精力的隱藏阻力，線上頻率支持重塑身心承接力。"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ========================================================= */}
      {/* 00. HERO 首屏：顧客第一人稱切入 + 超級類比 + 3秒懂利益 */}
      {/* ========================================================= */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-22 overflow-hidden bg-gradient-to-b from-[#F4F9FA] via-white to-white">
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          
          {/* Tiffany 藍識別標籤 */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-[#E0F7F7] border border-[#00C2C2]/40 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00C2C2] animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-[#006E6E] font-mono">
              專為高壓創業者、決策者與身心透支者打造 · 100% 線上進行
            </span>
          </div>

          {/* 顧客心聲第一人稱穿透性大主標 */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 leading-[1.3] tracking-tight font-display mb-6">
            「為什麼我明明沒生病，
            <br />
            每天醒來卻像<span className="text-[#008A8A] underline decoration-[#00C2C2]/60 underline-offset-8">沒充飽電的電池</span>？」
          </h1>

          {/* 手機後台神級類比：1秒瞬間理解為什麼自己會卡 */}
          <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-5 sm:p-6 mb-8 max-w-2xl mx-auto shadow-sm text-left">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E0F7F7] text-[#006E6E] flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone size={22} />
              </div>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                就像一台<strong>背景開了 50 個隱藏 App 的手機</strong>——你沒在滑它，電量卻狂掉、機身發燙。
                <br className="hidden sm:inline" />
                你不是意志力不夠，是你的<strong>「生命後台」在偷偷漏電</strong>。
              </p>
            </div>
          </div>

          {/* 解方承諾 */}
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
            導入<strong>德國專業級 TimeWaver 科技</strong>：20 分鐘抓出吃光你精力的隱藏耗電程式，
            在線上用專屬頻率幫你把漏電破洞一一關閉，重塑你的身心承接力。
          </p>

          {/* 雙行動按鈕：強烈利益與行動導向 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mb-12">
            <a
              href="#vsl"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900 text-white font-bold text-sm sm:text-base hover:bg-[#008A8A] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Zap size={18} className="text-[#00C2C2] group-hover:scale-110 transition-transform" />
              免費看實測：我的精力被什麼偷走了？➔
            </a>
            <a
              href={ABL_LINE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white border-2 border-[#00C2C2] text-[#006E6E] font-bold text-sm sm:text-base hover:bg-[#E0F7F7] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              預約線上調和 ↗
            </a>
          </div>

          {/* 顧客直接得到的 4 大結果 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 border-t border-slate-100 text-slate-700 text-xs sm:text-sm font-semibold">
            <div className="flex items-center justify-center gap-1.5">
              <BatteryCharging size={16} className="text-[#00A8A8]" /> 找出慢性漏電原因
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles size={16} className="text-[#00A8A8]" /> 關閉大腦深夜運轉
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Zap size={16} className="text-[#00A8A8]" /> 排除無名拖延阻抗
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Radio size={16} className="text-[#00A8A8]" /> 100% 線上免出門
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 01. 顧客視角對號入座：手機後台類比深入解析 */}
      {/* ========================================================= */}
      <section className="py-16 bg-slate-50/80 border-y border-slate-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#008A8A] tracking-widest uppercase font-mono">
              01 · 你的後台正在發生什麼事？
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mt-2 font-display">
              如果你有這三種感覺，代表你的後台程式超載了
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 卡片 1 */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm hover:border-[#00C2C2] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#E0F7F7] text-[#006E6E] font-bold flex items-center justify-center mb-4">
                <Flame size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. 待機時也在發燙</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                明明躺在床上準備睡覺，腦袋卻自動瘋狂覆盤。睡醒像沒睡過一樣，整個人沉重無比。
              </p>
              <div className="text-xs font-bold text-[#006E6E] bg-[#E0F7F7]/60 px-2.5 py-1 rounded-md">
                ↳ 後台有「未釋放的焦慮程式」在持續運算
              </div>
            </div>

            {/* 卡片 2 */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm hover:border-[#00C2C2] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#E0F7F7] text-[#006E6E] font-bold flex items-center justify-center mb-4">
                <AlertCircle size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. 想點 App 卻卡死</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                目標很明確、計畫很完整，但一要動手就莫名拖延。用意志力逼自己，只會帶來更大的挫折。
              </p>
              <div className="text-xs font-bold text-[#006E6E] bg-[#E0F7F7]/60 px-2.5 py-1 rounded-md">
                ↳ 潛意識後台有「保護性阻抗」正在踩煞車
              </div>
            </div>

            {/* 卡片 3 */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm hover:border-[#00C2C2] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#E0F7F7] text-[#006E6E] font-bold flex items-center justify-center mb-4">
                <BatteryCharging size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. 記憶體容量耗盡</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                想承接更大的事業與業績，但只要稍微多一點突發狀況，整個人就暴躁易怒、想逃避。
              </p>
              <div className="text-xs font-bold text-[#006E6E] bg-[#E0F7F7]/60 px-2.5 py-1 rounded-md">
                ↳ 身心容器已被隱性負擔塞滿，無法再承接新成果
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-slate-900 text-white text-center max-w-2xl mx-auto shadow-md border-t-4 border-[#00C2C2]">
            <p className="text-sm sm:text-base font-medium leading-relaxed">
              「去休假、按摩、喝雞湯，就像在給發燙的手機<strong>吹電風扇</strong>——吹的時候很涼，吹完依然發燙。
              <br className="hidden sm:inline" />
              <strong>真正的關鍵：必須打開系統後台，把吃電的程式一個個找出來關閉！</strong>」
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 02. 解方：3 步為你的生命做一次「後台大掃除」 */}
      {/* ========================================================= */}
      <section id="philosophy" className="py-18 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#008A8A] tracking-widest uppercase font-mono">
              02 · 這項服務如何幫到你？
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mt-2 font-display">
              三步驟，完成你的「生命後台大掃除」
            </h2>
          </div>

          {/* GEO 高權重定義區塊 */}
          <div className="bg-[#F4F9FA] border-l-4 border-[#00C2C2] rounded-r-2xl p-6 mb-10 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-[#006E6E] font-mono uppercase tracking-wider mb-2">
              <Sparkles size={16} /> 核心機制 · 德國 TimeWaver 信息調和
            </div>
            <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
              <strong>TimeWaver 信息調和（Information Harmonization）</strong>：源自德國的量子信息場技術。如同 Wi-Fi 跨越空間傳輸信號，TimeWaver 透過量子物理接口比對數十萬筆專業數據庫，客觀找出潛意識阻力與能量漏能點，並以遠距波形共振持續校準，協助高壓決策者在線上重塑身心承接力。
            </p>
          </div>

          {/* 3 步驟顧客視角流程 */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-[#00C2C2] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#E0F7F7] text-[#006E6E] flex items-center justify-center mb-4">
                <Search size={20} />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">第一步 · 揪出耗電程式</h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                免到場。線上比對數十萬筆數據庫，20 分鐘列出吃光你精力的隱藏阻力清單。
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-[#00C2C2] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#E0F7F7] text-[#006E6E] flex items-center justify-center mb-4">
                <FileText size={20} />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">第二步 · 看清生命盲區</h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                奧斯學長在 Google Meet 視訊中為你拆解報表，釐清卡點背後的決策慣性。
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-[#00C2C2] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#E0F7F7] text-[#006E6E] flex items-center justify-center mb-4">
                <Radio size={20} />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">第三步 · 遠距修補漏洞</h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                發送專屬優化頻率（7~30 天），在背景持續修補信息場，讓你睡眠變深、思緒清澈。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 03. 核心實測解密影片：極強行動力誘因（LEAD GATE VSL） */}
      {/* ========================================================= */}
      <section id="vsl" className="py-20 bg-[#F4F9FA] relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F7F7] text-[#006E6E] text-xs font-bold border border-[#00C2C2]/40 mb-3 font-mono">
              <Clock size={14} /> 10 分鐘實測解密
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-slate-900 tracking-tight">
              【實測解密】看一台儀器，如何在 10 分鐘內隔空抓出你看不見的卡點？
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base max-w-xl mx-auto">
              在決定預約前，親眼看看 TimeWaver 實際掃描的真實畫面與數據庫比對過程。
            </p>
          </div>

          <div id="vsl-player" className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl overflow-hidden max-w-3xl mx-auto">
            {!isUnlocked ? (
              // ------------------- 未解鎖：留資料閘道 -------------------
              <div className="max-w-md mx-auto">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 mb-6 flex flex-col items-center justify-center p-6 text-center shadow-inner">
                  <div className="w-14 h-14 rounded-full bg-[#00C2C2] text-slate-900 flex items-center justify-center mx-auto mb-3 shadow-md ring-4 ring-cyan-200/50">
                    <Lock size={24} />
                  </div>
                  <p className="text-base font-bold text-white mb-1">TimeWaver 實測解密影片（已鎖定）</p>
                  <p className="text-xs text-slate-300">填寫下方資料，立即在當前頁面解鎖觀看</p>
                </div>

                <form onSubmit={handleUnlock} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                      您的稱呼 *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="例：陳小姐、David"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#00C2C2] focus:bg-white transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                      Email 或 LINE ID (接收調和資料) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="例：email@domain.com 或 LINE ID"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#00C2C2] focus:bg-white transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                      目前最想關閉的後台耗電問題：
                    </label>
                    <select
                      value={formData.challenge}
                      onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#00C2C2] focus:bg-white transition-colors text-sm"
                    >
                      <option value="每天醒來都像沒充飽電，意志力透支">每天醒來都像沒充飽電，意志力透支</option>
                      <option value="夜間大腦無法關機，失眠多夢">夜間大腦無法關機，失眠多夢</option>
                      <option value="目標明確卻莫名拖延、動彈不得">目標明確卻莫名拖延、動彈不得</option>
                      <option value="承接力到極限，突發壓力容易煩躁">承接力到極限，突發壓力容易煩躁</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-slate-900 hover:bg-[#008A8A] text-white font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-5"
                  >
                    <Unlock size={18} />
                    立即解鎖 10 分鐘實測影片（免費觀看）➔
                  </button>

                  <p className="text-center text-[11px] text-slate-400">
                    🔒 資料僅用於發送 TimeWaver 說明，絕不外洩。
                  </p>
                </form>
              </div>
            ) : (
              // ------------------- 已解鎖：影片播放器 -------------------
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-[#008A8A] text-sm font-bold">
                    <CheckCircle2 size={18} />
                    <span>已解鎖：TimeWaver 10 分鐘實測解密影片</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">時長：10 分鐘</span>
                </div>

                {/* 視頻播放容器 */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-md mb-6">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0"
                    title="ABL TimeWaver 10 分鐘深度解說"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* 影片章節導讀 */}
                <div className="bg-[#F4F9FA] rounded-xl p-4 border border-slate-200 mb-6 text-xs text-slate-700">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2 font-mono">
                    影片重點看點：
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <div>⏱ <strong>00:00</strong> 為什麼意志力硬撐反而讓後台漏電更嚴重？</div>
                    <div>⏱ <strong>02:40</strong> TimeWaver 系統實測操作與數據比對實錄</div>
                    <div>⏱ <strong>06:10</strong> 遠距頻率共振如何像 Wi-Fi 一樣跨越空間傳遞？</div>
                    <div>⏱ <strong>08:30</strong> 調和後 7~30 天身心承接力的重塑過程</div>
                  </div>
                </div>

                <div className="text-center">
                  <a
                    href={ABL_LINE_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-900 hover:bg-[#008A8A] text-white font-bold text-base transition-all shadow-lg cursor-pointer"
                  >
                    看完了，預約我的 1 對 1 線上調和（限量）➔
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 04. 邊界與適合對象（誠實篩選 + 顧客價值） */}
      {/* ========================================================= */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-[#00C2C2] tracking-widest uppercase font-mono">
              04 · 誠實篩選
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 font-display text-white">
              這個服務真的適合我嗎？
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* 適合對象 */}
            <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
              <div className="flex items-center gap-2 text-[#00C2C2] font-bold text-base mb-3">
                <CheckCircle2 size={20} /> 如果符合以下情況，它能幫你省下大量無效內耗：
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#00C2C2]">✔</span> 高壓創業者、企業主、核心決策者，不想再靠硬撐過日子。
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00C2C2]">✔</span> 試過休假、運動、各種課程，但深層緊繃與漏能感依然在。
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00C2C2]">✔</span> 相信客觀數據，渴望透過科學科技找到底層原因的人。
                </li>
              </ul>
            </div>

            {/* 不適合對象 */}
            <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-base mb-3">
                <AlertCircle size={20} /> 如果符合以下情況，請勿預約：
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✖</span> 尋求生理疾病醫療者（請循正規醫療管道）。
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✖</span> 期待不用任何行動、只想靠奇蹟速成暴富的人。
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✖</span> 迷信怪力亂神、排斥科學客觀數據者。
                </li>
              </ul>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400">
            ⚖️ 法規聲明：本服務為信息場頻率調和與結構對焦，非醫療行為，不具任何醫療診斷或心理諮商性質。
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 05. 常見問題 FAQ（消除最後預約疑慮） */}
      {/* ========================================================= */}
      <section id="booking" className="py-18 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#008A8A] tracking-widest uppercase font-mono">
              05 · 常見問答
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 font-display">
              預約前的常見問題
            </h2>
          </div>

          <div className="space-y-3 mb-14">
            {[
              {
                q: '我人在國外或外縣市，真的可以 100% 線上完成嗎？',
                a: '是的。如同手機不需要接實體線就能連上 Wi-Fi 訊號一樣，量子信息場不受物理空間距離限制。在線上建立基本資料後，TimeWaver 即可進行精準比對與頻率傳遞，報表解讀透過 Google Meet 視訊進行，完全無需出門奔波。',
              },
              {
                q: '調和之後我會有什麼感覺？會有副作用嗎？',
                a: '完全無侵入性、無副作用。絕大多數人回饋當晚睡眠深度顯著提升、早晨醒來頭腦清澈放鬆、面對重大決策時不再感到焦慮卡死，是溫和且客觀的頻率支持。',
              },
              {
                q: '我通常需要進行幾次調和？',
                a: '單次調和能迅速定位當前最嚴重的漏能點並提供頻率支持；若面臨長期累積的深層模式，建議進行 2 至 3 次的週期性階段校準。',
              },
              {
                q: '如何開始預約與了解費用？',
                a: '點擊下方按鈕加入官方 LINE，輸入【ABL TimeWaver調和預約】，專人將於 24 小時內發送時段與透明費用說明。資訊公開，絕無強迫推銷。',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-slate-900 flex justify-between items-center gap-4 hover:text-[#008A8A] transition-colors cursor-pointer text-sm sm:text-base"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle size={18} className="text-[#00A8A8] shrink-0" />
                    {faq.q}
                  </span>
                  <span className="text-lg text-slate-400 font-mono">
                    {activeFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-[#F4F9FA]/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 終端超強行動呼籲卡片 */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center shadow-xl relative overflow-hidden border-2 border-[#00C2C2]/40">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00C2C2]/10 rounded-full blur-3xl pointer-events-none" />
            <span className="inline-block px-3 py-1 rounded-full bg-[#E0F7F7] text-[#006E6E] text-xs font-bold font-mono mb-4">
              每週限定 5 位 · 100% 線上進行
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-3">
              別讓昨天的後台程式，吃光你明天的精力
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto mb-6 leading-relaxed">
              給自己的生命系統做一次徹底的調和。點擊下方按鈕加入官方 LINE，立即預約你的 1 對 1 TimeWaver 線上調和。
            </p>

            <a
              href={ABL_LINE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#00C2C2] hover:bg-[#00A8A8] text-slate-950 font-extrabold text-base transition-all shadow-lg hover:scale-105 cursor-pointer font-display"
            >
              立即預約 TimeWaver 線上調和 ↗
            </a>

            <p className="text-[11px] text-slate-400 mt-3">
              暗號【ABL TimeWaver調和預約】· 專人於 24 小時內回覆
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AblPage;
