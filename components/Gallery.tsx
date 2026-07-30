
'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserPhotos } from '../lib/useUserPhotos'

interface PlaceholderPhoto {
  type: 'placeholder'
  slot: number
  label: string
}

export default function Gallery({
  folder,
  photos,
  destinoId,
}: {
  folder?: string
  photos?: (string | PlaceholderPhoto)[]
  destinoId?: number
}) {
  const { photos: userPhotos, uploadPhoto, removePhoto } = destinoId
    ? useUserPhotos(destinoId)
    : { photos: {}, uploadPhoto: null, removePhoto: null }

  const [n, setN] = useState(0)
  const [hidden, setHidden] = useState<number[]>([])
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null)
  const [showToast, setShowToast] = useState<number | null>(null)
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  const imgs = photos && photos.length > 0 ? photos : []

  if (imgs.length === 0) return null

  const visible = imgs.filter((_, idx) => !hidden.includes(idx))
  if (visible.length === 0) return null

  const safeN = n % visible.length
  const currentItem = visible[safeN]

  const isPlaceholder = (item: string | PlaceholderPhoto): item is PlaceholderPhoto => {
    return typeof item === 'object' && item.type === 'placeholder'
  }

  const getDisplaySrc = (item: string | PlaceholderPhoto): string => {
    if (isPlaceholder(item)) {
      const userPhoto = userPhotos?.[item.slot]
      return userPhoto || '/placeholder-photo.svg' // fallback placeholder image
    }
    return item as string
  }

  const handleFileSelect = async (slot: number, file: File) => {
    if (!uploadPhoto) return

    try {
      setUploadingSlot(slot)
      await uploadPhoto(slot, file)
      setShowToast(slot)
      setTimeout(() => setShowToast(null), 2000)
    } catch (error) {
      console.error('Error uploading photo:', error)
    } finally {
      setUploadingSlot(null)
      // Reset file input
      if (fileInputRefs.current[slot]) {
        fileInputRefs.current[slot]!.value = ''
      }
    }
  }

  const handleRemovePhoto = async (slot: number) => {
    if (!removePhoto) return
    try {
      await removePhoto(slot)
    } catch (error) {
      console.error('Error removing photo:', error)
    }
  }

  const currentDisplaySrc = getDisplaySrc(currentItem)
  const hasUserPhoto = isPlaceholder(currentItem) && userPhotos?.[currentItem.slot]

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative', width: '100%', height: 260, borderRadius: 16, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={currentDisplaySrc}
            src={currentDisplaySrc}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35 }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={() => {
              const brokenIndex = visible.indexOf(currentItem)
              if (brokenIndex < 0) return
              setHidden((prev) => (prev.includes(brokenIndex) ? prev : [...prev, brokenIndex]))
              setN(0)
            }}
          />
        </AnimatePresence>

        {/* Overlay for placeholder interaction */}
        {isPlaceholder(currentItem) && !hasUserPhoto && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: uploadingSlot === currentItem.slot ? 'wait' : 'pointer',
            }}
            onClick={() => {
              if (fileInputRefs.current[currentItem.slot]) {
                fileInputRefs.current[currentItem.slot]!.click()
              }
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>📸</div>
            <div style={{ color: 'white', textAlign: 'center', fontSize: 14, fontWeight: 500, maxWidth: 200 }}>
              {currentItem.label}
            </div>
            {uploadingSlot === currentItem.slot && <div style={{ marginTop: 12, color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Subiendo...</div>}
          </div>
        )}

        {/* Remove button for uploaded photos */}
        {isPlaceholder(currentItem) && hasUserPhoto && (
          <button
            onClick={() => handleRemovePhoto(currentItem.slot)}
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              borderRadius: 8,
              padding: '4px 12px',
              fontSize: 12,
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
            }}
          >
            Cambiar
          </button>
        )}

        {/* Toast notification */}
        <AnimatePresence>
          {isPlaceholder(currentItem) && showToast === currentItem.slot && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: 'absolute',
                top: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(34,197,94,0.9)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                backdropFilter: 'blur(4px)',
              }}
            >
              ✓ Foto subida
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden file inputs */}
      {isPlaceholder(currentItem) && (
        <input
          ref={(el) => {
            if (el) fileInputRefs.current[currentItem.slot] = el
          }}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.currentTarget.files?.[0]
            if (file) {
              handleFileSelect(currentItem.slot, file)
            }
          }}
        />
      )}

      {/* Navigation controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        <button
          onClick={() => setN((safeN - 1 + visible.length) % visible.length)}
          style={btnStyle}
        >
          ‹
        </button>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
          {safeN + 1} / {visible.length}
        </span>
        <button
          onClick={() => setN((safeN + 1) % visible.length)}
          style={btnStyle}
        >
          ›
        </button>
      </div>
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.2)',
  color: 'white',
  borderRadius: 8,
  padding: '6px 16px',
  fontSize: 20,
  cursor: 'pointer',
}
