
'use client'
import Confetti from 'react-confetti'
import {motion} from 'framer-motion'

export default function Birthday() {
  return (
    <div style={{marginBottom:20}}>
      <Confetti
        recycle={false}
        numberOfPieces={280}
        colors={['#f0c060','#3a9bd5','#ffffff','#e07a3c','#5bc0de']}
        gravity={0.25}
        style={{position:'fixed', top:0, left:0, zIndex:100, pointerEvents:'none'}}
      />
      <motion.div
        initial={{opacity:0, y:12}}
        animate={{opacity:1, y:0}}
        transition={{delay:0.3, duration:0.6}}
        style={{
          background:'linear-gradient(135deg, rgba(240,192,96,0.15), rgba(58,155,213,0.1))',
          border:'1px solid rgba(240,192,96,0.4)',
          borderRadius:16,
          padding:'20px 24px',
          marginBottom:16,
        }}
      >
        <p style={{
          fontFamily:"'Playfair Display',serif",
          fontSize:22,
          fontWeight:700,
          color:'#f0c060',
          marginBottom:10,
        }}>
          🎂 Feliz cumpleaños ❤️
        </p>
        <p style={{
          fontSize:14,
          lineHeight:1.8,
          color:'rgba(255,255,255,0.85)',
        }}>
          Dios estaba inspirado hace 32 años y 9 meses.<br/>
          Yo quería regalarte una semana de recuerdos.<br/>
          <span style={{color:'rgba(240,192,96,0.8)', fontStyle:'italic'}}>
            Y este atardecer en Santorini es todo tuyo.
          </span>
        </p>
      </motion.div>
    </div>
  )
}
