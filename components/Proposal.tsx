'use client'
import {useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'

type ResponseType = 'aceptar' | 'entusiasmo' | null

export default function Proposal() {
  const [response, setResponse] = useState<ResponseType>(null)

  return (
    <div style={{marginBottom:20}}>

      <motion.div
        initial={{opacity:0, y:12}}
        animate={{opacity:1, y:0}}
        transition={{delay:0.08, duration:0.5}}
        style={{
          background:'linear-gradient(135deg, rgba(240,192,96,0.15), rgba(58,155,213,0.08))',
          border:'1px solid rgba(240,192,96,0.38)',
          borderRadius:16,
          padding:'20px 20px 18px',
          boxShadow:'0 14px 28px rgba(0,0,0,0.24)',
          backdropFilter:'blur(14px)',
        }}
      >

        <h3 style={{
          margin:'0 0 12px',
          fontSize:'clamp(20px, 4.5vw, 28px)',
          lineHeight:1.2,
          color:'white',
          fontWeight:700,
        }}>
          Regularizacion de relacion sentimental
        </h3>

        <p style={{
          fontSize:14,
          lineHeight:1.8,
          color:'rgba(255,255,255,0.82)',
          margin:'0 0 18px',
        }}>
          Tras varios anos de convivencia emocional, innumerables citas, viajes, cenas, abrazos y un numero
          indeterminado de memes compartidos...
          <br/>
          Se propone la oficializacion de la relacion.
        </p>

        <div style={{display:'flex', flexDirection:'column', gap:10}}>
          <button
            onClick={() => setResponse('aceptar')}
            style={primaryBtn}
          >
            □ Aceptar
          </button>
          <button
            onClick={() => setResponse('entusiasmo')}
            style={secondaryBtn}
          >
            □ Aceptar con entusiasmo
          </button>
        </div>

        <AnimatePresence>
          {response && (
            <motion.div
              initial={{opacity:0, y:10, scale:0.98}}
              animate={{opacity:1, y:0, scale:1}}
              exit={{opacity:0, y:8}}
              transition={{duration:0.35}}
              style={{
                marginTop:14,
                background:'rgba(34,197,94,0.18)',
                border:'1px solid rgba(34,197,94,0.45)',
                borderRadius:12,
                padding:'10px 12px',
              }}
            >
              <p style={{margin:0, fontSize:14, color:'rgba(220,255,230,0.96)', lineHeight:1.5}}>
                Enhorabuena, relacion regularizada.
                {response === 'entusiasmo' ? ' Nivel de alegria: oficialmente alto.' : ''}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

const baseBtn: React.CSSProperties = {
  borderRadius:11,
  border:'1px solid rgba(240,192,96,0.35)',
  padding:'12px 14px',
  textAlign:'left',
  fontSize:14,
  cursor:'pointer',
  transition:'all .2s ease',
  width:'100%',
}

const primaryBtn: React.CSSProperties = {
  ...baseBtn,
  background:'rgba(240,192,96,0.16)',
  color:'#ffe2a0',
}

const secondaryBtn: React.CSSProperties = {
  ...baseBtn,
  background:'rgba(255,255,255,0.08)',
  color:'rgba(255,255,255,0.92)',
}
