"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

// Tipe untuk form data
interface FormData {
  title: string;
  description: string;
  type: string;
  organization_id: string;
}

// Komponen untuk membuat kontrak baru
export function CreateContractForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    type: "",
    organization_id: "" // Ini akan diisi dari respons login/signup
  })

  // Mengambil organization_id dari localStorage saat komponen dimount
  useState(() => {
    if (typeof window !== "undefined") {
      try {
        const userData = localStorage.getItem("user")
        if (userData) {
          const user = JSON.parse(userData)
          if (user.organization?.id) {
            setFormData(prev => ({
              ...prev,
              organization_id: user.organization.id
            }))
          }
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  })

  // Handler untuk perubahan input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handler untuk perubahan select
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handler untuk submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasi form
    if (!formData.title || !formData.type || !formData.organization_id) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }
    
    try {
      setLoading(true)
      
      // Buat kontrak baru
      const contract = await api.createContract(formData)
      
      toast({
        title: "Contract Created",
        description: "Your contract has been created successfully"
      })
      
      // Redirect ke halaman detail kontrak
      router.push(`/dashboard/contracts/${contract.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create contract",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Contract</CardTitle>
        <CardDescription>
          Fill in the details to create a new contract
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Contract Title <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter contract title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter contract description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Contract Type <span className="text-destructive">*</span></Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select contract type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="service_agreement">Service Agreement</SelectItem>
                <SelectItem value="nda">Non-Disclosure Agreement (NDA)</SelectItem>
                <SelectItem value="employment">Employment Contract</SelectItem>
                <SelectItem value="vendor">Vendor Agreement</SelectItem>
                <SelectItem value="license">License Agreement</SelectItem>
                <SelectItem value="partnership">Partnership Agreement</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Contract
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
