'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Excalidraw, serializeAsJSON, restoreElements, restoreAppState } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'
import type { ExcalidrawImperativeAPI, ExcalidrawElement, AppState, BinaryFiles } from '@/types/excalidraw'

interface BoardEditorProps {
  boardId: string
  initialState: string | null
  readOnly?: boolean
  onSaveStatus?: (status: 'saved' | 'saving' | 'unsaved' | 'error') => void
  onManualSave?: () => void
  theme?: 'light' | 'dark'
}

export default function BoardEditor({
  boardId,
  initialState,
  readOnly = false,
  onSaveStatus,
  onManualSave,
  theme = 'light',
}: BoardEditorProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null)
  const [initialData, setInitialData] = useState<{
    elements: readonly ExcalidrawElement[]
    appState: Partial<AppState>
    files: BinaryFiles
  } | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasChangesRef = useRef(false)

  useEffect(() => {
    if (initialState) {
      try {
        const parsed = JSON.parse(initialState)
        const elements = restoreElements(parsed.elements || [], null, {
          repairBindings: true,
        })
        const appState = restoreAppState(parsed.appState || {}, null)
        setInitialData({
          elements,
          appState,
          files: parsed.files || {},
        })
      } catch (error) {
        console.error('Failed to load board state:', error)
        setInitialData({ elements: [], appState: {}, files: {} })
      }
    } else {
      setInitialData({ elements: [], appState: {}, files: {} })
    }
  }, [initialState])

  const saveToDatabase = useCallback(async () => {
    if (!excalidrawAPI || !hasChangesRef.current) return

    onSaveStatus?.('saving')

    try {
      const elements = excalidrawAPI.getSceneElements()
      const appState = excalidrawAPI.getAppState()
      const files = excalidrawAPI.getFiles()

      const data = serializeAsJSON(elements, appState, files, 'database')

      const res = await fetch(`/api/boards/${boardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stateJson: data }),
      })

      if (!res.ok) {
        throw new Error('Failed to save')
      }

      hasChangesRef.current = false
      onSaveStatus?.('saved')
    } catch (error) {
      console.error('Save error:', error)
      onSaveStatus?.('error')
    }
  }, [excalidrawAPI, boardId, onSaveStatus])

  const handleChange = useCallback(
    (_elements: readonly ExcalidrawElement[], _appState: AppState, _files: BinaryFiles) => {
      hasChangesRef.current = true
      onSaveStatus?.('unsaved')

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveToDatabase()
      }, 3000)
    },
    [saveToDatabase, onSaveStatus]
  )

  const handleManualSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    saveToDatabase()
  }, [saveToDatabase])

  useEffect(() => {
    if (onManualSave) {
      onManualSave()
    }
  }, [onManualSave, handleManualSave])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleManualSave()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleManualSave])

  if (!initialData) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-muted-foreground">Loading editor...</div>
      </div>
    )
  }

  return (
    <div className="excalidraw-wrapper">
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onChange={handleChange}
        initialData={initialData}
        theme={theme}
        viewModeEnabled={readOnly}
        autoFocus
        name="Whiteboard"
        UIOptions={{
          canvasActions: {
            changeViewBackgroundColor: true,
            clearCanvas: true,
            export: { saveFileToDisk: true },
            loadScene: false,
            saveToActiveFile: false,
            toggleTheme: false,
            saveAsImage: true,
          },
        }}
      />
    </div>
  )
}
