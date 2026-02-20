import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 獲取文章內容（這裡共用 notion function 但傳入 postId）
    fetch(`/.netlify/functions/notion?postId=${id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data.page);
        setBlocks(data.blocks);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center animate-pulse text-slate-400">深度加載中...</div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center">找不到文章</div>;

  const title = post.properties?.Title?.title[0]?.plain_text || '未命名文章';

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <article className="container mx-auto px-6 max-w-3xl">
        <Link to="/insights" className="text-slate-400 hover:text-[#D4AF37] transition-colors mb-8 inline-block font-bold text-sm tracking-widest">
          ← BACK TO INSIGHTS
        </Link>
        
        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="bg-slate-50 px-3 py-1 rounded text-slate-600 font-bold italic">
              {post.properties?.Project?.select?.name}
            </span>
            <span>{post.properties?.['Publish Date']?.date?.start}</span>
          </div>
        </header>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-lg">
          {blocks.map(block => {
            const { type } = block;
            const content = block[type]?.rich_text?.[0]?.plain_text;
            if (!content) return null;

            switch (type) {
              case 'heading_1': return <h1 key={block.id} className="text-3xl font-bold mt-12 mb-6 text-slate-900">{content}</h1>;
              case 'heading_2': return <h2 key={block.id} className="text-2xl font-bold mt-10 mb-4 text-slate-900 border-l-4 border-[#D4AF37] pl-4">{content}</h2>;
              case 'heading_3': return <h3 key={block.id} className="text-xl font-bold mt-8 mb-4 text-slate-900">{content}</h3>;
              case 'paragraph': return <p key={block.id} className="mb-6">{content}</p>;
              case 'bulleted_list_item': return <li key={block.id} className="ml-4 mb-2 list-disc">{content}</li>;
              default: return null;
            }
          })}
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
