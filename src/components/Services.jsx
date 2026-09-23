import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';
const services = [
  {
    title: '初八信息顧問 I8',
    label: '工作卡住',
    feeling: '公司很努力，成果卻一直卡在同一個地方。',
    perspective: '不急著給方案，先把角色、授權和決策方式攤開，找出真正拖住營運的那一個結構。',
    process: '盤點現況 → 找出關鍵卡點 → 一起調整 → 定期回看。',
  },
  {
    title: '平衡空間 NAS',
    label: '定位卡住',
    feeling: '你很努力，卻不確定是不是用了適合自己的方式在努力。',
    perspective: '用生命數字，看懂你的思考慣性、行動節奏和關係模式。數字不是標籤，是理解自己的線索。',
    process: '生命數字解析 → 整理天賦與盲點 → 找到比較適合你的方向與節奏。',
  },
  {
    title: '艾伯林 ABL',
    label: '自己卡住',
    summary: '陪你把長期撐住的狀態，慢慢調回來。',
    feeling: '知道要改變，卻一直提不起力氣；休息了，還是覺得累。',
    perspective: '先不急著給你更多方法，而是先看見長期硬撐帶來的內在消耗，讓狀態先穩下來。',
    process: '狀態觀察 → 找出消耗的來源 → 狀態支持 → 定期陪伴。',
  },
];

const Services = () => {
  const reduceMotion = useReducedMotion();
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.1 } },
  };
  const item = reduceMotion
    ? { hidden: {}, visible: {} }
    : { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <section id="services" className="bg-[#f3f4f1] py-20 md:py-28">
      <div className="container mx-auto max-w-7xl px-6">
        <Reveal className="mb-14 max-w-2xl">
          <p className="text-xs tracking-[0.22em] text-slate-500 mb-5">THREE WAYS</p>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">三條路，看的是同一件事</h2>
          <p className="mt-7 text-base md:text-lg leading-loose text-slate-600">我把這二十年的方法，整理成三條路。<br />你不需要全部走，只需要先走對的那一條。</p>
        </Reveal>
        <motion.div
          className="grid gap-px overflow-hidden border border-slate-300 bg-slate-300 md:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
        >
          {services.map((service) => (
            <motion.article key={service.title} variants={item} className="bg-white p-7 md:p-9">
              <p className="text-xl font-bold text-slate-900">{service.title}</p>
              {service.summary && <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.summary}</p>}
              <p className="mt-5 inline-block border border-slate-300 px-3 py-1 text-xs text-slate-600">{service.label}</p>
              <div className="mt-8 space-y-6 text-sm leading-loose text-slate-600">
                <p><span className="block mb-1 font-bold text-slate-900">你會有的感覺</span>{service.feeling}</p>
                <p><span className="block mb-1 font-bold text-slate-900">我怎麼看</span>{service.perspective}</p>
                <p><span className="block mb-1 font-bold text-slate-900">大概怎麼進行</span>{service.process}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
