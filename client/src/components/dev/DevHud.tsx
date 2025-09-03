import { useEffect, useState } from "react";

type DevStatus = {
  env?: string;
  authMode?: 'demo' | 'disabled' | 'enabled' | string;
  storageMode?: 'db' | 'memory' | string;
  tenant?: { id: number; name: string } | null;
  user?: { sub?: string; email?: string; name?: string } | null;
  time?: string;
  error?: string;
};

export function DevHud() {
  const [show, setShow] = useState<boolean>(() => {
    try { return localStorage.getItem('showDevHud') === '1'; } catch { return false; }
  });
  const [status, setStatus] = useState<DevStatus>({});

  useEffect(() => {
    if (!show) return;
    let mounted = true;
    let timer: any;
    const tick = async () => {
      try {
        const res = await fetch('/api/dev/status', { credentials: 'include' });
        const json = await res.json();
        if (mounted) setStatus(json);
      } catch (e) {
        if (mounted) setStatus({ error: 'unreachable' });
      }
      timer = setTimeout(tick, 2000);
    };
    tick();
    return () => { mounted = false; clearTimeout(timer); };
  }, [show]);

  useEffect(() => {
    // Allow enabling via query param ?dev=1
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('dev') === '1') {
        localStorage.setItem('showDevHud', '1');
        setShow(true);
      }
    } catch {}
  }, []);

  if (!show) return null;

  const pill = (label: string, value?: string, color = '#334155') => (
    <span style={{
      display: 'inline-block', marginRight: 6, marginBottom: 6,
      padding: '2px 8px', borderRadius: 9999,
      background: color, color: 'white', fontSize: 12,
    }}>
      <b>{label}:</b> {value || '—'}
    </span>
  );

  const modeColor = status.authMode === 'enabled' ? '#ef4444' : status.authMode === 'demo' ? '#f59e0b' : '#10b981';
  const storageColor = status.storageMode === 'db' ? '#3b82f6' : '#0ea5e9';

  return (
    <div style={{ position: 'fixed', right: 12, bottom: 12, zIndex: 1000 }}>
      <div style={{
        background: 'rgba(15,23,42,0.9)', color: 'white',
        padding: 12, borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        maxWidth: 360,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <strong style={{ fontSize: 12, opacity: 0.9 }}>Dev HUD</strong>
          <button
            onClick={() => { try { localStorage.setItem('showDevHud','0'); } catch{}; setShow(false); }}
            style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer' }}
            aria-label="Hide Dev HUD"
          >
            ✕
          </button>
        </div>
        <div>
          {pill('Env', status.env)}
          {pill('Auth', status.authMode, modeColor)}
          {pill('Storage', status.storageMode, storageColor)}
          {pill('Tenant', status.tenant?.name)}
          {pill('User', status.user?.email || status.user?.sub)}
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
          {status.error ? `Error: ${status.error}` : status.time}
        </div>
        <div style={{ marginTop: 8 }}>
          <button
            onClick={() => { try { localStorage.setItem('showDevHud','0'); } catch{}; setShow(false); }}
            style={{ fontSize: 11, padding: '4px 8px', background: '#475569', color: 'white', border: 0, borderRadius: 6, cursor: 'pointer' }}
          >
            Hide
          </button>
        </div>
      </div>
    </div>
  );
}

