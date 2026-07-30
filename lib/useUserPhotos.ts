'use client'

import { useState, useEffect, useCallback } from 'react'
import { savePhoto, getPhoto, deletePhoto, initDB } from './photoStorage'

interface UserPhoto {
  [key: number]: string | null // slot -> base64 | null
}

export const useUserPhotos = (destinoId: number) => {
  const [photos, setPhotos] = useState<UserPhoto>({})
  const [loading, setLoading] = useState(true)

  // Inicializar DB y cargar fotos
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        await initDB()
        // Cargar fotos slots 0 y 1 (para destinos) o solo 0 (para navegación)
        const photo0 = await getPhoto(destinoId, 0)
        const photo1 = await getPhoto(destinoId, 1)

        setPhotos({
          0: photo0,
          1: photo1,
        })
      } catch (error) {
        console.error('Error loading photos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPhotos()
  }, [destinoId])

  const uploadPhoto = useCallback(
    async (slot: number, file: File): Promise<void> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = async () => {
          try {
            const base64 = reader.result as string
            await savePhoto(destinoId, slot, base64)
            setPhotos((prev) => ({
              ...prev,
              [slot]: base64,
            }))
            resolve()
          } catch (error) {
            reject(error)
          }
        }

        reader.onerror = () => reject(new Error('Error reading file'))
        reader.readAsDataURL(file)
      })
    },
    [destinoId]
  )

  const removePhoto = useCallback(
    async (slot: number): Promise<void> => {
      try {
        await deletePhoto(destinoId, slot)
        setPhotos((prev) => ({
          ...prev,
          [slot]: null,
        }))
      } catch (error) {
        console.error('Error deleting photo:', error)
        throw error
      }
    },
    [destinoId]
  )

  return {
    photos,
    loading,
    uploadPhoto,
    removePhoto,
  }
}
