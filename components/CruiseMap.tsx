
'use client'
import {motion,AnimatePresence} from 'framer-motion'
import {useEffect,useRef,useState} from 'react'
import {unlocked} from '../lib/unlock'

const LOCAL_MAP_URL = '/photos/mapa-mediterraneo.png'
const MAP_ASPECT_RATIO = 1536 / 1024

function buildRoute(stops: any[]) {
  if (!stops?.length) return ''
  const [first, ...rest] = stops
  return `M${first.x},${first.y} ${rest.map((s: any) => `L${s.x},${s.y}`).join(' ')}`
}

export default function CruiseMap({stops, onSelect, selectedId}: any) {
  const [pathLen, setPathLen] = useState(0)
  const pathRef = useRef<SVGPathElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mapRect, setMapRect] = useState({left: 0, top: 0, width: 0, height: 0})
  const route = buildRoute(stops)

  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength())
  }, [route])

  useEffect(() => {
    if (!containerRef.current) return

    const el = containerRef.current
    const updateMapRect = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return

      let width = w
      let height = w / MAP_ASPECT_RATIO
      let left = 0
      let top = 0

      if (height > h) {
        height = h
        width = h * MAP_ASPECT_RATIO
        left = (w - width) / 2
      } else {
        top = (h - height) / 2
      }

      setMapRect({left, top, width, height})
    }

    updateMapRect()
    const observer = new ResizeObserver(updateMapRect)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Find current day index (last unlocked stop)
  const currentIdx = stops.reduce((acc: number, s: any, i: number) =>
    unlocked(s.date) ? i : acc, -1)

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 0,
      }}
    >
      {/* Mediterranean map background */}
      <img
        src={LOCAL_MAP_URL}
        alt="Mapa del Mediterráneo"
        style={{
          position: 'absolute',
          left: mapRect.left,
          top: mapRect.top,
          width: mapRect.width,
          height: mapRect.height,
          objectFit: 'fill',
          opacity: 0.7,
          filter: 'brightness(0.9) contrast(1.2)',
        }}
      />

      {/* Dark overlay for readability */}
      <div style={{
        position: 'absolute',
        left: mapRect.left,
        top: mapRect.top,
        width: mapRect.width,
        height: mapRect.height,
        background: 'linear-gradient(160deg, rgba(4,16,40,0.5) 0%, rgba(8,17,32,0.3) 100%)',
      }} />

      {/* SVG route layer */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position:'absolute',
          left: mapRect.left,
          top: mapRect.top,
          width: mapRect.width,
          height: mapRect.height,
        }}
      >
        {/* Route background (faded) */}
        <path d={route} stroke="rgba(255,255,255,0.15)" fill="none" strokeWidth="0.5" strokeDasharray="2,2"/>

        {/* Animated drawn route */}
        {pathLen > 0 && (
          <motion.path
            ref={undefined}
            d={route}
            stroke="#f0c060"
            fill="none"
            strokeWidth="0.5"
            strokeLinecap="round"
            initial={{strokeDashoffset: pathLen, strokeDasharray: pathLen}}
            animate={{strokeDashoffset: 0, strokeDasharray: pathLen}}
            transition={{duration: 2.5, ease: 'easeInOut'}}
          />
        )}
        {/* Hidden path to measure length */}
        <path ref={pathRef} d={route} stroke="none" fill="none"/>
      </svg>

      {/* Stop markers */}
      {stops.map((s: any, i: number) => {
        const isUnlocked = unlocked(s.date)
        const isSelected = s.id === selectedId
        const isCurrent = i === currentIdx
        const isNav = s.city === 'Navegación'

        return (
          <div
            key={s.id}
            style={{
              position: 'absolute',
              left: mapRect.left + (mapRect.width * s.x) / 100,
              top: mapRect.top + (mapRect.height * s.y) / 100,
              transform: 'translate(-50%,-50%)',
              zIndex: isSelected ? 30 : 20,
            }}
          >
            {/* Pulsing ring for current/selected */}
            {(isCurrent || isSelected) && isUnlocked && (
              <motion.div
                animate={{scale:[1,1.6,1], opacity:[0.6,0,0.6]}}
                transition={{duration:2, repeat:Infinity}}
                style={{
                  position:'absolute',
                  inset:-8,
                  borderRadius:'50%',
                  border:'2px solid #f0c060',
                  pointerEvents:'none',
                }}
              />
            )}

            <motion.button
              whileHover={isUnlocked ? {scale:1.2} : {}}
              whileTap={isUnlocked ? {scale:0.95} : {}}
              onClick={() => isUnlocked && onSelect(s)}
              style={{
                width: isNav ? 28 : 44,
                height: isNav ? 28 : 44,
                borderRadius: '50%',
                border: isSelected
                  ? '2px solid #f0c060'
                  : isUnlocked
                  ? '2px solid rgba(240,192,96,0.6)'
                  : '2px solid rgba(255,255,255,0.2)',
                background: isSelected
                  ? 'rgba(240,192,96,0.3)'
                  : isUnlocked
                  ? 'rgba(8,17,32,0.75)'
                  : 'rgba(8,17,32,0.5)',
                color: isUnlocked ? '#f0c060' : 'rgba(255,255,255,0.3)',
                fontSize: isNav ? 11 : 18,
                cursor: isUnlocked ? 'pointer' : 'default',
                display:'flex', alignItems:'center', justifyContent:'center',
                backdropFilter:'blur(4px)',
                boxShadow: isUnlocked ? '0 4px 20px rgba(240,192,96,0.25)' : 'none',
                transition:'all 0.2s',
              }}
            >
              {isUnlocked ? s.emoji : '🔒'}
            </motion.button>

            {/* Label */}
            {!isNav && (
              <div style={{
                position:'absolute',
                top:'110%',
                left:'50%',
                transform:'translateX(-50%)',
                whiteSpace:'nowrap',
                fontSize:10,
                color: isUnlocked ? 'rgba(240,192,96,0.9)' : 'rgba(255,255,255,0.3)',
                fontFamily:'inherit',
                letterSpacing:'0.05em',
                textShadow:'0 1px 3px rgba(0,0,0,0.8)',
                pointerEvents:'none',
              }}>

              </div>
            )}
          </div>
        )
      })}

      {/* Top header overlay */}
      <div style={{
        position:'absolute', top:0, left:0, right:0,
        padding:'24px 32px',
        background:'linear-gradient(180deg, rgba(4,10,28,0.9) 0%, transparent 100%)',
        pointerEvents:'none',
      }}>
        <h1 style={{
          fontSize:'clamp(18px,3vw,32px)',
          fontWeight:700,
          letterSpacing:'0.05em',
          color:'white',
        }}>
          Nuestro Crucero Mediterráneo
        </h1>
        <p style={{
          fontSize:13,
          color:'rgba(240,192,96,0.8)',
          letterSpacing:'0.15em',
          textTransform:'uppercase',
          marginTop:4,
        }}>
          8 – 15 agosto 2026
        </p>
      </div>
    </div>
  )
}
