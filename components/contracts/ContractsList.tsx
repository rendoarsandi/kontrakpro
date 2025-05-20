"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  FileText, 
  Search, 
  Plus, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Loader2
} from "lucide-react"

import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Tipe untuk kontrak
interface Contract {
  id: string;
  title: string;
  description: string;
  status: string;
  type: string;
  created_at: number;
  updated_at: number;
  owner_name: string;
  organization_name: string;
}

// Tipe untuk pagination
interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// Komponen untuk menampilkan daftar kontrak
export function ContractsList() {
  const router = useRouter()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("")

  // Fungsi untuk memuat kontrak
  const loadContracts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params: Record<string, any> = {
        limit: pagination.limit,
        offset: pagination.offset
      }

      if (searchQuery) {
        params.search = searchQuery
      }

      if (statusFilter) {
        params.status = statusFilter
      }

      if (typeFilter) {
        params.type = typeFilter
      }

      const data = await api.getContracts(params)
      setContracts(data.contracts)
      setPagination(data.pagination)
    } catch (err: any) {
      setError(err.message || "Failed to load contracts")
      console.error("Error loading contracts:", err)
    } finally {
      setLoading(false)
    }
  }

  // Memuat kontrak saat komponen dimount atau filter berubah
  useEffect(() => {
    loadContracts()
  }, [pagination.offset, statusFilter, typeFilter])

  // Handler untuk pencarian
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Reset offset saat melakukan pencarian baru
    setPagination(prev => ({ ...prev, offset: 0 }))
    loadContracts()
  }

  // Handler untuk halaman berikutnya
  const handleNextPage = () => {
    if (pagination.hasMore) {
      setPagination(prev => ({
        ...prev,
        offset: prev.offset + prev.limit
      }))
    }
  }

  // Handler untuk halaman sebelumnya
  const handlePrevPage = () => {
    if (pagination.offset > 0) {
      setPagination(prev => ({
        ...prev,
        offset: Math.max(0, prev.offset - prev.limit)
      }))
    }
  }

  // Handler untuk melihat detail kontrak
  const handleViewContract = (id: string) => {
    router.push(`/dashboard/contracts/${id}`)
  }

  // Render status badge
  const renderStatusBadge = (status: string) => {
    let variant = "default"
    
    switch (status) {
      case "draft":
        variant = "outline"
        break
      case "pending_approval":
        variant = "secondary"
        break
      case "approved":
        variant = "default"
        break
      case "active":
        variant = "success"
        break
      case "expired":
        variant = "destructive"
        break
      default:
        variant = "outline"
    }
    
    return (
      <Badge variant={variant as any}>
        {status.replace("_", " ")}
      </Badge>
    )
  }

  // Format tanggal
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contracts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending_approval">Pending Approval</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="service_agreement">Service Agreement</SelectItem>
              <SelectItem value="nda">NDA</SelectItem>
              <SelectItem value="employment">Employment</SelectItem>
              <SelectItem value="vendor">Vendor</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Contract
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          {error}
        </div>
      )}
      
      <div className="grid gap-4">
        {loading ? (
          // Skeleton loader
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                    <Skeleton className="h-4 w-24 ml-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : contracts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No contracts found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery || statusFilter || typeFilter
                  ? "Try adjusting your filters"
                  : "Create your first contract to get started"}
              </p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                New Contract
              </Button>
            </CardContent>
          </Card>
        ) : (
          contracts.map((contract) => (
            <Card 
              key={contract.id} 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleViewContract(contract.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{contract.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {contract.description?.substring(0, 100)}
                      {contract.description?.length > 100 ? "..." : ""}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {renderStatusBadge(contract.status)}
                      <span className="text-xs text-muted-foreground">
                        {contract.type.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{contract.owner_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Created: {formatDate(contract.created_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Pagination */}
      {!loading && contracts.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {pagination.offset + 1}-
            {Math.min(pagination.offset + contracts.length, pagination.total)} of{" "}
            {pagination.total} contracts
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={pagination.offset === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!pagination.hasMore}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
