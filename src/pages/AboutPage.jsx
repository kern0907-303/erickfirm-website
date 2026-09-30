import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import VideoBlock from '../components/VideoBlock';
import { aboutLetter } from '../content/aboutLetter';
import { LINE_CONFIG } from '../lib/constants';

const META_TITLE = '關於艾瑞克｜我做的其實只有一件事，只是換了三種對象';
const META_DESCRIPTION = '二十年來，我做的只有兩個動作：拆解，然後重組順序。生命數字、狀態調和、組織與決策——三個領域，同一件事。';

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[60] h-1 w-full bg-slate-200 md:hidden" aria-hidden="true">
      <div className="h-full bg-[#5B3A9E] transition-[width] duration-100" style={{ width: `${progress}%` }} />
    </div>
  );
};

const LineCta = ({ children }) => (
  <a
    href={LINE_CONFIG.LINE_ADD_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center gap-3 bg-slate-900 px-6 py-4 text-center text-sm font-bold text-white transition-colors hover:bg-slate-700"
  >
    {children}
    <ArrowRight size={17} aria-hidden="true" />
  </a>
);

const AboutPage = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.id = 'about-page-structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: META_TITLE,
      description: META_DESCRIPTION,
      url: 'https://erickfirm.com/about',
      about: { '@id': 'https://erickfirm.com/#erick' },
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <main className="bg-[#fbfaf7] pb-24 pt-32 text-slate-800 md:pb-32 md:pt-36">
      <SEOHead title={META_TITLE} description={META_DESCRIPTION} exactTitle />
      <ReadingProgress />

      <div className="mx-auto max-w-4xl px-6">
        <VideoBlock videoUrl={null} transcript={null} />
      </div>

      <div className="mx-auto max-w-[680px] px-6">
        <article>
          <header className="mb-14 border-b border-slate-300 pb-12 md:mb-16 md:pb-14">
            <p className="mb-5 text-xs tracking-[0.22em] text-slate-500">ABOUT ERICK</p>
            <h1 className="text-4xl font-medium leading-[1.45] tracking-tight text-slate-900 md:text-5xl md:leading-[1.4]">
              {aboutLetter.title}
            </h1>
          </header>

          {aboutLetter.sections.map((section, sectionIndex) => (
            <React.Fragment key={section.id || `section-${sectionIndex}`}>
              <section
                id={section.id}
                className={section.heading ? 'scroll-mt-28 pt-14 md:pt-20' : sectionIndex > 0 ? 'pt-14 md:pt-20' : ''}
              >
                {section.heading && (
                  <h2 className="mb-9 border-t border-slate-300 pt-8 text-2xl font-medium leading-relaxed text-slate-900 md:text-3xl">
                    {section.heading}
                  </h2>
                )}
                <div className="space-y-6 text-[17px] font-light leading-[1.95] text-slate-700 md:text-[18px]">
                  {section.blocks.map((block, blockIndex) => <p key={blockIndex}>{block}</p>)}
                </div>
              </section>

              {section.ctaAfter === 'direction' && (
                <div className="my-14 border-y border-slate-300 py-10 text-center md:my-20">
                  <LineCta>加 LINE，找到適合你的方向</LineCta>
                </div>
              )}

              {section.ctaAfter === 'guide' && (
                <div className="mt-10">
                  <LineCta>加 LINE，領取《事情卡住的三種樣子》</LineCta>
                </div>
              )}
            </React.Fragment>
          ))}
        </article>
      </div>
    </main>
  );
};

export default AboutPage;
