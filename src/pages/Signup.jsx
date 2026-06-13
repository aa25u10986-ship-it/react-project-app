import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'

export default function Signup() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { signup } = useAuthStore()
  const navigate   = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 600))
    const result = signup(name, email, password)
    setLoading(false)
    if (result.success) navigate('/')
    else setError(result.error)
  }

  return (
    <div style={{ minHeight:'calc(100vh - 64px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px', position:'relative' }}>
      <div style={{ position:'fixed', top:'30%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,200,66,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />

      <motion.div initial={{ opacity:0, y:32, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
        style={{ width:'100%', maxWidth:440 }}
      >
        <div style={{ background:'rgba(8,2,35,0.92)', backdropFilter:'blur(20px)', border:'1px solid rgba(245,200,66,0.18)', borderRadius:24, padding:'clamp(24px,5vw,40px)', boxShadow:'0 24px 64px rgba(0,0,0,0.6)' }}>

          <div style={{ textAlign:'center', marginBottom:32 }}>
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.2, type:'spring', bounce:0.5 }}
              style={{ fontSize:48, marginBottom:12 }}>✨</motion.div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:'#fff', marginBottom:6 }}>Create account</h1>
            <p style={{ fontSize:14, color:'rgba(200,180,255,0.6)' }}>Join thousands of happy shoppers</p>
          </div>

          <form onSubmit={handleSubmit}>
            {[
              { label:'Full Name', type:'text', value:name, setter:setName, placeholder:'John Doe' },
              { label:'Email', type:'email', value:email, setter:setEmail, placeholder:'you@example.com' },
              { label:'Password', type:'password', value:password, setter:setPassword, placeholder:'Min 6 characters' },
            ].map(f => (
              <div key={f.label} className="form-group">
                <label>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={f.value}
                  onChange={e => f.setter(e.target.value)} required
                  style={{ background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(245,200,66,0.18)', borderRadius:10, padding:'12px 16px', fontSize:14, color:'#fff', outline:'none', width:'100%', transition:'all 0.2s' }}
                />
              </div>
            ))}

            {error && (
              <motion.p initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                style={{ fontSize:13, color:'rgba(239,68,68,0.9)', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'10px 14px', marginBottom:16 }}
              >⚠ {error}</motion.p>
            )}

            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
              type="submit" disabled={loading}
              style={{
                width:'100%', padding:'14px', borderRadius:12, border:'none',
                background: loading ? 'rgba(245,200,66,0.4)' : 'linear-gradient(135deg,var(--gold),var(--gold-d))',
                color:'#0a0020', fontSize:15, fontWeight:700, cursor: loading ? 'not-allowed':'pointer',
                boxShadow:'0 6px 24px rgba(245,200,66,0.3)', marginBottom:20, transition:'all 0.2s',
              }}
            >
              {loading ? '⏳ Creating...' : 'Create Account →'}
            </motion.button>
          </form>

          <p style={{ textAlign:'center', fontSize:14, color:'rgba(200,180,255,0.6)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'var(--gold)', fontWeight:600 }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
