"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

interface SignaturePadProps {
  onSignatureChange: (signatureDataUrl: string | null) => void
  width?: number
  height?: number
}

export function SignaturePad({ onSignatureChange, width = 400, height = 150 }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // Fungsi untuk memulai menggambar tanda tangan
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsDrawing(true)
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()

    // Handle mouse and touch events
    let clientX, clientY
    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const rect = canvas.getBoundingClientRect()
    ctx.moveTo(clientX - rect.left, clientY - rect.top)
  }

  // Fungsi untuk menggambar tanda tangan
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Handle mouse and touch events
    let clientX, clientY
    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
      e.preventDefault() // Prevent scrolling when drawing on touch devices
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const rect = canvas.getBoundingClientRect()
    ctx.lineTo(clientX - rect.left, clientY - rect.top)
    ctx.stroke()
  }

  // Fungsi untuk berhenti menggambar tanda tangan
  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (!canvas) return

    // Simpan tanda tangan sebagai gambar
    onSignatureChange(canvas.toDataURL())
  }

  // Fungsi untuk menghapus tanda tangan
  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    onSignatureChange(null)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="touch-none cursor-crosshair rounded border border-dashed border-gray-300 bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        ></canvas>
        <Button variant="outline" size="icon" className="absolute right-2 top-2 h-6 w-6" onClick={clearSignature}>
          <Trash2 className="h-3 w-3" />
          <span className="sr-only">Clear signature</span>
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Draw your signature in the box above</p>
    </div>
  )
}
