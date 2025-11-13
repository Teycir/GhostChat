interface DiagnosticResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

export async function runNetworkDiagnostics(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];

  results.push(await testWebRTCSupport());
  results.push(await testSTUNConnectivity());
  results.push(await testNetworkType());

  return results;
}

async function testWebRTCSupport(): Promise<DiagnosticResult> {
  try {
    const pc = new RTCPeerConnection();
    pc.close();
    return {
      test: 'WebRTC Support',
      status: 'pass',
      message: 'WebRTC is supported in your browser'
    };
  } catch (e) {
    return {
      test: 'WebRTC Support',
      status: 'fail',
      message: 'WebRTC is not supported in your browser'
    };
  }
}

async function testSTUNConnectivity(): Promise<DiagnosticResult> {
  return new Promise((resolve) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    let candidateFound = false;

    pc.onicecandidate = (event) => {
      if (event.candidate && event.candidate.candidate.includes('srflx')) {
        candidateFound = true;
        pc.close();
        resolve({
          test: 'STUN Connectivity',
          status: 'pass',
          message: 'Can connect to STUN servers'
        });
      }
    };

    pc.createDataChannel('test');
    pc.createOffer().then(offer => pc.setLocalDescription(offer));

    setTimeout(() => {
      pc.close();
      if (!candidateFound) {
        resolve({
          test: 'STUN Connectivity',
          status: 'warning',
          message: 'STUN connectivity limited - may have NAT issues'
        });
      }
    }, 5000);
  });
}

async function testNetworkType(): Promise<DiagnosticResult> {
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    const type = conn.effectiveType || 'unknown';
    
    if (type === '4g' || type === 'wifi') {
      return {
        test: 'Network Quality',
        status: 'pass',
        message: `Good connection: ${type}`
      };
    } else {
      return {
        test: 'Network Quality',
        status: 'warning',
        message: `Slow connection: ${type}`
      };
    }
  }

  return {
    test: 'Network Quality',
    status: 'pass',
    message: 'Network type detection not available'
  };
}
