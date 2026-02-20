exports.handler = async function(event, context) {
  try {
    // 自動清理 ID 格式，確保沒有空格或特殊符號
    const databaseId = process.env.NOTION_DATABASE_ID.replace(/-/g, '').trim();
    
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY.trim()}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page_size: 100
      })
    });
    
    const data = await response.json();
    
    // 如果 Notion 回傳錯誤，我們會在這裡看到原因
    if (data.object === 'error') {
      console.error("Notion API Error:", data.message);
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: data.message })
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Server Error' })
    };
  }
};
