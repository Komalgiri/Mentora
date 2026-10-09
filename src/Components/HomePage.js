import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── Floating emoji orb ─────────────────────────────────────────── */
const EmojiOrb = ({ emoji, size = 80, x, y, delay = 0, duration = 6, label }) => (
  <motion.div
    aria-label={label}
    animate={{ y: [0, -18, 0], rotate: [0, 5, -5, 0] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    style={{
      position: 'absolute', left: x, top: y,
      width: size, height: size, borderRadius: '50%',
      background: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 8px 32px rgba(139,92,246,0.18)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.5, userSelect: 'none', zIndex: 2,
    }}
  >
    {emoji}
  </motion.div>
);

/* ── Pill badge ─────────────────────────────────────────────────── */
const PillBadge = ({ text, emoji, style }) => (
  <motion.div
    animate={{ y: [0, -8, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    style={{
      position: 'absolute', ...style,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.9)',
      borderRadius: 40, padding: '8px 18px',
      fontSize: 13, fontWeight: 700,
      color: '#4a3b8c',
      boxShadow: '0 4px 16px rgba(139,92,246,0.12)',
      zIndex: 3, whiteSpace: 'nowrap',
    }}
  >
    <span style={{ fontSize: 16 }}>{emoji}</span> {text}
  </motion.div>
);

/* ── Feature card ───────────────────────────────────────────────── */
const FeatureCard = ({ emoji, title, desc, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(139,92,246,0.18)' }}
    style={{
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(16px)',
      borderRadius: 24, padding: '28px 24px',
      border: '1px solid rgba(255,255,255,0.9)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      textAlign: 'center',
    }}
  >
    <div style={{
      width: 60, height: 60, borderRadius: 18,
      background: color, margin: '0 auto 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
    }}>{emoji}</div>
    <div style={{ fontWeight: 800, fontSize: 17, color: '#1a1a2e', marginBottom: 8 }}>{title}</div>
    <div style={{ fontSize: 13, color: '#7777aa', lineHeight: 1.5 }}>{desc}</div>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────────
   HomePage
───────────────────────────────────────────────────────────────── */
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", overflowX: 'hidden' }}>

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg,#e8d5f5 0%,#d0c4f0 25%,#c2d5f5 55%,#f0d5f7 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', padding: '40px 24px',
      }}>

        {/* background blobs */}
        <div style={{ position:'absolute', top:'-15%', left:'-10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(167,139,250,.35) 0%,transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-10%', right:'-5%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(196,162,255,.3) 0%,transparent 70%)', filter:'blur(50px)', pointerEvents:'none' }} />

        {/* floating emojis */}
        <EmojiOrb emoji="🥰" size={100} x="8%"  y="22%" delay={0}   duration={6}   label="Love emoji" />
        <EmojiOrb emoji="😮" size={60}  x="4%"  y="58%" delay={1.2} duration={5}   label="Surprise emoji" />
        <EmojiOrb emoji="😢" size={60}  x="82%" y="28%" delay={0.8} duration={7}   label="Sad emoji" />
        <EmojiOrb emoji="😴" size={50}  x="86%" y="62%" delay={2}   duration={5.5} label="Sleep emoji" />

        {/* floating pills */}
        <PillBadge emoji="😊" text="I Feel Loved"   style={{ bottom:'22%', left:'6%'  }} />
        <PillBadge emoji="🌟" text="5-day Streak!"  style={{ top:'14%',   right:'5%'  }} />
        <PillBadge emoji="💤" text="Sleep Tracked"  style={{ top:'8%',    left:'30%'  }} />

        {/* center hero card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(24px)',
            borderRadius: 40,
            border: '1.5px solid rgba(255,255,255,0.85)',
            boxShadow: '0 24px 80px rgba(139,92,246,0.18)',
            padding: '52px 44px 44px',
            textAlign: 'center',
            maxWidth: 420, width: '100%',
            position: 'relative', zIndex: 4,
          }}
        >
          {/* logo badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(139,92,246,0.12)', borderRadius: 40,
            padding: '6px 18px', marginBottom: 28,
          }}>
            <span style={{ fontSize: 22 }}>🧠</span>
            <span style={{ fontWeight: 900, fontSize: 18, color: '#7C3AED' }}>Mentora</span>
          </div>

          <h1 style={{
            fontWeight: 900, fontSize: 'clamp(2rem,5vw,2.6rem)',
            lineHeight: 1.15, color: '#1a1a2e', marginBottom: 14,
          }}>
            Know Your<br />
            <span style={{ color: '#8B5CF6' }}>Mind.</span>
          </h1>

          <p style={{ color: '#7777aa', fontSize: 15, lineHeight: 1.6, marginBottom: 36 }}>
            Talk, reflect, and heal with your<br />personal AI companion.
          </p>

          {/* big mood orb */}
          <motion.div
            animate={{ scale: [1, 1.06, 1], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 110, height: 110, borderRadius: '50%',
              background: 'linear-gradient(145deg,#f6d365,#fda085)',
              margin: '0 auto 32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 60, boxShadow: '0 12px 40px rgba(253,160,133,0.35)',
            }}
          >🥰</motion.div>

          {/* dots */}
          <div style={{ display:'flex', justifyContent:'center', gap:6, marginBottom:32 }}>
            {[1,0,0].map((a,i) => (
              <div key={i} style={{
                width: a ? 24 : 8, height: 8, borderRadius: 4,
                background: a ? '#8B5CF6' : 'rgba(139,92,246,0.25)',
              }} />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/chat')}
            style={{
              width: '100%', padding: '16px 0',
              background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)',
              color: '#fff', border: 'none', borderRadius: 50,
              fontFamily: 'inherit', fontSize: 17, fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(139,92,246,0.4)',
            }}
          >
            Get Started →
          </motion.button>

          <div
            onClick={() => navigate('/login')}
            style={{
              marginTop: 16, fontSize: 14, color: '#9999cc',
              cursor: 'pointer', fontWeight: 700,
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}
          >
            Member Login
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section style={{
        background: 'linear-gradient(180deg,#f0d5f7 0%,#e8d5f5 100%)',
        padding: '80px 24px',
      }}>
        <motion.div
          initial={{ opacity:0, y:20 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          style={{ textAlign:'center', marginBottom:48 }}
        >
          <div style={{ color:'#8B5CF6', fontWeight:800, letterSpacing:3, textTransform:'uppercase', fontSize:12, marginBottom:10 }}>Everything You Need</div>
          <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', fontWeight:900, color:'#1a1a2e' }}>
            Your Wellness, <span style={{ color:'#8B5CF6' }}>All in One Place</span>
          </h2>
        </motion.div>

        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',
          gap:20, maxWidth:900, margin:'0 auto',
        }}>
          <FeatureCard emoji="🌱" title="Mood Tracking"  desc="Log and review your emotional journey every day."     color="rgba(167,243,208,.6)"  delay={0}   />
          <FeatureCard emoji="🌙" title="Sleep Tool"     desc="Track sleep quality and discover patterns."           color="rgba(196,181,253,.5)"  delay={0.1} />
          <FeatureCard emoji="✍️" title="Creative Space" desc="Express yourself through art, writing & prompts."    color="rgba(253,186,116,.5)"  delay={0.2} />
          <FeatureCard emoji="💬" title="AI Companion"   desc="Chat any time for empathetic, guided support."       color="rgba(147,197,253,.5)"  delay={0.3} />
          <FeatureCard emoji="🏆" title="Gamification"   desc="Earn points & level up as you build healthy habits." color="rgba(252,165,165,.45)" delay={0.4} />
          <FeatureCard emoji="🪷" title="Grounding"      desc="5-4-3-2-1 and guided exercises for calm."            color="rgba(167,243,208,.5)"  delay={0.5} />
        </div>
      </section>

      {/* CTA FOOTER */}
      <footer style={{
        background:'linear-gradient(135deg,#8B5CF6,#6D28D9)',
        padding:'80px 24px', textAlign:'center',
      }}>
        <motion.h2
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          style={{ fontSize:'clamp(1.8rem,4vw,2.4rem)', fontWeight:900, color:'#fff', marginBottom:14 }}
        >
          Begin Your Journey Today 🌿
        </motion.h2>
        <p style={{ color:'rgba(255,255,255,.75)', marginBottom:32, fontSize:15 }}>
          No account needed — just click to start.
        </p>
        <motion.button
          whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
          onClick={() => navigate('/chat')}
          style={{
            padding:'16px 48px', borderRadius:50,
            background:'#fff', color:'#7C3AED',
            border:'none', fontSize:16, fontWeight:800,
            cursor:'pointer', fontFamily:'inherit',
            boxShadow:'0 8px 24px rgba(0,0,0,.2)',
          }}
        >
          Enter Sanctuary →
        </motion.button>
        <div style={{ marginTop:48, color:'rgba(255,255,255,.35)', fontSize:12, letterSpacing:3, fontWeight:700 }}>
          © 2026 MENTORA AI · BUILT FOR PEACE
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
