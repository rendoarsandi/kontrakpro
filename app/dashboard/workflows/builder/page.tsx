import { useState } from "react"
import { ArrowDown, Plus, Save, Trash2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

"use client"

export default function WorkflowBuilderPage() {
  const [workflowName, setWorkflowName] = useState("New Approval Workflow")
  const [workflowSteps, setWorkflowSteps] = useState([
    { id: 1, type: "approval", name: "Legal Review", assignee: "legal-team", timeLimit: "2" },
    { id: 2, type: "approval", name: "Finance Review", assignee: "finance-team", timeLimit: "2" },
    { id: 3, type: "approval", name: "Department Head", assignee: "department-head", timeLimit: "1" },
    { id: 4, type: "approval", name: "Executive Approval", assignee: "executive", timeLimit: "3" },
  ])

  const addStep = () => {
    const newId = Math.max(0, ...workflowSteps.map((step) => step.id)) + 1
    setWorkflowSteps([
      ...workflowSteps,
      { id: newId, type: "approval", name: "New Step", assignee: "", timeLimit: "2" },
    ])
  }

  const removeStep = (id: number) => {
    setWorkflowSteps(workflowSteps.filter((step) => step.id !== id))
  }

  const updateStep = (id: number, field: string, value: string) => {
    setWorkflowSteps(workflowSteps.map((step) => (step.id === id ? { ...step, [field]: value } : step)))
  }

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <h1 className="text-lg font-semibold">Workflow Builder</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline">Cancel</Button>
            <Button className="gap-1">
              <Save className="h-4 w-4" />
              Save Workflow
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <Tabs defaultValue="builder" className="space-y-6">
            <TabsList>
              <TabsTrigger value="builder">Builder</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Details</CardTitle>
                  <CardDescription>Configure the basic details of your workflow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workflow-name">Workflow Name</Label>
                    <Input id="workflow-name" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workflow-description">Description</Label>
                    <Textarea
                      id="workflow-description"
                      placeholder="Describe the purpose of this workflow"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="workflow-type">Workflow Type</Label>
                      <Select defaultValue="approval">
                        <SelectTrigger id="workflow-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approval">Approval Workflow</SelectItem>
                          <SelectItem value="review">Review Workflow</SelectItem>
                          <SelectItem value="signature">Signature Workflow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workflow-trigger">Trigger</Label>
                      <Select defaultValue="manual">
                        <SelectTrigger id="workflow-trigger">
                          <SelectValue placeholder="Select trigger" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual Start</SelectItem>
                          <SelectItem value="contract-creation">Contract Creation</SelectItem>
                          <SelectItem value="status-change">Status Change</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Workflow Steps</CardTitle>
                    <CardDescription>Define the steps in your workflow</CardDescription>
                  </div>
                  <Button onClick={addStep} className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add Step
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {workflowSteps.map((step, index) => (
                    <div key={step.id} className="relative rounded-md border p-4">
                      <div className="absolute -left-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {index + 1}
                      </div>
                      {index > 0 && (
                        <div className="absolute -left-3 -top-8 flex h-5 w-6 items-center justify-center">
                          <ArrowDown className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Select value={step.type} onValueChange={(value) => updateStep(step.id, "type", value)}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Step Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="approval">Approval</SelectItem>
                              <SelectItem value="condition">Condition</SelectItem>
                              <SelectItem value="review">Review</SelectItem>
                              <SelectItem value="notification">Notification</SelectItem>
                              <SelectItem value="signature">Signature</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder={step.type === "condition" ? "Condition Name" : "Step Name"}
                            value={step.name}
                            onChange={(e) => updateStep(step.id, "name", e.target.value)}
                            className="max-w-[250px]"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStep(step.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {step.type !== "condition" ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Assignee</Label>
                            <Select
                              value={step.assignee}
                              onValueChange={(value) => updateStep(step.id, "assignee", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select assignee" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="legal-team">Legal Team</SelectItem>
                                <SelectItem value="finance-team">Finance Team</SelectItem>
                                <SelectItem value="department-head">Department Head</SelectItem>
                                <SelectItem value="executive">Executive</SelectItem>
                                <SelectItem value="contract-owner">Contract Owner</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Time Limit (Days)</Label>
                            <Input
                              type="number"
                              min="1"
                              value={step.timeLimit}
                              onChange={(e) => updateStep(step.id, "timeLimit", e.target.value)}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label>Condition Logic</Label>
                          <Input
                            placeholder="e.g., contract value > 100000" // Adjusted placeholder for clarity
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center space-x-2">
                        <Switch id={`required-${step.id}`} defaultChecked />
                        <Label htmlFor={`required-${step.id}`}>Required Step</Label>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Reset</Button>
                  <Button>Save Workflow</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Settings</CardTitle>
                  <CardDescription>Configure advanced settings for your workflow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Notifications</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-start" defaultChecked />
                        <Label htmlFor="notify-start">Notify when workflow starts</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-step" defaultChecked />
                        <Label htmlFor="notify-step">Notify assignees when their step is active</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-complete" defaultChecked />
                        <Label htmlFor="notify-complete">Notify when workflow completes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-overdue" defaultChecked />
                        <Label htmlFor="notify-overdue">Send reminders for overdue steps</Label>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Automation</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="auto-advance" defaultChecked />
                        <Label htmlFor="auto-advance">Automatically advance to next step</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="auto-complete" />
                        <Label htmlFor="auto-complete">Auto-complete workflow if all steps approved</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="parallel-steps" />
                        <Label htmlFor="parallel-steps">Allow parallel step execution</Label>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Deadline Handling</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="overdue-action">When Step is Overdue</Label>
                        <Select defaultValue="notify">
                          <SelectTrigger id="overdue-action">
                            <SelectValue placeholder="Select action" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="notify">Notify Only</SelectItem>
                            <SelectItem value="escalate">Escalate to Manager</SelectItem>
                            <SelectItem value="reassign">Auto-reassign</SelectItem>
                            <SelectItem value="skip">Skip Step</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger id="reminder-frequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="bidaily">Every 2 Days</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Permissions</CardTitle>
                  <CardDescription>Control who can use and modify this workflow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Access Level</Label>
                    <Select defaultValue="team">
                      <SelectTrigger>
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private (Creator Only)</SelectItem>
                        <SelectItem value="team">Team</SelectItem>
                        <SelectItem value="department">Department</SelectItem>
                        <SelectItem value="organization">Organization-wide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Team Members</Label>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Plus className="h-3.5 w-3.5" />
                        Add Member
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-md border p-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt="User" />
                            <AvatarFallback>SJ</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Sarah Johnson</p>
                            <p className="text-xs text-muted-foreground">Legal Department</p>
                          </div>
                        </div>
                        <Select defaultValue="edit">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Permission" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="view">View Only</SelectItem>
                            <SelectItem value="use">Can Use</SelectItem>
                            <SelectItem value="edit">Can Edit</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between rounded-md border p-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt="User" />
                            <AvatarFallback>MC</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Michael Chen</p>
                            <p className="text-xs text-muted-foreground">Finance Department</p>
                          </div>
                        </div>
                        <Select defaultValue="use">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Permission" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="view">View Only</SelectItem>
                            <SelectItem value="use">Can Use</SelectItem>
                            <SelectItem value="edit">Can Edit</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between rounded-md border p-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt="User" />
                            <AvatarFallback>RL</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Robert Lee</p>
                            <p className="text-xs text-muted-foreground">Department Head</p>
                          </div>
                        </div>
                        <Select defaultValue="admin">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Permission" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="view">View Only</SelectItem>
                            <SelectItem value="use">Can Use</SelectItem>
                            <SelectItem value="edit">Can Edit</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
