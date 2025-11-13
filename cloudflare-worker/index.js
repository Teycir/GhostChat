import { PeerServer } from 'peer';

const peerServer = PeerServer({
  port: 443,
  path: '/'
});

export default {
  async fetch(request) {
    return peerServer.handle(request);
  }
};
