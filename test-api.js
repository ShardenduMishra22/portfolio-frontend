const fetch = require('node-fetch');

const testAPI = async () => {
  const baseURL = 'http://localhost:3000/api';
  
  console.log('Testing Blog API endpoints...\n');
  
  try {
    // Test GET /api/blogs
    console.log('1. Testing GET /api/blogs');
    const blogsResponse = await fetch(`${baseURL}/blogs`);
    const blogsData = await blogsResponse.json();
    console.log('Status:', blogsResponse.status);
    console.log('Response:', JSON.stringify(blogsData, null, 2));
    console.log('---\n');
    
    // If we have blogs, test individual blog endpoint
    if (blogsData.success && blogsData.data && blogsData.data.length > 0) {
      const firstBlogId = blogsData.data[0].id;
      console.log(`2. Testing GET /api/blogs/${firstBlogId}`);
      const blogResponse = await fetch(`${baseURL}/blogs/${firstBlogId}`);
      const blogData = await blogResponse.json();
      console.log('Status:', blogResponse.status);
      console.log('Response:', JSON.stringify(blogData, null, 2));
      console.log('---\n');
      
      // Test views endpoint
      console.log(`3. Testing POST /api/blogs/${firstBlogId}/views`);
      const viewResponse = await fetch(`${baseURL}/blogs/${firstBlogId}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: null,
          ipAddress: '127.0.0.1',
          userAgent: 'Test User Agent'
        })
      });
      const viewData = await viewResponse.json();
      console.log('Status:', viewResponse.status);
      console.log('Response:', JSON.stringify(viewData, null, 2));
      console.log('---\n');
    }
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
};

testAPI();
