import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import NASMark from '../components/NASMark';

const WEEKS = [
  ['1', '讀盤：從自己的盤，到一個你不認識的人', '30 分鐘內講出一個人的主線'],
  ['2', '問診：他說的問題，通常不是真正的問題', '提問，找到真正的卡點'],
  ['3', '說法：同一個結論，七種講法', '依生命功課等級調整說法，並守住語言界線'],
  ['4', '兩個人的盤', '伴侶、親子、合夥的雙人解讀'],
  ['5', '時間盤：幫別人排節奏', '排出未來十二個月，只談安排不談預測'],
  ['6', '開業：把解盤變成一個可以收費的服務', '服務流程、報告、定價、第一批個案'],
];

const TAKEAWAYS = [
  '解盤流程卡、開場腳本',
  '提問腳本卡、議題轉譯表、停損判斷清單',
  '七級說法對照表、語言界線檢查表',
  '雙人盤與家族盤工作表',
  '十二個月排程表、常見提問的回應腳本',
  '服務說明、報價、同意書、個案報告四份範本',
  '三份指定個案的完整解讀',
  '艾瑞克個人結業認證、認證顧問名錄資格、一年顧問會員權益',
];

const FAQS = [
  ['我沒有相關背景，可以學嗎？', '可以。入學條件是完成主課；主課會先把生命數字的看法、結構與語言基礎交代清楚。'],
  ['跟主課差在哪？', '主課是看懂自己，顧問班是學會幫別人看。兩者是分流，不是深淺。'],
  ['沒辦法每週出席怎麼辦？', '每週直播會提供回放，但現場實作無法補，報名前請先評估自己的時間。'],
  ['結業後一定能接案嗎？', '不一定。課程給的是能力、流程與工具，接案取決於個人投入；本課程不做收入或客源保證。'],
  ['這個認證是什麼性質？', '這是艾瑞克個人的結業認證，不是政府或第三方機構的證照。'],
];

const INITIAL_FORM = { name: '', contact: '', completed: '', problem: '' };

const NASConsultant = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field, value) => {
    setSubmitted(false);
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="bg-white text-[#1F1A2E]">
      <SEOHead
        title="生命數字顧問班｜學會幫別人看盤 - 平衡空間 NAS"
        description="生命數字顧問班給想把解盤變成服務的人。六週線上直播，從讀盤、問診、說法到服務流程；完成主課後以意向登記報名，第一屆預計 2027 年 6–7 月開班。"
      />

      <section className="px-6 pb-16 pt-32">
        <div className="mx-auto max-w-3xl">
          <NASMark label="顧問班" />
          <p className="mb-4 text-xs tracking-[0.2em] text-[#918BA6]">分流／轉職</p>
          <h1 className="mb-7 text-3xl font-bold leading-snug md:text-5xl">
            主課是看懂自己，<br />
            顧問班是學會幫別人看。
          </h1>
          <p className="max-w-2xl leading-loose text-[#55506B]">
            這不是把主課再講深一點，而是把你已經看懂的結構，練成一套能用在別人身上的解盤服務。兩者是分流，不是深淺。
          </p>
        </div>
      </section>

      <section className="bg-[#F7F5FC] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">這門課適合誰？</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-[#D7C9F2] bg-white p-6">
              <h3 className="mb-5 text-lg font-bold text-[#5B3A9E]">適合</h3>
              <ul className="space-y-4 text-sm leading-relaxed text-[#55506B]">
                <li className="flex gap-3"><Check size={17} className="mt-0.5 shrink-0 text-[#5B3A9E]" />已完成主課，想把解盤變成一項可以收費的服務</li>
                <li className="flex gap-3"><Check size={17} className="mt-0.5 shrink-0 text-[#5B3A9E]" />諮詢、教練、療癒、命理、人資等助人工作者，想多一項工具</li>
                <li className="flex gap-3"><Check size={17} className="mt-0.5 shrink-0 text-[#5B3A9E]" />想從現在的工作分流，發展第二條路</li>
              </ul>
            </article>
            <article className="rounded-2xl border border-[#E7E3F0] bg-white p-6">
              <h3 className="mb-5 text-lg font-bold text-[#6E6885]">不適合</h3>
              <ul className="space-y-4 text-sm leading-relaxed text-[#55506B]">
                <li className="flex gap-3"><span className="mt-0.5 shrink-0 text-[#A8883F]">—</span>只想更了解自己（請留在主課）</li>
                <li className="flex gap-3"><span className="mt-0.5 shrink-0 text-[#A8883F]">—</span>還沒完成主課</li>
                <li className="flex gap-3"><span className="mt-0.5 shrink-0 text-[#A8883F]">—</span>想要一套照本宣科的話術</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-xs tracking-[0.2em] text-[#918BA6]">六週直播</p>
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">從看懂，到能幫別人看</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {WEEKS.map(([week, topic, ability]) => (
              <article key={week} className="rounded-2xl border border-[#E7E3F0] bg-white p-6 shadow-[0_8px_26px_rgba(31,26,46,0.04)]">
                <p className="mb-4 text-sm font-semibold tabular-nums text-[#A8883F]">第 {week} 週</p>
                <h3 className="mb-3 font-bold leading-relaxed">{topic}</h3>
                <p className="text-sm leading-relaxed text-[#55506B]">學員帶走：{ability}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F7F5FC] px-6 py-16">
        <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h2 className="mb-6 text-2xl font-bold md:text-3xl">上課方式</h2>
            <ul className="space-y-4 leading-loose text-[#55506B]">
              <li>每週一次線上直播 3 小時：前 2 小時教學，後 1 小時現場實作，艾瑞克當場指導。</li>
              <li>第一屆限收 10 人，每個人都會被輪到上台實作。</li>
              <li>作業全班做同一份指定個案，不必自己去找案主。</li>
              <li>同學之間只提供「作為被解盤者的感受」回饋，不做互相評分。</li>
              <li>開課前 7 天寄行前包：一份指定個案的盤、一段艾瑞克完整解盤錄音、一張觀摩表。</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[#D7C9F2] bg-white p-6">
            <p className="mb-2 text-sm tracking-[0.16em] text-[#918BA6]">你會帶走</p>
            <h2 className="mb-5 text-xl font-bold">一套可以開始練習的工具</h2>
            <ol className="space-y-3 text-sm leading-relaxed text-[#55506B]">
              {TAKEAWAYS.map((item, index) => <li key={item} className="flex gap-3"><span className="w-5 shrink-0 font-semibold tabular-nums text-[#A8883F]">{index + 1}.</span><span>{item}</span></li>)}
            </ol>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-[#E7E3F0] p-6 md:p-8">
            <h2 className="mb-5 text-xl font-bold">結業認證，怎麼取得？</h2>
            <ul className="space-y-4 text-sm leading-relaxed text-[#55506B]">
              <li>結業後 60 天內交 3 份真實個案報告，其中 1 份附完整錄音，由艾瑞克審核。</li>
              <li>通過即取得艾瑞克的結業認證、列入認證顧問名錄、啟用第一年顧問會員。</li>
              <li>未通過可補做，不另外收費。</li>
              <li>這是艾瑞克個人的結業認證，不是政府或第三方機構的證照。</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-[#E7E3F0] bg-[#FBF7EE] p-6 md:p-8">
            <h2 className="mb-5 text-xl font-bold">認證之後：顧問會員</h2>
            <p className="mb-4 text-sm leading-relaxed text-[#55506B]">學費含第一年顧問會員（價值 NT$12,000），第二年起年費 NT$12,000。</p>
            <p className="text-sm leading-relaxed text-[#55506B]">每月個案督導、每季深化課、認證顧問名錄刊登、每月公開解盤夜上台機會、數字每曆顧問專屬連結、內容工具（每月 30 次額度）。</p>
            <p className="mt-4 text-sm leading-relaxed text-[#6E6885]">這些是讓顧問被看見的工具；艾瑞克不轉介個案，不提供客源保證。</p>
          </article>
        </div>
      </section>

      <section className="bg-[#F7F5FC] px-6 py-16">
        <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-xs tracking-[0.2em] text-[#918BA6]">意向登記</p>
            <h2 className="mb-5 text-2xl font-bold md:text-3xl">第一屆預計 2027 年 6–7 月開班</h2>
            <p className="mb-5 leading-loose text-[#55506B]">學費 <strong>NT$32,000</strong>，含第一年顧問會員。完成主課，並於登記時交一份「幫身邊一個人看盤」的作業，才符合入學條件。</p>
            <p className="leading-loose text-[#55506B]">目前採意向登記制，第一屆限收 10 人，不設直接付款。送出資料後，會依登記順序與入學作業安排面談或通知。</p>
          </div>

          <div className="rounded-2xl border border-[#D7C9F2] bg-white p-6 md:p-8">
            <h3 className="mb-5 text-xl font-bold">填寫意向登記</h3>
            {submitted ? (
              <div className="rounded-xl bg-[#F7F5FC] p-5 text-sm leading-relaxed text-[#55506B]" role="status">
                名額有限，開班前會依登記順序與入學作業安排面談或通知。
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm font-medium text-[#1F1A2E]">
                  姓名
                  <input required value={form.name} onChange={(event) => updateField('name', event.target.value)} className="mt-2 w-full rounded-lg border border-[#E7E3F0] px-4 py-3 font-normal outline-none transition focus:border-[#5B3A9E]" />
                </label>
                <label className="block text-sm font-medium text-[#1F1A2E]">
                  聯絡方式
                  <input required value={form.contact} onChange={(event) => updateField('contact', event.target.value)} placeholder="LINE、Email 或電話" className="mt-2 w-full rounded-lg border border-[#E7E3F0] px-4 py-3 font-normal outline-none transition focus:border-[#5B3A9E]" />
                </label>
                <label className="block text-sm font-medium text-[#1F1A2E]">
                  是否已完成主課
                  <select required value={form.completed} onChange={(event) => updateField('completed', event.target.value)} className="mt-2 w-full rounded-lg border border-[#E7E3F0] bg-white px-4 py-3 font-normal outline-none transition focus:border-[#5B3A9E]">
                    <option value="">請選擇</option>
                    <option value="yes">已完成</option>
                    <option value="no">尚未完成</option>
                  </select>
                </label>
                <label className="block text-sm font-medium text-[#1F1A2E]">
                  想解決的問題
                  <textarea required value={form.problem} onChange={(event) => updateField('problem', event.target.value)} rows={4} className="mt-2 w-full resize-y rounded-lg border border-[#E7E3F0] px-4 py-3 font-normal outline-none transition focus:border-[#5B3A9E]" />
                </label>
                <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5B3A9E] px-6 py-3 font-medium text-white transition hover:bg-[#472D7D]">送出意向登記<ArrowRight size={16} /></button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">常見問題</h2>
          <div className="divide-y divide-[#E7E3F0] border-y border-[#E7E3F0]">
            {FAQS.map(([question, answer]) => (
              <article key={question} className="py-6">
                <h3 className="mb-3 font-bold">{question}</h3>
                <p className="text-sm leading-loose text-[#55506B]">{answer}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/nas/course" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D4B86A] px-7 py-4 font-medium text-[#A8883F] transition hover:border-[#A8883F] hover:bg-[#FBF7EE]">回看主課內容<ArrowRight size={16} /></Link>
            <Link to="/nas" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5B3A9E] px-7 py-4 font-medium text-white transition hover:bg-[#472D7D]">回到 NAS<ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NASConsultant;
