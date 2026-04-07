import { useNavigate } from 'react-router-dom';
import { Home, Compass, MapPinOff } from 'lucide-react';
import PageLayout from './PageLayout';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 20px', textAlign: 'center', position: 'relative'
      }}>
        {/* Decorative background blurs */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 500, height: 400, background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: '20%', left: '30%',
          width: 300, height: 300, background: 'radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 70%)',
          filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none'
        }} />

        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
          {/* Pulsing Icon */}
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            background: 'rgba(0,229,255,0.05)', border: '2px solid rgba(0,229,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 32, boxShadow: '0 0 40px rgba(0,229,255,0.1) inset, 0 0 40px rgba(0,229,255,0.1)',
            position: 'relative'
          }}>
            <MapPinOff size={42} color="#00e5ff" />
            <div style={{
              position: 'absolute', inset: -8, borderRadius: '50%',
              border: '1px dashed rgba(0,229,255,0.2)', animation: 'spin 20s linear infinite'
            }} />
          </div>

          <h1 style={{
            fontSize: 'clamp(60px, 12vw, 100px)', fontWeight: 900,
            color: '#fff', letterSpacing: '-0.03em', margin: 0,
            lineHeight: 1, textShadow: '0 0 40px rgba(0,229,255,0.2)'
          }}>
            404
          </h1>
          
          <h2 style={{ 
            fontSize: 24, fontWeight: 700, color: '#e5e7eb', 
            marginTop: 16, marginBottom: 16, letterSpacing: '-0.01em' 
          }}>
            Uncharted Coordinates
          </h2>
          
          <p style={{ 
            fontSize: 16, color: '#9ca3af', maxWidth: 440, 
            marginBottom: 48, lineHeight: 1.6 
          }}>
            The sector you are trying to reach does not exist in our navigation logs. It might have been destroyed, moved, or never existed at all.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 32px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: '#00e5ff', color: '#000', fontWeight: 700, fontSize: 15,
                boxShadow: '0 0 20px rgba(0,229,255,0.25), 0 4px 12px rgba(0,0,0,0.4)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0,229,255,0.4), 0 8px 16px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,229,255,0.25), 0 4px 12px rgba(0,0,0,0.4)';
              }}
            >
              <Home size={18} strokeWidth={2.5} />
              Return Home
            </button>
            
            <button
              onClick={() => window.history.back()}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 32px', borderRadius: 12, cursor: 'pointer',
                background: 'rgba(255,255,255,0.03)', color: '#fff', fontWeight: 600, fontSize: 15,
                border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              <Compass size={18} />
              Go Back
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </PageLayout>
  );
}
