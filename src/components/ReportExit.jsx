import { Link } from 'react-router-dom';

export default function ReportExit({ question }) {
  return (
    <section className="px-6 py-10" aria-label="免費報告">
      <div className="mx-auto max-w-3xl border-t border-slate-300 pt-7 text-sm leading-relaxed text-slate-500">
        <p>{question}</p>
        <p className="mt-2">
          先花十分鐘看這個：
          <Link to="/three" className="underline decoration-slate-400 underline-offset-4 transition-colors hover:text-slate-800">
            《事情卡住的三種樣子》
          </Link>
        </p>
      </div>
    </section>
  );
}
