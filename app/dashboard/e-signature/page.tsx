"use client"

import type React from "react"

import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Download, FileText, Info, Pen, Trash2, Upload, UserPlus } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ESignaturePage() {
  const [activeTab, setActiveTab] = useState("pending")
  const [signatureMode, setSignatureMode] = useState<"draw" | "type" | "upload">("draw")
  const [typedSignature, setTypedSignature] = useState("")
  const [signatureImage, setSignatureImage] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureAdded, setSignatureAdded] = useState(false)

  // Contoh data dokumen yang menunggu tanda tangan
  const pendingDocuments = [
    {
      id: 1,
      title: "Service Agreement - Acme Inc",
      requestedBy: "Sarah Johnson",
      date: "May 12, 2025",
      dueDate: "May 19, 2025",
      status: "awaiting_your_signature",
    },
    {
      id: 2,
      title: "NDA - XYZ Corp",
      requestedBy: "Michael Chen",
      date: "May 10, 2025",
      dueDate: "May 17, 2025",
      status: "awaiting_others",
    },
    {
      id: 3,
      title: "Employment Contract - Jane Smith",
      requestedBy: "HR Department",
      date: "May 8, 2025",
      dueDate: "May 15, 2025",
      status: "awaiting_your_signature",
    },
  ]

  // Contoh data dokumen yang telah ditandatangani
  const completedDocuments = [
    {
      id: 4,
      title: "Software License - TechCorp",
      signedBy: ["You", "David Wilson", "TechCorp Legal"],
      date: "May 5, 2025",
      completedDate: "May 7, 2025",
    },
    {
      id: 5,
      title: "Vendor Agreement - Supplier Inc",
      signedBy: ["You", "Procurement", "Supplier Inc"],
      date: "Apr 28, 2025",
      completedDate: "May 2, 2025",
    },
    {
      id: 6,
      title: "Office Lease Renewal",
      signedBy: ["You", "Finance Director", "Property Management"],
      date: "Apr 15, 2025",
      completedDate: "Apr 20, 2025",
    },
  ]

  // Contoh data dokumen yang telah dibuat
  const draftDocuments = [
    {
      id: 7,
      title: "Partnership Agreement - Draft",
      createdBy: "You",
      date: "May 11, 2025",
      status: "draft",
    },
    {
      id: 8,
      title: "Consulting Agreement - Draft",
      createdBy: "You",
      date: "May 9, 2025",
      status: "draft",
    },
  ]

  // Contoh data penandatangan untuk dokumen yang sedang dilihat
  const signers = [
    {
      name: "You",
      email: "john.doe@example.com",
      status: "pending",
      order: 1,
    },
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@acmeinc.com",
      status: "pending",
      order: 2,
    },
    {
      name: "Legal Department",
      email: "legal@yourcompany.com",
      status: "pending",
      order: 3,
    },
  ]

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
    setSignatureImage(canvas.toDataURL())
  }

  // Fungsi untuk menghapus tanda tangan
  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSignatureImage(null)
    setTypedSignature("")
  }

  // Fungsi untuk menerapkan tanda tangan
  const applySignature = () => {
    // Di sini kita akan menerapkan tanda tangan ke dokumen
    // Dalam implementasi nyata, ini akan mengirimkan tanda tangan ke server
    setSignatureAdded(true)
  }

  // Fungsi untuk mengunggah tanda tangan
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setSignatureImage(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  // Fungsi untuk menghasilkan tanda tangan dari teks
  const generateSignatureFromText = () => {
    if (!typedSignature) return

    const canvas = document.createElement("canvas")
    canvas.width = 300
    canvas.height = 100
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = "italic 32px cursive"
    ctx.fillStyle = "black"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2)

    setSignatureImage(canvas.toDataURL())
  }

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">E-Signature</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" className="gap-1">
              <Upload className="h-4 w-4" />
              Upload for Signature
            </Button>
            <Button className="gap-1">
              <Pen className="h-4 w-4" />
              Request Signatures
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending" className="relative">
                Pending
                <Badge className="ml-2 h-5 px-1.5">{pendingDocuments.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingDocuments.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{doc.title}</CardTitle>
                          <CardDescription>Requested by {doc.requestedBy}</CardDescription>
                        </div>
                        <Badge variant={doc.status === "awaiting_your_signature" ? "default" : "secondary"}>
                          {doc.status === "awaiting_your_signature" ? "Action Required" : "Awaiting Others"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-4 pt-0 flex flex-col">
                      <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Requested: {doc.date}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Due: {doc.dueDate}</div>
                      </div>
                      <div className="mt-auto flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        {doc.status === "awaiting_your_signature" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm">Sign Now</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[800px]">
                              <DialogHeader>
                                <DialogTitle>Sign Document: {doc.title}</DialogTitle>
                                <DialogDescription>
                                  Review the document and add your electronic signature
                                </DialogDescription>
                              </DialogHeader>

                              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                  <div className="rounded-md border">
                                    <div className="bg-muted px-4 py-2 font-medium">Document Preview</div>
                                    <div className="h-[400px] overflow-auto p-4">
                                      <div className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-dashed p-10 text-center">
                                        <FileText className="h-10 w-10 text-muted-foreground" />
                                        <div className="mt-4 text-xl font-bold">{doc.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                          Click to view the full document
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="rounded-md border">
                                    <div className="bg-muted px-4 py-2 font-medium">Signers</div>
                                    <div className="p-4">
                                      <div className="space-y-3">
                                        {signers.map((signer, index) => (
                                          <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <Avatar className="h-6 w-6">
                                                <AvatarFallback>{signer.name[0]}</AvatarFallback>
                                              </Avatar>
                                              <div>
                                                <div className="text-sm font-medium">{signer.name}</div>
                                                <div className="text-xs text-muted-foreground">{signer.email}</div>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <div className="text-xs text-muted-foreground">
                                                {signer.order === 1 ? "Current" : `Step ${signer.order}`}
                                              </div>
                                              {signer.status === "pending" ? (
                                                <Badge variant="outline" className="h-5 px-1.5">
                                                  Pending
                                                </Badge>
                                              ) : (
                                                <Badge variant="outline" className="bg-green-100 text-green-800">
                                                  Signed
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      <Button variant="outline" size="sm" className="mt-3 w-full gap-1">
                                        <UserPlus className="h-3.5 w-3.5" />
                                        Add Signer
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="rounded-md border">
                                    <div className="bg-muted px-4 py-2 font-medium">Your Signature</div>
                                    <div className="p-4">
                                      {signatureAdded ? (
                                        <div className="flex flex-col items-center justify-center space-y-4 rounded-md border-2 border-dashed p-6 text-center">
                                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                            <Check className="h-8 w-8 text-green-600" />
                                          </div>
                                          <div>
                                            <h3 className="text-lg font-medium">Signature Added!</h3>
                                            <p className="text-sm text-muted-foreground">
                                              Your signature has been successfully added to the document.
                                            </p>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <div className="mb-4 flex items-center justify-between">
                                            <div className="flex gap-2">
                                              <TooltipProvider>
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <Button
                                                      variant={signatureMode === "draw" ? "default" : "outline"}
                                                      size="sm"
                                                      onClick={() => setSignatureMode("draw")}
                                                    >
                                                      Draw
                                                    </Button>
                                                  </TooltipTrigger>
                                                  <TooltipContent>Draw your signature</TooltipContent>
                                                </Tooltip>
                                              </TooltipProvider>

                                              <TooltipProvider>
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <Button
                                                      variant={signatureMode === "type" ? "default" : "outline"}
                                                      size="sm"
                                                      onClick={() => setSignatureMode("type")}
                                                    >
                                                      Type
                                                    </Button>
                                                  </TooltipTrigger>
                                                  <TooltipContent>Type your signature</TooltipContent>
                                                </Tooltip>
                                              </TooltipProvider>

                                              <TooltipProvider>
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <Button
                                                      variant={signatureMode === "upload" ? "default" : "outline"}
                                                      size="sm"
                                                      onClick={() => setSignatureMode("upload")}
                                                    >
                                                      Upload
                                                    </Button>
                                                  </TooltipTrigger>
                                                  <TooltipContent>Upload your signature</TooltipContent>
                                                </Tooltip>
                                              </TooltipProvider>
                                            </div>

                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={clearSignature}
                                              disabled={!signatureImage && !typedSignature}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                              <span className="sr-only">Clear</span>
                                            </Button>
                                          </div>

                                          <div className="rounded-md border p-4">
                                            {signatureMode === "draw" && (
                                              <div className="flex flex-col items-center">
                                                <canvas
                                                  ref={canvasRef}
                                                  width={400}
                                                  height={150}
                                                  className="touch-none cursor-crosshair rounded border border-dashed border-gray-300 bg-white"
                                                  onMouseDown={startDrawing}
                                                  onMouseMove={draw}
                                                  onMouseUp={stopDrawing}
                                                  onMouseLeave={stopDrawing}
                                                  onTouchStart={startDrawing}
                                                  onTouchMove={draw}
                                                  onTouchEnd={stopDrawing}
                                                ></canvas>
                                                <p className="mt-2 text-xs text-muted-foreground">
                                                  Draw your signature in the box above
                                                </p>
                                              </div>
                                            )}

                                            {signatureMode === "type" && (
                                              <div className="space-y-4">
                                                <div className="space-y-2">
                                                  <Label htmlFor="typed-signature">Type your signature</Label>
                                                  <Input
                                                    id="typed-signature"
                                                    value={typedSignature}
                                                    onChange={(e) => setTypedSignature(e.target.value)}
                                                    placeholder="Type your full name"
                                                  />
                                                </div>
                                                <Button
                                                  onClick={generateSignatureFromText}
                                                  disabled={!typedSignature}
                                                  className="w-full"
                                                >
                                                  Generate Signature
                                                </Button>
                                                {signatureImage && (
                                                  <div className="mt-4 rounded border p-2">
                                                    <img
                                                      src={signatureImage || "/placeholder.svg"}
                                                      alt="Your signature"
                                                      className="mx-auto h-20"
                                                    />
                                                  </div>
                                                )}
                                              </div>
                                            )}

                                            {signatureMode === "upload" && (
                                              <div className="space-y-4">
                                                <div className="flex flex-col items-center justify-center">
                                                  <Label
                                                    htmlFor="signature-upload"
                                                    className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                                                  >
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                      <Upload className="mb-3 h-10 w-10 text-gray-400" />
                                                      <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span> or drag
                                                        and drop
                                                      </p>
                                                      <p className="text-xs text-gray-500">PNG, JPG or GIF</p>
                                                    </div>
                                                    <Input
                                                      id="signature-upload"
                                                      type="file"
                                                      accept="image/*"
                                                      className="hidden"
                                                      onChange={handleSignatureUpload}
                                                    />
                                                  </Label>
                                                </div>
                                                {signatureImage && (
                                                  <div className="mt-4 rounded border p-2">
                                                    <img
                                                      src={signatureImage || "/placeholder.svg"}
                                                      alt="Your signature"
                                                      className="mx-auto h-20"
                                                    />
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {!signatureAdded && (
                                    <div className="rounded-md border">
                                      <div className="bg-muted px-4 py-2 font-medium">Additional Information</div>
                                      <div className="p-4 space-y-4">
                                        <div className="flex items-start gap-2 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
                                          <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                          <div>
                                            By signing this document, you agree that your electronic signature is the
                                            legal equivalent of your manual signature.
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="signature-note">Add a note (optional)</Label>
                                          <Textarea
                                            id="signature-note"
                                            placeholder="Add any notes or comments about your signature"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <DialogFooter className="mt-6">
                                <Button variant="outline" onClick={() => {}}>
                                  Cancel
                                </Button>
                                {signatureAdded ? (
                                  <Button onClick={() => {}}>Complete Signing</Button>
                                ) : (
                                  <Button onClick={applySignature} disabled={!signatureImage} className="gap-1">
                                    <Pen className="h-4 w-4" />
                                    Sign Document
                                  </Button>
                                )}
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedDocuments.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{doc.title}</CardTitle>
                          <CardDescription>Signed by {doc.signedBy.join(", ")}</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-4 pt-0 flex flex-col">
                      <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Requested: {doc.date}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Completed: {doc.completedDate}</div>
                      </div>
                      <div className="mt-auto flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="drafts" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {draftDocuments.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{doc.title}</CardTitle>
                          <CardDescription>Created by {doc.createdBy}</CardDescription>
                        </div>
                        <Badge variant="secondary">Draft</Badge>
                      </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-4 pt-0 flex flex-col">
                      <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Created: {doc.date}</span>
                        </div>
                      </div>
                      <div className="mt-auto flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button size="sm" className="gap-1">
                          <Pen className="h-4 w-4" />
                          Request Signatures
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
