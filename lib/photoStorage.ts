const DB_NAME = 'CruceoDB'
const STORE_NAME = 'photos'
const DB_VERSION = 1

interface PhotoData {
  id: string // `${destinoId}_${slot}`
  base64: string
  timestamp: number
}

let dbInstance: IDBDatabase | null = null

export const initDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      dbInstance = request.result
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }
  })
}

export const savePhoto = async (destinoId: number, slot: number, base64: string): Promise<void> => {
  const db = dbInstance || (await initDB())
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const photoId = `${destinoId}_${slot}`

    const photoData: PhotoData = {
      id: photoId,
      base64,
      timestamp: Date.now(),
    }

    const request = store.put(photoData)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export const getPhoto = async (destinoId: number, slot: number): Promise<string | null> => {
  const db = dbInstance || (await initDB())
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const photoId = `${destinoId}_${slot}`

    const request = store.get(photoId)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const photo = request.result as PhotoData | undefined
      resolve(photo ? photo.base64 : null)
    }
  })
}

export const deletePhoto = async (destinoId: number, slot: number): Promise<void> => {
  const db = dbInstance || (await initDB())
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const photoId = `${destinoId}_${slot}`

    const request = store.delete(photoId)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export const getAllPhotos = async (): Promise<PhotoData[]> => {
  const db = dbInstance || (await initDB())
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)

    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}
