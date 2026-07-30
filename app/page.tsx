
'use client'
import {useState,useEffect} from 'react'
import {motion,AnimatePresence} from 'framer-motion'
import {itinerary} from '../data/itinerary'
import CruiseMap from '../components/CruiseMap'
import Gallery from '../components/Gallery'
import Birthday from '../components/Birthday'
import {unlocked} from '../lib/unlock'


function Countdown() {
  const target = new Date('2026-08-08')
  const now = new Date()
  const days = Math.ceil((target.getTime() - now.getTime()) / 86400000)
  if (days <= 0) return null
  return (
    <div style={{
      position:'absolute', bottom:24, left:'50%', transform:'translateX(-50%)',
      textAlign:'center', pointerEvents:'none', zIndex:10,
    }}>
      <div style={{
        background:'rgba(8,17,32,0.75)',
        border:'1px solid rgba(240,192,96,0.3)',
        borderRadius:12, padding:'10px 20px',
        backdropFilter:'blur(8px)',
      }}>
        <span style={{fontSize:28, fontWeight:700, color:'#f0c060', fontFamily:'inherit'}}>{days}</span>
        <span style={{fontSize:11, color:'rgba(255,255,255,0.6)', letterSpacing:'0.1em', marginLeft:8, textTransform:'uppercase'}}>
          días para zarpar
        </span>
      </div>
    </div>
  )
}

export default function Page() {
  const [selected, setSelected] = useState<any>(null)
  const [mapZoom, setMapZoom] = useState({x:0, y:0, scale:1})

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Registration can fail in embedded contexts before first full navigation.
    })
  }, [])

  function handleSelect(stop: any) {
    if (!unlocked(stop.date)) return
    setSelected(stop)
    // Zoom toward the stop: invert percentage position to create a translate
    const tx = (50 - stop.x) * 0.6
    const ty = (50 - stop.y) * 0.6
    setMapZoom({x: tx, y: ty, scale: 1.5})
  }

  function handleClose() {
    setSelected(null)
    setMapZoom({x: 0, y: 0, scale: 1})
  }

  return (
    <div style={{position:'fixed', inset:0, overflow:'hidden', background:'#081120'}}>
      {/* Map layer — zoomable */}
      <motion.div
        animate={{
          scale: mapZoom.scale,
          x: `${mapZoom.x}%`,
          y: `${mapZoom.y}%`,
        }}
        transition={{duration:0.7, ease:[0.4, 0, 0.2, 1]}}
        style={{position:'absolute', inset:0, transformOrigin:'50% 50%'}}
      >
        <CruiseMap stops={itinerary} onSelect={handleSelect} selectedId={selected?.id}/>
      </motion.div>

      {/* Countdown — shown when nothing is selected */}
      <AnimatePresence>
        {!selected && (
          <motion.div
            key="countdown"
            initial={{opacity:0, y:10}}
            animate={{opacity:1, y:0}}
            exit={{opacity:0, y:10}}
            style={{position:'absolute', inset:0, pointerEvents:'none', zIndex:10}}
          >
            <Countdown/>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail panel — slides in from right */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="panel"
            initial={{x:'100%', opacity:0}}
            animate={{x:0, opacity:1}}
            exit={{x:'100%', opacity:0}}
            transition={{duration:0.45, ease:[0.4,0,0.2,1]}}
            style={{
              position:'absolute', top:0, right:0, bottom:0,
              width: 'min(420px, 100vw)',
              background:'rgba(6,14,30,0.95)',
              borderLeft:'1px solid rgba(240,192,96,0.2)',
              backdropFilter:'blur(20px)',
              display:'flex', flexDirection:'column',
              zIndex:40,
              overflowY:'auto',
            }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              style={{
                position:'absolute', top:16, right:16,
                width:36, height:36, borderRadius:'50%',
                background:'rgba(255,255,255,0.1)',
                border:'1px solid rgba(255,255,255,0.2)',
                color:'white', fontSize:18, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}
            >✕</button>

            {/* Panel content */}
            <div style={{padding:'40px 28px 28px'}}>
              {/* Day badge */}
              <div style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'rgba(240,192,96,0.1)',
                border:'1px solid rgba(240,192,96,0.3)',
                borderRadius:20, padding:'4px 14px', marginBottom:16,
                fontSize:12, color:'rgba(240,192,96,0.9)',
                letterSpacing:'0.1em', textTransform:'uppercase',
              }}>
                Día {selected.id} · {new Date(selected.date+'T12:00:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})}
              </div>

              {/* City name */}
              <h2 style={{
                fontFamily:'inherit',
                fontSize:'clamp(24px,5vw,36px)',
                fontWeight:700,
                lineHeight:1.1,
                marginBottom:8,
              }}>
                {selected.emoji} {selected.city}
              </h2>

              {/* Subtitle */}
              <p style={{
                fontSize:13, color:'rgba(240,192,96,0.7)',
                letterSpacing:'0.1em', textTransform:'uppercase',
                marginBottom:16,
              }}>
                {selected.title}
              </p>

              {/* Description */}
              <p style={{
                fontSize:15, lineHeight:1.7,
                color:'rgba(255,255,255,0.75)',
                marginBottom:24,
              }}>
                {selected.description}
              </p>

              {/* Birthday special */}
              {selected.city === 'Santorini' && <Birthday/>}

              {/* Gallery */}
              {selected.photos && selected.photos.length > 0 && (
                <div style={{marginTop:16}}>
                  <Gallery photos={selected.photos} folder={selected.folder} destinoId={selected.id}/>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dimmer overlay when panel is open */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="dimmer"
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            onClick={handleClose}
            style={{
              position:'absolute', inset:0,
              background:'rgba(0,0,0,0.3)',
              zIndex:30,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
