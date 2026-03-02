const http = require('http');
http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/"public_id":"[^"]+"/g);
    if(matches) console.log(matches.slice(0, 5));
    else console.log("no matches");
  });
});
