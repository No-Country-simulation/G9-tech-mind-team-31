const http = require('http');

console.log('Starting test...');

const data = JSON.stringify({
  titulo: 'Test React Content',
  texto: 'Learning React with hooks and components'
});

console.log('Request data: ' + data);

const options = {
  hostname: '127.0.0.1',
  port: 8080,
  path: '/contenido',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Connecting to Spring...');

const req = http.request(options, (res) => {
  console.log('Connected! Status: ' + res.statusCode);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    console.log('Received chunk...');
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log(`\nStatus: ${res.statusCode}`);
    console.log('Response:');
    try {
      const parsed = JSON.parse(responseData);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log(responseData);
    }
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('Request timeout');
  process.exit(1);
});

req.write(data);
req.end();

setTimeout(() => {
  console.error('Script timeout');
  process.exit(1);
}, 5000);
