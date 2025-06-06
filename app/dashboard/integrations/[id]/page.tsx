"use client"; // This should be the very first line

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronRight, ExternalLink, Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// export const runtime = 'edge';

import { CRMAccountForm } from "./crm-account-form";

// Define types for CRM Integration data
interface CRMField {
  kontrakpro: string;
  crm: string;
  required: boolean;
}

interface CRMEntity {
  name: string;
  fields: CRMField[];
}

interface CRMSyncSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface CRMIntegration {
  id: string;
  name: string;
  description: string;
  icon: string;
  website: string;
  features: string[];
  dataMapping: {
    entities: CRMEntity[];
  };
  syncSettings: CRMSyncSetting[];
  advancedSettings?: {
    webhookUrl?: string;
    apiKeyName?: string;
  };
}

interface CRMIntegrations {
  [key: string]: CRMIntegration;
}

// Mock data for CRM integrations
const crmIntegrations: CRMIntegrations = {
  salesforce: {
    id: "salesforce",
    name: "Salesforce",
    description: "Connect your Salesforce account to sync contacts, opportunities, and accounts with your contracts.",
    icon: "/placeholder.svg?height=80&width=80",
    website: "https://www.salesforce.com",
    features: [
      "Bi-directional sync of contacts and accounts",
      "Link contracts to opportunities and deals",
      "Automatic contract creation from won opportunities",
      "Contract status updates in Salesforce",
      "View contract details directly in Salesforce",
    ],
    dataMapping: {
      entities: [
        {
          name: "Contact",
          fields: [
            { kontrakpro: "Contact Name", crm: "Full Name", required: true },
            { kontrakpro: "Email", crm: "Email", required: true },
            { kontrakpro: "Phone", crm: "Phone", required: false },
            { kontrakpro: "Company", crm: "Account Name", required: false },
            { kontrakpro: "Position", crm: "Title", required: false },
          ],
        },
        {
          name: "Company",
          fields: [
            { kontrakpro: "Company Name", crm: "Account Name", required: true },
            { kontrakpro: "Industry", crm: "Industry", required: false },
            { kontrakpro: "Website", crm: "Website", required: false },
            { kontrakpro: "Address", crm: "Billing Address", required: false },
          ],
        },
        {
          name: "Contract",
          fields: [
            { kontrakpro: "Contract Name", crm: "Contract Name", required: true },
            { kontrakpro: "Contract Value", crm: "Contract Amount", required: false },
            { kontrakpro: "Start Date", crm: "Contract Start Date", required: false },
            { kontrakpro: "End Date", crm: "Contract End Date", required: false },
            { kontrakpro: "Status", crm: "Status", required: true },
          ],
        },
      ],
    },
    syncSettings: [
      {
        id: "contacts",
        name: "Contacts",
        description: "Sync contacts between KontrakPro and Salesforce",
        enabled: true,
      },
      {
        id: "companies",
        name: "Companies/Accounts",
        description: "Sync companies with Salesforce accounts",
        enabled: true,
      },
      {
        id: "contracts",
        name: "Contracts",
        description: "Sync contracts with Salesforce opportunities",
        enabled: true,
      },
      {
        id: "activities",
        name: "Activities",
        description: "Sync contract activities with Salesforce tasks",
        enabled: false,
      },
      {
        id: "documents",
        name: "Documents",
        description: "Sync contract documents with Salesforce files",
        enabled: false,
      },
    ],
  },
  hubspot: {
    id: "hubspot",
    name: "HubSpot",
    description: "Integrate with HubSpot to manage contracts alongside your customer relationships.",
    icon: "/placeholder.svg?height=80&width=80",
    website: "https://www.hubspot.com",
    features: [
      "Sync contacts and companies",
      "Link contracts to deals",
      "Create contracts from deals",
      "Update deal stages based on contract status",
      "View contract details in HubSpot",
    ],
    dataMapping: {
      entities: [
        {
          name: "Contact",
          fields: [
            { kontrakpro: "Contact Name", crm: "Name", required: true },
            { kontrakpro: "Email", crm: "Email", required: true },
            { kontrakpro: "Phone", crm: "Phone", required: false },
            { kontrakpro: "Company", crm: "Company", required: false },
            { kontrakpro: "Position", crm: "Job Title", required: false },
          ],
        },
        {
          name: "Company",
          fields: [
            { kontrakpro: "Company Name", crm: "Company Name", required: true },
            { kontrakpro: "Industry", crm: "Industry", required: false },
            { kontrakpro: "Website", crm: "Website", required: false },
            { kontrakpro: "Address", crm: "Address", required: false },
          ],
        },
        {
          name: "Contract",
          fields: [
            { kontrakpro: "Contract Name", crm: "Deal Name", required: true },
            { kontrakpro: "Contract Value", crm: "Deal Amount", required: false },
            { kontrakpro: "Start Date", crm: "Start Date", required: false },
            { kontrakpro: "End Date", crm: "Close Date", required: false },
            { kontrakpro: "Status", crm: "Deal Stage", required: true },
          ],
        },
      ],
    },
    syncSettings: [
      { id: "contacts", name: "Contacts", description: "Sync contacts between KontrakPro and HubSpot", enabled: true },
      { id: "companies", name: "Companies", description: "Sync companies with HubSpot companies", enabled: true },
      { id: "contracts", name: "Contracts", description: "Sync contracts with HubSpot deals", enabled: true },
      {
        id: "activities",
        name: "Activities",
        description: "Sync contract activities with HubSpot activities",
        enabled: false,
      },
      { id: "documents", name: "Documents", description: "Sync contract documents with HubSpot files", enabled: false },
    ],
  },
  zoho: {
    id: "zoho",
    name: "Zoho CRM",
    description: "Connect Zoho CRM to streamline your contract management process.",
    icon: "/placeholder.svg?height=80&width=80",
    website: "https://www.zoho.com/crm/",
    features: [
      "Sync contacts and accounts",
      "Link contracts to deals",
      "Create contracts from deals",
      "Update deal stages based on contract status",
      "View contract details in Zoho CRM",
    ],
    dataMapping: {
      entities: [
        {
          name: "Contact",
          fields: [
            { kontrakpro: "Contact Name", crm: "Contact Name", required: true },
            { kontrakpro: "Email", crm: "Email", required: true },
            { kontrakpro: "Phone", crm: "Phone", required: false },
            { kontrakpro: "Company", crm: "Account Name", required: false },
            { kontrakpro: "Position", crm: "Title", required: false },
          ],
        },
        {
          name: "Company",
          fields: [
            { kontrakpro: "Company Name", crm: "Account Name", required: true },
            { kontrakpro: "Industry", crm: "Industry", required: false },
            { kontrakpro: "Website", crm: "Website", required: false },
            { kontrakpro: "Address", crm: "Billing Address", required: false },
          ],
        },
        {
          name: "Contract",
          fields: [
            { kontrakpro: "Contract Name", crm: "Deal Name", required: true },
            { kontrakpro: "Contract Value", crm: "Amount", required: false },
            { kontrakpro: "Start Date", crm: "Start Date", required: false },
            { kontrakpro: "End Date", crm: "Closing Date", required: false },
            { kontrakpro: "Status", crm: "Stage", required: true },
          ],
        },
      ],
    },
    syncSettings: [
      { id: "contacts", name: "Contacts", description: "Sync contacts between KontrakPro and Zoho CRM", enabled: true },
      {
        id: "companies",
        name: "Companies/Accounts",
        description: "Sync companies with Zoho CRM accounts",
        enabled: true,
      },
      { id: "contracts", name: "Contracts", description: "Sync contracts with Zoho CRM deals", enabled: true },
      {
        id: "activities",
        name: "Activities",
        description: "Sync contract activities with Zoho CRM tasks",
        enabled: false,
      },
      {
        id: "documents",
        name: "Documents",
        description: "Sync contract documents with Zoho CRM attachments",
        enabled: false,
      },
    ],
  },
  pipedrive: {
    id: "pipedrive",
    name: "Pipedrive",
    description: "Link your Pipedrive deals directly to contracts in KontrakPro.",
    icon: "/placeholder.svg?height=80&width=80",
    website: "https://www.pipedrive.com",
    features: [
      "Sync contacts and organizations",
      "Link contracts to deals",
      "Create contracts from deals",
      "Update deal stages based on contract status",
      "View contract details in Pipedrive",
    ],
    dataMapping: {
      entities: [
        {
          name: "Contact",
          fields: [
            { kontrakpro: "Contact Name", crm: "Person Name", required: true },
            { kontrakpro: "Email", crm: "Email", required: true },
            { kontrakpro: "Phone", crm: "Phone", required: false },
            { kontrakpro: "Company", crm: "Organization", required: false },
            { kontrakpro: "Position", crm: "Position", required: false },
          ],
        },
        {
          name: "Company",
          fields: [
            { kontrakpro: "Company Name", crm: "Organization Name", required: true },
            { kontrakpro: "Industry", crm: "Industry", required: false },
            { kontrakpro: "Website", crm: "Website", required: false },
            { kontrakpro: "Address", crm: "Address", required: false },
          ],
        },
        {
          name: "Contract",
          fields: [
            { kontrakpro: "Contract Name", crm: "Deal Title", required: true },
            { kontrakpro: "Contract Value", crm: "Deal Value", required: false },
            { kontrakpro: "Start Date", crm: "Start Date", required: false },
            { kontrakpro: "End Date", crm: "Expected Close Date", required: false },
            { kontrakpro: "Status", crm: "Stage", required: true },
          ],
        },
      ],
    },
    syncSettings: [
      {
        id: "contacts",
        name: "Contacts",
        description: "Sync contacts between KontrakPro and Pipedrive",
        enabled: true,
      },
      {
        id: "companies",
        name: "Companies/Organizations",
        description: "Sync companies with Pipedrive organizations",
        enabled: true,
      },
      { id: "contracts", name: "Contracts", description: "Sync contracts with Pipedrive deals", enabled: true },
      {
        id: "activities",
        name: "Activities",
        description: "Sync contract activities with Pipedrive activities",
        enabled: false,
      },
      {
        id: "documents",
        name: "Documents",
        description: "Sync contract documents with Pipedrive files",
        enabled: false,
      },
    ],
  },
  custom: {
    id: "custom",
    name: "Custom CRM",
    description: "Connect a custom CRM system using webhooks and a generic API.",
    icon: "/placeholder.svg?height=80&width=80",
    website: "#",
    features: [
      "Configurable webhooks for real-time updates",
      "Flexible data mapping",
      "Basic bi-directional sync",
    ],
    dataMapping: {
      entities: [
        // Custom mapping fields can be defined or discovered here
        { name: "Generic Object", fields: [] }
      ],
    },
    syncSettings: [], // Custom sync settings would be configured dynamically
    advancedSettings: { // Add advanced settings structure
      webhookUrl: "https://your-kontrakpro-instance.com/api/integrations/crm/webhook/custom",
      apiKeyName: "X-CRM-Webhook-Secret",
    }
  }
};

export default function IntegrationDetailPage({ params }: { params: { id: string } }) {
  const [connectionStep, setConnectionStep] = useState(1);
  const [apiKey, setApiKey] = useState("");
  // Get integration data based on ID, ensuring params.id is a valid key
  const integrationId = params.id as keyof CRMIntegrations;
  const currentIntegration = crmIntegrations[integrationId];

  const [syncSettings, setSyncSettings] = useState<CRMSyncSetting[]>(currentIntegration?.syncSettings || []);

  // Fallback for when integration is not found
  const integration = currentIntegration || {
    id: params.id,
    name: params.id.charAt(0).toUpperCase() + params.id.slice(1),
    description: "Connect your CRM system to KontrakPro.",
    icon: "/placeholder.svg?height=80&width=80",
    website: "#",
    features: [],
    dataMapping: { entities: [] as CRMEntity[] }, // Ensure entities is typed
    syncSettings: [] as CRMSyncSetting[], // Ensure syncSettings is typed
  };
  const isCustomIntegration = integration.id === 'custom';


  return ( /* re-typed to address potential parsing issue */
    <div className="container py-6 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/dashboard/integrations">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md overflow-hidden">
            <img
              src={integration.icon || "/placeholder.svg"}
              alt={integration.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{integration.name}</h1>
            <p className="text-muted-foreground">{integration.description}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connect to {integration.name}</CardTitle>
              <CardDescription>
                Follow these steps to connect your {integration.name} account with KontrakPro
              </CardDescription>
            </CardHeader>
            {/* Connection Step 1: Overview */}
            {connectionStep === 1 && (
              <CardContent>
                <div className="space-y-6">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Before you begin</AlertTitle>
                    <AlertDescription>
                      You'll need administrator access to your {integration.name} account to complete this integration.
 </AlertDescription>
                  </Alert>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Step 1: Prepare your {integration.name} account</p>
                        <p className="text-sm text-muted-foreground">
                          Ensure you have the necessary permissions in your {integration.name} account.
                        </p>
                      </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Step 2: Provide API credentials</p>
                        <p className="text-sm text-muted-foreground"></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border">3</div>
                      <div className="flex-1">
                        <p className="font-medium">Step 3: Configure data mapping</p>
                        <p className="text-sm text-muted-foreground">
                          Map fields between KontrakPro and {integration.name}.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
{null}
{/* Connection Step 2: API Credentials */}
              {connectionStep === 2 && (
                <CardContent>
                  <CRMAccountForm integrationId={integration.id} setConnectionStep={setConnectionStep} />
                </CardContent>
              )}
              {/* Connection Step 3: Configuration */}
              {connectionStep === 3 && (
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Configure Sync Settings</h3>
                    {isCustomIntegration ? (
                      <p className="text-muted-foreground">
                        Sync settings for Custom CRM integrations are typically configured via webhook events.
                      </p>
                    ) : (
                      <>
                        <p className="text-muted-foreground">
                          Choose which data to sync between KontrakPro and {integration.name}.
                        </p>

                        <div className="space-y-4">
                          {syncSettings.map((setting) => (
                            <div key={setting.id} className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor={setting.id}>{setting.name}</Label>
                                <p className="text-sm text-muted-foreground">{setting.description}</p>
                              </div>
    <Switch
                                id={setting.id}
                                checked={setting.enabled}
                                onCheckedChange={(checked) =>
                                  setSyncSettings(
                                    syncSettings.map((s) => (s.id === setting.id ? { ...s, enabled: checked } : s))
                                  )
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Sync Direction</h3>
                    <p className="text-muted-foreground">
                      Choose how data should flow between KontrakPro and {integration.name}.
    </p>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Select defaultValue="bidirectional">
                          <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select sync direction" />
                          </SelectTrigger>
    <SelectContent>
    <SelectItem value="bidirectional">Bi-directional (both systems)</SelectItem>
                            <SelectItem value="kontrakpro-to-crm">KontrakPro to {integration.name} only</SelectItem>
                            <SelectItem value="crm-to-kontrakpro">{integration.name} to KontrakPro only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  {!isCustomIntegration && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Sync Frequency</h3>
                        <p className="text-muted-foreground">Choose how often data should be synchronized.</p>
                        <div className="flex items-center space-x-2">
                          <Select defaultValue="15">
                            <SelectTrigger className="w-[280px]">
                              <SelectValue placeholder="Select sync frequency" />
                            </SelectTrigger>
    <SelectContent>
    <SelectItem value="5">Every 5 minutes</SelectItem>
                              <SelectItem value="15">Every 15 minutes</SelectItem>
                              <SelectItem value="30">Every 30 minutes</SelectItem>
                              <SelectItem value="60">Every hour</SelectItem>
                              <SelectItem value="daily">Once a day</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                  {/* Advanced Settings Section */}
                  {isCustomIntegration && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Advanced Settings (Webhooks)</h3>
                        <p className="text-muted-foreground">Configure webhook details for your Custom CRM.</p>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="webhook-url">KontrakPro Webhook URL</Label>
                            <Input id="webhook-url" readOnly value={(integration as any).advancedSettings?.webhookUrl || ''} className="mt-1" />
                            <p className="text-sm text-muted-foreground mt-1">Use this URL in your CRM's webhook settings.</p>
                          </div>
                          <div>
                            <Label htmlFor="api-key-name">Webhook Secret Header Name</Label>
                            <Input id="api-key-name" readOnly value={(integration as any).advancedSettings?.apiKeyName || ''} className="mt-1" />
                             <p className="text-sm text-muted-foreground mt-1">The name of the header containing the secret for authentication.</p>
                          </div>
                           <div>
                            <Label htmlFor="webhook-secret">Webhook Secret</Label>
                            <Input id="webhook-secret" type="password" placeholder="Enter your webhook secret" className="mt-1" />
                             <p className="text-sm text-muted-foreground mt-1">Enter the secret key used by your CRM to secure webhooks.</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {/* End Advanced Settings Section */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setConnectionStep(2)}>
                      Back
                    </Button>
                    <Button onClick={() => alert(`Integration with ${integration.name} completed!`)}>
                      Complete Integration
                    </Button>
                  </div>
                </CardContent>
              )}
          </Card>

          <Tabs defaultValue="features" className="space-y-4">
            <TabsList>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="data-mapping">Data Mapping</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            <TabsContent value="features" className="space-y-4">
              <Card>
                <CardHeader>
 <CardTitle>Integration Features</CardTitle>
                  <CardDescription>Here's what you can do with the {integration.name} integration</CardDescription> 
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {integration.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="data-mapping" className="space-y-4">
              <Card>
                <CardHeader>
 <CardTitle>Data Mapping</CardTitle>
                  <CardDescription>See how data is mapped between KontrakPro and {integration.name}</CardDescription> 
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {integration.dataMapping.entities.map((entity, index) => (
                      <div key={index} className="space-y-2">
 <h3 className="text-lg font-medium">{entity.name} Mapping</h3>
                        <div className="rounded-md border"> 
                          <table className="min-w-full divide-y divide-border">
                            <thead>
                              <tr className="bg-muted/50">
 <th className="px-4 py-3 text-left text-sm font-medium">KontrakPro Field</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">{integration.name} Field</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Required</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {entity.fields.map((field: CRMField, fieldIndex: number) => (
                                <tr key={fieldIndex}>
                                  <td className="px-4 py-3 text-sm">{field.kontrakpro}</td>
                                  <td className="px-4 py-3 text-sm">{field.crm}</td>
                                  <td className="px-4 py-3 text-sm">
                                    {field.required ? (
                                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                                        Required
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline">Optional</Badge>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="faq" className="space-y-4">
              <Card>
                <CardHeader>
 <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">What permissions do I need in {integration.name}?</h3>
                    <p className="text-muted-foreground">
                      You need administrator or API access permissions in your {integration.name} account to set up this
                      integration.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">How often is data synchronized?</h3>
                    <p className="text-muted-foreground">
                      By default, data is synchronized every 15 minutes. You can adjust this in the integration
                      settings.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">What happens if there's a conflict between systems?</h3>
                    <p className="text-muted-foreground">
                      By default, the most recently updated record takes precedence. You can customize this behavior in
                      the advanced settings.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Can I customize the field mapping?</h3>
                    <p className="text-muted-foreground">
                      Yes, you can customize the field mapping after the initial setup in the integration settings.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">How do I disconnect the integration?</h3>
                    <p className="text-muted-foreground">
                      You can disconnect the integration at any time from the integration settings page.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
 <CardTitle>About {integration.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-md overflow-hidden">
                  <img
                    src={integration.icon || "/placeholder.svg"}
                    alt={integration.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <p className="text-center text-muted-foreground">{integration.description}</p>
              <div className="flex justify-center">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={integration.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    Visit Website
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
 <CardTitle>Related Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>Integration Guide</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>API Documentation</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>Troubleshooting</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
 <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Need help with your {integration.name} integration?</p>
              <Button className="w-full">Contact Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
