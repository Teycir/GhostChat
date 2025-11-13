const Gun = require('gun');
const http = require('http');

const server = http.createServer();
const gun = Gun({ web: server });

const PORT = 8765;
server.listen(PORT, () => {
  console.log(`Gun relay running on http://localhost:${PORT}/gun`);
});
