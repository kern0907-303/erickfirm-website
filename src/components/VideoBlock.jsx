import React from 'react';

const VideoBlock = ({ videoUrl, transcript }) => {
  if (!videoUrl) return null;

  const transcriptBlocks = Array.isArray(transcript)
    ? transcript
    : String(transcript || '').split(/\n\n+/).filter(Boolean);

  return (
    <section aria-label="影片與逐字稿" className="mb-12">
      <div className="aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm">
        <video className="h-full w-full" controls playsInline preload="metadata">
          <source src={videoUrl} />
          你的瀏覽器不支援影片播放。
        </video>
      </div>

      {transcriptBlocks.length > 0 && (
        <details className="mt-5 border-y border-slate-300 py-4 text-slate-700">
          <summary className="cursor-pointer font-medium text-slate-900">閱讀逐字稿</summary>
          <div className="mt-5 space-y-5 text-[17px] leading-[1.9]">
            {transcriptBlocks.map((block, index) => <p key={index}>{block}</p>)}
          </div>
        </details>
      )}
    </section>
  );
};

export default VideoBlock;
