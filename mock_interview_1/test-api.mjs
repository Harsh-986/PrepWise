// test-api.mjs
async function testInterviewGeneration() {
  try {
    console.log('Testing interview generation API...');
    
    const response = await fetch('http://localhost:3000/api/vapi/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'Technical',
        role: 'Frontend Developer',
        level: 'Junior',
        techstack: 'React, TypeScript',
        amount: 5,
        userid: 'test-user-123'
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ API test passed! Interview ID:', data.interviewId);
    } else {
      console.log('❌ API test failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Test GET endpoint
async function testGetEndpoint() {
  try {
    const response = await fetch('http://localhost:3000/api/vapi/generate');
    const data = await response.json();
    console.log('GET endpoint test:', data);
  } catch (error) {
    console.error('GET test failed:', error);
  }
}

// Run tests
console.log('Starting API tests...\n');
await testGetEndpoint();
await testInterviewGeneration();