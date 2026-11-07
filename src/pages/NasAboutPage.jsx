import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LINE_CONFIG } from '../lib/constants';
import HeroTextReveal from '../components/HeroTextReveal';
import SEOHead from '../components/SEOHead';
import NASMark from '../components/NASMark';
import { LEGAL_TAX_ID } from '../content/ablLegal';
import { NAS_LEGAL_EMAIL } from '../content/nasLegal';
import { LEGAL_SELLER_LINE_NAS } from '../content/nas2027Content';
import {
  NAS_ABOUT_TITLE, NAS_ABOUT_DESCRIPTION, NAS_ABOUT_HERO, NAS_ABOUT_SECTIONS, NAS_ABOUT_ACTIONS, NAS_ABOUT_CONTACT_TITLE,
} from '../content/nasAbout';

// 平衡空間版「認識艾瑞克」：冷流量從平衡空間的頁面點進來，只看到平衡空間，不跳到 Erick Firm。
// 版型沿用 /nas/2027（白底、紫金點綴、NAS 品牌標記），首屏標題逐字浮現。
const NasAboutPage = () => (
  <main className="bg-white text-[#1F1A2E]">
    <SEOHead title={NAS_ABOUT_TITLE} description={NAS_ABOUT_DESCRIPTION} exactTitle />

    <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-white via-[#F4F0FB]/60 to-white">
      <div className="max-w-3xl mx-auto">
        <NASMark label="認識艾瑞克" />
        <HeroTextReveal
          title={NAS_ABOUT_HERO.title}
          subtitle={NAS_ABOUT_HERO.subtitle}
          titleClassName="text-3xl md:text-[2.6rem] font-bold leading-snug mb-6"
          subtitleClassName="text-lg text-[#55506B] leading-loose"
        />
      </div>
    </section>

    {NAS_ABOUT_SECTIONS.map((section, index) => (
      <section key={section.title} className={`py-14 px-6 ${index % 2 === 1 ? 'bg-[#F7F5FC]' : ''}`}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{section.title}</h2>
          {section.paragraphs.map((text) => (
            <p key={text} className="text-lg text-[#55506B] leading-loose mb-3">{text}</p>
          ))}
        </div>
      </section>
    ))}

    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
        {NAS_ABOUT_ACTIONS.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={action.primary
              ? 'inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#5B3A9E] text-white font-medium hover:bg-[#472D7D] active:scale-[0.98] transition'
              : 'inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-[#D4B86A] text-[#85691F] hover:border-[#A8883F] hover:bg-[#FBF7EE] active:scale-[0.98] transition'}
          >
            {action.label}<ArrowRight size={16} />
          </Link>
        ))}
      </div>
    </section>

    <section className="pb-16 px-6">
      <div className="max-w-3xl mx-auto border-t border-[#F0EDF7] pt-8">
        <h2 className="text-xl font-bold mb-3">{NAS_ABOUT_CONTACT_TITLE}</h2>
        <p className="text-lg text-[#55506B] leading-loose">
          <a href={LINE_CONFIG.NAS_LINE_ADD_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-[#5B3A9E]">平衡空間官方 LINE</a>
          　{NAS_LEGAL_EMAIL}
        </p>
      </div>
    </section>

    <footer className="px-6 pb-14">
      <div className="max-w-4xl mx-auto border-t border-[#F0EDF7] pt-8 text-center text-[13px] leading-loose text-[#6B6584]">
        <p>{LEGAL_SELLER_LINE_NAS}　統一編號 {LEGAL_TAX_ID}　{NAS_LEGAL_EMAIL}</p>
        <nav aria-label="法務資訊" className="mt-2 flex justify-center gap-5">
          <Link to="/nas/terms" className="underline underline-offset-4 hover:text-[#5B3A9E]">服務條款</Link>
          <Link to="/nas/privacy" className="underline underline-offset-4 hover:text-[#5B3A9E]">隱私權政策</Link>
        </nav>
      </div>
    </footer>
  </main>
);

export default NasAboutPage;
