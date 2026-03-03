exports.handler = async function(event, context) {
  const { postId } = event.queryStringParameters;
  const NOTION_KEY = process.env.NOTION_API_KEY;
  const DB_ID = process.env.NOTION_DATABASE_ID.replace(/-/g, '').trim();

  try {
    // 如果有 postId，則獲取單篇內文
    if (postId) {
      const pageRes = await fetch(`https://api.notion.com/v1/pages/${postId}`, {
        headers: { 'Authorization': `Bearer ${NOTION_KEY}`, 'Notion-Version': '2022-06-28' }
      });
      const blockRes = await fetch(`https://api.notion.com/v1/blocks/${postId}/children`, {
        headers: { 'Authorization': `Bearer ${NOTION_KEY}`, 'Notion-Version': '2022-06-28' }
      });
      
      const page = await pageRes.json();
      const blocks = await blockRes.json();
      
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ page, blocks: blocks.results })
      };
    }

    // 否則獲取文章列表
    const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_size: 100 })
    });
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
