"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  FileText,
  Info,
  Loader2,
  Shield,
  Sparkles,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

// Contoh data hasil analisis AI
const mockAnalysisResults = {
  riskScore: 68,
  riskLevel: "Medium",
  analysisTime: "2 minutes",
  documentType: "Service Agreement",
  documentLength: "12 pages",
  keyTerms: [
    {
      term: "Payment Terms",
      description: "Net 30 days from invoice date",
      risk: "low",
      location: "Section 4.2, Page 3",
    },
    {
      term: "Termination Clause",
      description: "30 days written notice required",
      risk: "medium",
      location: "Section 9.1, Page 7",
    },
    {
      term: "Liability Cap",
      description: "Limited to fees paid in the last 12 months",
      risk: "high",
      location: "Section 11.3, Page 8",
    },
    {
      term: "Intellectual Property",
      description: "All IP created during the engagement belongs to the client",
      risk: "low",
      location: "Section 6.1, Page 5",
    },
    {
      term: "Confidentiality",
      description: "5-year confidentiality period after termination",
      risk: "medium",
      location: "Section 7.2, Page 6",
    },
  ],
  potentialIssues: [
    {
      issue: "Ambiguous Indemnification Clause",
      description: "The indemnification clause lacks specificity on covered claims",
      severity: "high",
      recommendation: "Clarify the scope of indemnification and specify excluded claims",
      location: "Section 12.1, Page 9",
    },
    {
      issue: "Missing Force Majeure Details",
      description: "Force majeure clause does not specify notification requirements",
      severity: "medium",
      recommendation: "Add notification timeline and process for force majeure events",
      location: "Section 14.3, Page 10",
    },
    {
      issue: "Vague Service Level Agreement",
      description: "SLA lacks specific metrics and remedies for non-compliance",
      severity: "high",
      recommendation: "Define specific performance metrics and associated penalties",
      location: "Section 3.4, Page 2",
    },
    {
      issue: "Automatic Renewal Without Notice",
      description: "Contract renews automatically without prior notification requirement",
      severity: "medium",
      recommendation: "Add requirement for renewal notification at least 30 days before term end",
      location: "Section 2.2, Page 1",
    },
  ],
  missingClauses: [
    {
      clause: "Data Protection",
      importance: "high",
      recommendation: "Add clause addressing data protection responsibilities and compliance with relevant regulations",
    },
    {
      clause: "Dispute Resolution",
      importance: "medium",
      recommendation: "Include arbitration or mediation procedures before litigation",
    },
    {
      clause: "Insurance Requirements",
      importance: "medium",
      recommendation: "Specify required insurance types and coverage amounts",
    },
  ],
  complianceIssues: [
    {
      regulation: "GDPR",
      issue: "Missing data processing agreement",
      severity: "high",
      recommendation: "Add GDPR-compliant data processing terms",
    },
    {
      regulation: "Industry Standards",
      issue: "Security requirements below industry standard",
      severity: "medium",
      recommendation: "Update security requirements to match current industry standards",
    },
  ],
}

export default function AnalyzeContractPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisResults, setAnalysisResults] = useState<typeof mockAnalysisResults | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    keyTerms: true,
    potentialIssues: true,
    missingClauses: true,
    complianceIssues: true,
  })

  // Contoh data kontrak
  const contract = {
    id: params.id,
    title: "Service Agreement - Acme Inc",
    type: "Service Agreement",
    created: "May 10, 2025",
    pages: 12,
  }

  // Fungsi untuk memulai analisis
  const startAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulasi progress analisis
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setAnalysisComplete(true)
          setAnalysisResults(mockAnalysisResults)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  // Fungsi untuk toggle expanded sections
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Fungsi untuk mendapatkan warna berdasarkan tingkat risiko
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-amber-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Fungsi untuk mendapatkan variant badge berdasarkan tingkat risiko
  const getRiskBadgeVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "outline"
      case "medium":
        return "default"
      case "high":
        return "destructive"
      default:
        return "secondary"
    }
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
          <h1 className="text-lg font-semibold">AI Analysis: {contract.title}</h1>
          <div className="ml-auto flex items-center gap-2">
            {analysisComplete && (
              <Button variant="outline" className="gap-1">
                <Download className="h-4 w-4" />
                Export Analysis
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          {!isAnalyzing && !analysisComplete ? (
            <Card>
              <CardHeader>
                <CardTitle>Analyze Contract with AI</CardTitle>
                <CardDescription>Use AI to analyze this contract for risks and important terms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 rounded-md border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{contract.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{contract.type}</span>
                      <span>•</span>
                      <span>{contract.pages} pages</span>
                      <span>•</span>
                      <span>Created: {contract.created}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="analysis-focus">Analysis Focus</Label>
                    <Select defaultValue="comprehensive">
                      <SelectTrigger id="analysis-focus">
                        <SelectValue placeholder="Select analysis focus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                        <SelectItem value="risk">Risk Assessment</SelectItem>
                        <SelectItem value="compliance">Compliance Check</SelectItem>
                        <SelectItem value="terms">Key Terms Extraction</SelectItem>
                        <SelectItem value="custom">Custom Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="compliance-standards">Compliance Standards to Check</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="compliance-standards">
                        <SelectValue placeholder="Select compliance standards" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Applicable Standards</SelectItem>
                        <SelectItem value="gdpr">GDPR</SelectItem>
                        <SelectItem value="hipaa">HIPAA</SelectItem>
                        <SelectItem value="ccpa">CCPA/CPRA</SelectItem>
                        <SelectItem value="industry">Industry Standards</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additional-instructions">Additional Instructions (Optional)</Label>
                    <Textarea
                      id="additional-instructions"
                      placeholder="Enter any specific instructions or areas to focus on"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/contracts/${params.id}`}>Cancel</Link>
                </Button>
                <Button onClick={startAnalysis} className="gap-1">
                  <Sparkles className="h-4 w-4" />
                  Analyze with AI
                </Button>
              </CardFooter>
            </Card>
          ) : isAnalyzing ? (
            <Card>
              <CardHeader>
                <CardTitle>Analyzing Contract</CardTitle>
                <CardDescription>Please wait while we analyze your contract</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">AI Analysis in Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI is analyzing your contract for risks and important terms
                  </p>
                  <div className="mt-6 w-full max-w-md space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{analysisProgress}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Extracting document text</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Identifying contract structure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {analysisProgress >= 50 ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      <span>Analyzing key terms and clauses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {analysisProgress >= 70 ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      <span>Identifying potential risks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {analysisProgress >= 90 ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      <span>Generating recommendations</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" onClick={() => setIsAnalyzing(false)}>
                  Cancel Analysis
                </Button>
              </CardFooter>
            </Card>
          ) : (
            analysisResults && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Analysis Results</CardTitle>
                        <CardDescription>{contract.title}</CardDescription>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          <Clock className="mr-1 inline-block h-4 w-4" />
                          Analyzed in {analysisResults.analysisTime}
                        </div>
                        <Badge
                          variant={
                            analysisResults.riskLevel === "Low"
                              ? "outline"
                              : analysisResults.riskLevel === "Medium"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {analysisResults.riskLevel} Risk
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-lg border p-4">
                        <div className="text-sm font-medium text-muted-foreground">Risk Score</div>
                        <div className="mt-1 flex items-end justify-between">
                          <div className="text-2xl font-bold">{analysisResults.riskScore}/100</div>
                          <div
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              analysisResults.riskLevel === "Low"
                                ? "bg-green-100 text-green-800"
                                : analysisResults.riskLevel === "Medium"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {analysisResults.riskLevel}
                          </div>
                        </div>
                        <div className="mt-2">
                          <Progress
                            value={analysisResults.riskScore}
                            className={`h-2 ${
                              analysisResults.riskLevel === "Low"
                                ? "bg-green-100"
                                : analysisResults.riskLevel === "Medium"
                                  ? "bg-amber-100"
                                  : "bg-red-100"
                            }`}
                            indicatorClassName={
                              analysisResults.riskLevel === "Low"
                                ? "bg-green-500"
                                : analysisResults.riskLevel === "Medium"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }
                          />
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="text-sm font-medium text-muted-foreground">Document Type</div>
                        <div className="mt-1 text-2xl font-bold">{analysisResults.documentType}</div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="text-sm font-medium text-muted-foreground">Document Length</div>
                        <div className="mt-1 text-2xl font-bold">{analysisResults.documentLength}</div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="text-sm font-medium text-muted-foreground">Issues Found</div>
                        <div className="mt-1 text-2xl font-bold">
                          {analysisResults.potentialIssues.length + analysisResults.missingClauses.length}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border">
                      <div className="flex items-center justify-between p-4">
                        <h3 className="text-lg font-medium">Key Terms</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSection("keyTerms")}
                          className="h-8 w-8 p-0"
                        >
                          {expandedSections.keyTerms ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Collapsible open={expandedSections.keyTerms}>
                        <CollapsibleContent>
                          <Separator />
                          <div className="p-4">
                            <div className="space-y-4">
                              {analysisResults.keyTerms.map((term, index) => (
                                <div key={index} className="rounded-md border p-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <div
                                          className={`h-2 w-2 rounded-full ${getRiskColor(term.risk)}`}
                                          aria-hidden="true"
                                        ></div>
                                        <h4 className="font-medium">{term.term}</h4>
                                      </div>
                                      <p className="mt-1 text-sm">{term.description}</p>
                                    </div>
                                    <Badge variant={getRiskBadgeVariant(term.risk)}>
                                      {term.risk.charAt(0).toUpperCase() + term.risk.slice(1)} Risk
                                    </Badge>
                                  </div>
                                  <div className="mt-2 text-xs text-muted-foreground">{term.location}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>

                    <div className="rounded-lg border">
                      <div className="flex items-center justify-between p-4">
                        <h3 className="text-lg font-medium">Potential Issues</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSection("potentialIssues")}
                          className="h-8 w-8 p-0"
                        >
                          {expandedSections.potentialIssues ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Collapsible open={expandedSections.potentialIssues}>
                        <CollapsibleContent>
                          <Separator />
                          <div className="p-4">
                            <div className="space-y-4">
                              {analysisResults.potentialIssues.map((issue, index) => (
                                <div key={index} className="rounded-md border p-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <AlertTriangle
                                          className={`h-4 w-4 ${
                                            issue.severity === "high"
                                              ? "text-red-500"
                                              : issue.severity === "medium"
                                                ? "text-amber-500"
                                                : "text-green-500"
                                          }`}
                                        />
                                        <h4 className="font-medium">{issue.issue}</h4>
                                      </div>
                                      <p className="mt-1 text-sm">{issue.description}</p>
                                    </div>
                                    <Badge variant={getRiskBadgeVariant(issue.severity)}>
                                      {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                                    </Badge>
                                  </div>
                                  <div className="mt-2 text-xs text-muted-foreground">{issue.location}</div>
                                  <div className="mt-3 flex items-start gap-2 rounded-md bg-muted p-2 text-sm">
                                    <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                    <div>
                                      <span className="font-medium">Recommendation: </span>
                                      {issue.recommendation}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>

                    <div className="rounded-lg border">
                      <div className="flex items-center justify-between p-4">
                        <h3 className="text-lg font-medium">Missing Clauses</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSection("missingClauses")}
                          className="h-8 w-8 p-0"
                        >
                          {expandedSections.missingClauses ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Collapsible open={expandedSections.missingClauses}>
                        <CollapsibleContent>
                          <Separator />
                          <div className="p-4">
                            <div className="space-y-4">
                              {analysisResults.missingClauses.map((clause, index) => (
                                <div key={index} className="rounded-md border p-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <X
                                          className={`h-4 w-4 ${
                                            clause.importance === "high"
                                              ? "text-red-500"
                                              : clause.importance === "medium"
                                                ? "text-amber-500"
                                                : "text-green-500"
                                          }`}
                                        />
                                        <h4 className="font-medium">Missing: {clause.clause}</h4>
                                      </div>
                                    </div>
                                    <Badge variant={getRiskBadgeVariant(clause.importance)}>
                                      {clause.importance.charAt(0).toUpperCase() + clause.importance.slice(1)}{" "}
                                      Importance
                                    </Badge>
                                  </div>
                                  <div className="mt-3 flex items-start gap-2 rounded-md bg-muted p-2 text-sm">
                                    <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                    <div>
                                      <span className="font-medium">Recommendation: </span>
                                      {clause.recommendation}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>

                    <div className="rounded-lg border">
                      <div className="flex items-center justify-between p-4">
                        <h3 className="text-lg font-medium">Compliance Issues</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSection("complianceIssues")}
                          className="h-8 w-8 p-0"
                        >
                          {expandedSections.complianceIssues ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Collapsible open={expandedSections.complianceIssues}>
                        <CollapsibleContent>
                          <Separator />
                          <div className="p-4">
                            <div className="space-y-4">
                              {analysisResults.complianceIssues.map((issue, index) => (
                                <div key={index} className="rounded-md border p-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <Shield
                                          className={`h-4 w-4 ${
                                            issue.severity === "high"
                                              ? "text-red-500"
                                              : issue.severity === "medium"
                                                ? "text-amber-500"
                                                : "text-green-500"
                                          }`}
                                        />
                                        <h4 className="font-medium">
                                          {issue.regulation}: {issue.issue}
                                        </h4>
                                      </div>
                                    </div>
                                    <Badge variant={getRiskBadgeVariant(issue.severity)}>
                                      {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                                    </Badge>
                                  </div>
                                  <div className="mt-3 flex items-start gap-2 rounded-md bg-muted p-2 text-sm">
                                    <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                    <div>
                                      <span className="font-medium">Recommendation: </span>
                                      {issue.recommendation}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href={`/dashboard/contracts/${params.id}`}>Back to Contract</Link>
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" className="gap-1">
                        <Download className="h-4 w-4" />
                        Export PDF
                      </Button>
                      <Button className="gap-1">
                        <ArrowRight className="h-4 w-4" />
                        Apply Recommendations
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  )
}
