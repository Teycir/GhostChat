"use client";

import { useState } from "react";
import { runNetworkDiagnostics } from "@/lib/network-diagnostics";

interface DiagnosticResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

export default function Diagnostics({ onClose }: { onClose: () => void }) {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [running, setRunning] = useState(false);

  const runTests = async () => {
    setRunning(true);
    const diagnostics = await runNetworkDiagnostics();
    setResults(diagnostics);
    setRunning(false);
  };

  const getStatusColor = (status: string) => {
    if (status === 'pass') return '#0f0';
    if (status === 'warning') return '#ff0';
    return '#f00';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#1a1a1a',
        padding: 24,
        borderRadius: 12,
        maxWidth: 400,
        width: '90%',
        border: '1px solid #333'
      }}>
        <h3 style={{ marginBottom: 16 }}>Network Diagnostics</h3>
        
        {results.length === 0 ? (
          <div style={{ marginBottom: 16, fontSize: 12, opacity: 0.7 }}>
            Run diagnostics to check your connection quality and identify potential issues.
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            {results.map((result, i) => (
              <div key={i} style={{
                padding: 12,
                marginBottom: 8,
                background: '#111',
                borderRadius: 6,
                borderLeft: `3px solid ${getStatusColor(result.status)}`
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
                  {result.test}
                </div>
                <div style={{ fontSize: 10, opacity: 0.7 }}>
                  {result.message}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={runTests}
            disabled={running}
            style={{
              flex: 1,
              padding: 10,
              background: running ? '#333' : '#fff',
              border: 'none',
              borderRadius: 8,
              color: running ? '#666' : '#000',
              fontSize: 12,
              cursor: running ? 'not-allowed' : 'pointer',
              fontWeight: 600
            }}
          >
            {running ? 'Running...' : results.length > 0 ? 'Run Again' : 'Run Diagnostics'}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: 10,
              background: '#333',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 12,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
