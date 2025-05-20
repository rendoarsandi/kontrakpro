"use client";

export const runtime = 'edge';

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Check,
  Download,
  Edit,
  ExternalLink,
  FileText,
  History,
  MoreHorizontal,
  Share,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PDFExportModal } from "@/components/pdf/pdf-export-modal"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function ContractDetailsPage({ params }: { params: { id: string } }) {
  const [commentText, setCommentText] = useState("")
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false)

  // Mock contract data - in a real app, this would be fetched from an API
  const contract = {
    id: params.id,
    name: "Service Agreement - Acme Inc",
    status: "Pending Approval",
    type: "Service Agreement",
    created: "May 10, 2025",
    expiry: "May 10, 2026",
    owner: "Sarah Johnson",
    counterparty: "Acme Inc",
    value: "$75,000",
    description:
      "This Service Agreement outlines the terms and conditions for providing software development and maintenance services to Acme Inc for their customer relationship management system.",
    approvalSteps: [
      { name: "Legal Review", status: "completed", user: "Michael Chen", date: "May 11, 2025" },
      { name: "Finance Review", status: "completed", user: "Jennifer Wong", date: "May 12, 2025" },
      { name: "Department Head", status: "current", user: "Robert Lee", date: "" },
      { name: "Executive Approval", status: "pending", user: "CEO", date: "" },
      { name: "Counterparty Signature", status: "pending", user: "Acme Inc", date: "" },
    ],
    history: [
      { action: "Contract created", user: "Sarah Johnson", date: "May 10, 2025 09:15 AM" },
      { action: "Sent for legal review", user: "Sarah Johnson", date: "May 10, 2025 09:30 AM" },
      { action: "Legal review completed", user: "Michael Chen", date: "May 11, 2025 02:45 PM" },
      { action: "Sent for finance review", user: "System", date: "May 11, 2025 02:46 PM" },
      { action: "Finance review completed", user: "Jennifer Wong", date: "May 12, 2025 11:20 AM" },
      { action: "Sent to department head", user: "System", date: "May 12, 2025 11:21 AM" },
    ],
    comments: [
      {
        id: 1,
        user: "Michael Chen",
        avatar: "/placeholder.svg",
        text: "I've reviewed the liability clauses and they look good. Made a few minor edits to section 5.2.",
        date: "May 11, 2025 02:30 PM",
      },
      {
        id: 2,
        user: "Jennifer Wong",
        avatar: "/placeholder.svg",
        text: "Payment terms are acceptable. Please ensure we have the proper invoicing procedures in place before signing.",
        date: "May 12, 2025 11:15 AM",
      },
    ],
  }

  const handleAddComment = () => {
    if (commentText.trim()) {
      // In a real app, this would send the comment to an API
      alert("Comment added: " + commentText)
      setCommentText("")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/dashboard/contracts">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{contract.name}</h1>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  contract.status === "Active"
                    ? "outline"
                    : contract.status === "Pending Approval"
                      ? "default"
                      : contract.status === "Draft"
                        ? "secondary"
                        : "destructive"
                }
              >
                {contract.status}
              </Badge>
              <span className="text-sm text-muted-foreground">{contract.type}</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1" asChild>
              <Link href={`/dashboard/contracts/${params.id}/crm`}>
                <ExternalLink className="h-4 w-4" />
                CRM Data
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Share className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setIsPDFModalOpen(true)}>
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Create Template</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Archive</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                      <p className="mt-1">{contract.description}</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Contract Owner</h3>
                        <p className="mt-1">{contract.owner}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Counterparty</h3>
                        <p className="mt-1">{contract.counterparty}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Created Date</h3>
                        <p className="mt-1">{contract.created}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Expiry Date</h3>
                        <p className="mt-1">{contract.expiry}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Contract Type</h3>
                        <p className="mt-1">{contract.type}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Contract Value</h3>
                        <p className="mt-1">{contract.value}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Document Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex h-[400px] items-center justify-center rounded-md border-2 border-dashed p-10 text-center">
                    <div>
                      <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-semibold">Service Agreement - Acme Inc.pdf</h3>
                      <p className="mt-1 text-sm text-muted-foreground">12 pages · 2.4 MB</p>
                      <Button className="mt-4">View Full Document</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="comments">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="related">Related Documents</TabsTrigger>
                </TabsList>
                <TabsContent value="comments" className="mt-4 space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {contract.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-4">
                            <Avatar>
                              <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.user} />
                              <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{comment.user}</span>
                                <span className="text-xs text-muted-foreground">{comment.date}</span>
                              </div>
                              <p className="text-sm">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start gap-3 pt-0">
                      <Separator />
                      <div className="flex w-full gap-4">
                        <Avatar>
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <Textarea
                            placeholder="Add a comment..."
                            className="min-h-[80px]"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                          />
                          <Button onClick={handleAddComment} disabled={!commentText.trim()}>
                            Add Comment
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="history" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {contract.history.map((item, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <History className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{item.action}</span>
                                <span className="text-xs text-muted-foreground">{item.date}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">By {item.user}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="related" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Master Services Agreement</div>
                            <div className="text-sm text-muted-foreground">Signed on Jan 15, 2025</div>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Statement of Work #1</div>
                            <div className="text-sm text-muted-foreground">Completed on Mar 20, 2025</div>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">NDA - Acme Inc</div>
                            <div className="text-sm text-muted-foreground">Signed on Dec 5, 2024</div>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Approval Workflow</CardTitle>
                  <CardDescription>Current approval status and next steps</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contract.approvalSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                            step.status === "completed"
                              ? "bg-primary text-primary-foreground"
                              : step.status === "current"
                                ? "border-2 border-primary"
                                : "border-2 border-muted"
                          }`}
                        >
                          {step.status === "completed" && <Check className="h-3 w-3" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{step.name}</p>
                            {step.status === "current" && (
                              <Badge variant="outline" className="text-xs">
                                In Progress
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {step.user}
                            {step.date && ` · ${step.date}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  {contract.approvalSteps.find((step) => step.status === "current")?.name === "Department Head" && (
                    <div className="w-full space-y-2">
                      <Button className="w-full">Approve</Button>
                      <Button variant="outline" className="w-full">
                        Request Changes
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Dates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Effective Date</p>
                        <p className="text-sm text-muted-foreground">May 15, 2025</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Expiry Date</p>
                        <p className="text-sm text-muted-foreground">May 10, 2026</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">First Deliverable</p>
                        <p className="text-sm text-muted-foreground">June 30, 2025</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Renewal Notice</p>
                        <p className="text-sm text-muted-foreground">April 10, 2026</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stakeholders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Sarah Johnson</p>
                        <p className="text-xs text-muted-foreground">Contract Owner</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>MC</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Michael Chen</p>
                        <p className="text-xs text-muted-foreground">Legal Reviewer</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>JW</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Jennifer Wong</p>
                        <p className="text-xs text-muted-foreground">Finance Reviewer</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>RL</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Robert Lee</p>
                        <p className="text-xs text-muted-foreground">Department Head</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">John Smith</p>
                        <p className="text-xs text-muted-foreground">Acme Inc Representative</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <PDFExportModal isOpen={isPDFModalOpen} onClose={() => setIsPDFModalOpen(false)} contract={contract} />
    </div>
  )
}
