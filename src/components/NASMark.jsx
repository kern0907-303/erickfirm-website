import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NAS 品牌標記。
 * 每個 NAS 頁面最上方掛一個，讓訪客一眼分得出現在在哪個品牌的地盤
 * （erickfirm.com 底下同時有 NAS／ABL／I8 三條線）。
 * 要改 logo、品牌名或金色分隔線，改這一個檔案就好。
 */
const NASMark = ({ label }) => (
  <Link to="/nas" className="group inline-flex items-center gap-3 mb-7">
    <img src="/logo-nas.png" alt="平衡空間 NAS" className="h-9 w-auto" />
    <span className="h-6 w-px bg-[#D4B86A]" aria-hidden="true" />
    <span className="text-xs tracking-[0.18em] font-semibold text-[#5B3A9E] transition group-hover:text-[#472D7D]">
      平衡空間 NAS{label ? `　${label}` : ''}
    </span>
  </Link>
);

export default NASMark;
