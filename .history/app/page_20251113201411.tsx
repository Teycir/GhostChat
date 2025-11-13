import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <img 
        src="/assets/ghostNobg.png" 
        alt="Ghost" 
        width={180} 
        height={180} 
        style={{ marginBottom: 30, opacity: 0.9 }}
      />
      
      <h1 style={{ 
        fontSize: 64, 
        marginBottom: 16,
        fontWeight: 700,
        letterSpacing: -1
      }}>
        GhostChat
      </h1>
      
      <p style={{ 
        fontSize: 22, 
        marginBottom: 50, 
        opacity: 0.7,
        maxWidth: 500,
        textAlign: 'center',
        lineHeight: 1.5
      }}>
        Your messages vanish like ghosts. Direct P2P chat with zero traces.
      </p>
      
      <Link 
        href="/chat" 
        style={{ 
          display: 'inline-block',
          padding: '18px 48px', 
          background: '#fff', 
          color: '#000', 
          textDecoration: 'none',
          borderRadius: 12,
          fontWeight: 600,
          fontSize: 18,
          transition: 'transform 0.2s',
          boxShadow: '0 4px 20px rgba(255,255,255,0.1)'
        }}
      >
        Start Chatting
      </Link>
    </div>
  )
}
