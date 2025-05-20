"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Download, 
  Edit, 
  ExternalLink, 
  FileText, 
  Loader2, 
  MoreHorizontal, 
  Share, 
  Trash2 
} from "lucide-react"

import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
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
  latest_version: {
    id: string;
    version: number;
    content: string;
    created_at: number;
  } | null;
  workflow: {
    id: string;
    status: string;
  } | null;
  workflow_steps: Array<{
    id: string;
    step_number: number;
    type: string;
    status: string;
    assignee_name: string;
  }>;
  comments: Array<{
    id: string;
    user_name: string;
    content: string;
    created_at: number;
  }>;
  documents: Array<{
    id: string;
    filename: string;
    content_type: string;
    size: number;
    uploaded_by_name: string;
    created_at: number;
  }>;
}

// Props untuk komponen
interface ContractDetailProps {
  contractId: string;
}

// Komponen untuk menampilkan detail kontrak
export function ContractDetail({ contractId }: ContractDetailProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Memuat detail kontrak
  useEffect(() => {
    const loadContract = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await api.getContract(contractId)
        setContract(data)
      } catch (err: any) {
        setError(err.message || "Failed to load contract")
        console.error("Error loading contract:", err)
      } finally {
        setLoading(false)
      }
    }
    
    loadContract()
  }, [contractId])

  // Handler untuk menghapus kontrak
  const handleDeleteContract = async () => {
    try {
      setDeleting(true)
      
      await api.deleteContract(contractId)
      
      toast({
        title: "Contract Deleted",
        description: "The contract has been deleted successfully"
      })
      
      // Redirect ke halaman daftar kontrak
      router.push("/dashboard/contracts")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete contract",
        variant: "destructive"
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
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

  // Format ukuran file
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        
        <Skeleton className="h-32 w-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-destructive mb-4">
            <FileText className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium">Error Loading Contract</h3>
          <p className="text-muted-foreground mt-1">{error}</p>
          <Button 
            className="mt-4" 
            variant="outline"
            onClick={() => router.push("/dashboard/contracts")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contracts
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!contract) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <div onClick={() => router.push("/dashboard/contracts")}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </div>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{contract.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              {renderStatusBadge(contract.status)}
              <span className="text-sm text-muted-foreground">{contract.type.replace("_", " ")}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1" asChild>
            <div onClick={() => router.push(`/dashboard/contracts/${contractId}/export`)}>
              <Download className="h-4 w-4" />
              Export
            </div>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-1" asChild>
            <div onClick={() => router.push(`/dashboard/contracts/${contractId}/edit`)}>
              <Edit className="h-4 w-4" />
              Edit
            </div>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <div onClick={() => router.push(`/dashboard/contracts/${contractId}/crm`)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  CRM Data
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Contract
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Contract Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">
                {contract.description || "No description provided"}
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Owner</h4>
                  <p className="text-sm text-muted-foreground">{contract.owner_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Organization</h4>
                  <p className="text-sm text-muted-foreground">{contract.organization_name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Created</h4>
                  <p className="text-sm text-muted-foreground">{formatDate(contract.created_at)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Last Updated</h4>
                  <p className="text-sm text-muted-foreground">{formatDate(contract.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="documents">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Documents</CardTitle>
                <Button size="sm">Upload Document</Button>
              </div>
            </CardHeader>
            <CardContent>
              {contract.documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Documents</h3>
                  <p className="text-muted-foreground mt-1">
                    Upload documents to this contract
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {contract.documents.map((doc) => (
                    <div 
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.filename}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(doc.size)} • Uploaded by {doc.uploaded_by_name} on {formatDate(doc.created_at)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workflow" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              {!contract.workflow ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">No Workflow</h3>
                  <p className="text-muted-foreground mt-1">
                    This contract doesn't have a workflow yet
                  </p>
                  <Button className="mt-4">Create Workflow</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Workflow Status</h3>
                      <p className="text-sm text-muted-foreground">
                        {contract.workflow.status.replace("_", " ")}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit Workflow
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {contract.workflow_steps.map((step) => (
                      <div 
                        key={step.id}
                        className="flex items-center justify-between p-3 border rounded-md"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{step.step_number}</Badge>
                            <p className="font-medium">{step.type.replace("_", " ")}</p>
                          </div>
                          {step.assignee_name && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Assigned to: {step.assignee_name}
                            </p>
                          )}
                        </div>
                        <Badge>{step.status.replace("_", " ")}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>
              {contract.comments.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">No Comments</h3>
                  <p className="text-muted-foreground mt-1">
                    Be the first to comment on this contract
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contract.comments.map((comment) => (
                    <div key={comment.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between">
                        <p className="font-medium">{comment.user_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </p>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <textarea
                  className="w-full p-2 border rounded-md"
                  placeholder="Add a comment..."
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <Button>Add Comment</Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog konfirmasi hapus */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contract</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contract? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteContract}
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
