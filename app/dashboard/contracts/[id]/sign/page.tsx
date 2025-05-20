"use client";

export const runtime = 'edge';

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, FileText, Info, Pen, Upload, UserPlus } from "lucide-react"

import { SignaturePad } from "@/components/signature-pad"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function SignContractPage({ params }: { params: { id: string } }) {
  const [signatureMode, setSignatureMode] = useState<"draw" | "type" | "upload">("draw")
  const [typedSignature, setTypedSignature] = useState("")
  const [signatureImage, setSignatureImage] = useState<string | null>(null)
  const [signatureAdded, setSignatureAdded] = useState(false)

  // Contoh data kontrak
  const contract = {
    id: params.id,
    title: "Service Agreement - Acme Inc",
    requestedBy: "Sarah Johnson",
    date: "May 12, 2025",
    dueDate: "May 19, 2025",
    description:
      "This Service Agreement outlines the terms and conditions for providing software development and maintenance services to Acme Inc for their customer relationship management system.",
  }

  // Contoh data penandatangan
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

  // Fungsi untuk menangani perubahan tanda tangan dari SignaturePad
  const handleSignatureChange = (dataUrl: string | null) => {
    setSignatureImage(dataUrl)
  }

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href={`/dashboard/contracts/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">Sign Document: {contract.title}</h1>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Document Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] overflow-auto rounded-md border p-4">
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-dashed p-10 text-center">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                      <div className="mt-4 text-xl font-bold">{contract.title}</div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        This Service Agreement outlines the terms and conditions for providing software development and
                        maintenance services to Acme Inc for their customer relationship management system.
                      </div>
                      <Button className="mt-6">View Full Document</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Signers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {signers.map((signer, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{signer.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{signer.name}</div>
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
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Signature</CardTitle>
                </CardHeader>
                <CardContent>
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
                      <Button className="mt-4">Complete Signing</Button>
                    </div>
                  ) : (
                    <>
                      <Tabs defaultValue="draw" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="draw" onClick={() => setSignatureMode("draw")}>
                            Draw
                          </TabsTrigger>
                          <TabsTrigger value="type" onClick={() => setSignatureMode("type")}>
                            Type
                          </TabsTrigger>
                          <TabsTrigger value="upload" onClick={() => setSignatureMode("upload")}>
                            Upload
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="draw" className="mt-4">
                          <SignaturePad onSignatureChange={handleSignatureChange} />
                        </TabsContent>
                        <TabsContent value="type" className="mt-4 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="typed-signature">Type your signature</Label>
                            <Input
                              id="typed-signature"
                              value={typedSignature}
                              onChange={(e) => setTypedSignature(e.target.value)}
                              placeholder="Type your full name"
                            />
                          </div>
                          <Button onClick={generateSignatureFromText} disabled={!typedSignature} className="w-full">
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
                        </TabsContent>
                        <TabsContent value="upload" className="mt-4 space-y-4">
                          <div className="flex flex-col items-center justify-center">
                            <Label
                              htmlFor="signature-upload"
                              className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="mb-3 h-10 w-10 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
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
                        </TabsContent>
                      </Tabs>

                      <div className="mt-6 flex items-start gap-2 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
                        <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <div>
                          By signing this document, you agree that your electronic signature is the legal equivalent of
                          your manual signature.
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {!signatureAdded && (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signature-note">Add a note (optional)</Label>
                      <Textarea id="signature-note" placeholder="Add any notes or comments about your signature" />
                    </div>

                    <Separator />

                    <div className="pt-2">
                      <Button onClick={applySignature} disabled={!signatureImage} className="w-full gap-1">
                        <Pen className="h-4 w-4" />
                        Sign Document
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
