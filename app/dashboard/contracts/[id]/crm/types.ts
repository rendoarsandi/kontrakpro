export interface Contact {
  id: string
  name: string
  title: string
  email: string
  phone: string
  lastActivity: string
  url: string
}

export interface CrmData {
  integration: {
    name: string
    icon: string
    lastSync: string
  }
  contract: {
    id: string
    name: string
    type: string
    stage: string
    amount: string
    probability: string
    closeDate: string
    owner: string
    url: string
  }
  company: {
    id: string
    name: string
    industry: string
    type: string
    website: string
    employees: string
    revenue: string
    address: string
    phone: string
    url: string
  }
  contacts: Contact[]
  activities: Array<{
    id: string
    type: string
    subject: string
    date: string
    description: string
    related: string
    url: string
  }>
}

// Mock CRM data
export const mockCrmData: CrmData = {
  integration: {
    name: "Salesforce",
    icon: "/placeholder.svg",
    lastSync: "Today at 09:45 AM",
  },
  contract: {
    id: "SF-OPP-12345",
    name: "Service Agreement - Acme Inc",
    type: "Service Agreement",
    stage: "Negotiation",
    amount: "$75,000",
    probability: "80%",
    closeDate: "May 10, 2026",
    owner: "Sarah Johnson",
    url: "#",
  },
  company: {
    id: "SF-ACC-5678",
    name: "Acme Inc",
    industry: "Technology",
    type: "Customer",
    website: "https://www.acmeinc.com",
    employees: "1,000-5,000",
    revenue: "$50M-$100M",
    address: "123 Main St, San Francisco, CA 94105",
    phone: "(555) 123-4567",
    url: "#",
  },
  contacts: [
    {
      id: "SF-CON-9012",
      name: "John Smith",
      title: "Chief Technology Officer",
      email: "john.smith@acmeinc.com",
      phone: "(555) 987-6543",
      lastActivity: "May 5, 2025",
      url: "#",
    },
    {
      id: "SF-CON-9013",
      name: "Jane Doe",
      title: "Procurement Manager",
      email: "jane.doe@acmeinc.com",
      phone: "(555) 456-7890",
      lastActivity: "May 3, 2025",
      url: "#",
    },
    {
      id: "SF-CON-9014",
      name: "Robert Johnson",
      title: "Legal Counsel",
      email: "robert.johnson@acmeinc.com",
      phone: "(555) 234-5678",
      lastActivity: "May 1, 2025",
      url: "#",
    },
  ],
  activities: [
    {
      id: "SF-ACT-1234",
      type: "Email",
      subject: "Contract Draft Review",
      date: "May 4, 2025",
      description: "Sent contract draft for internal review",
      related: "John Smith",
      url: "#",
    },
    {
      id: "SF-ACT-1235",
      type: "Meeting",
      subject: "Negotiation Call",
      date: "May 2, 2025",
      description: "Discussed contract terms and pricing",
      related: "Jane Doe, Robert Johnson",
      url: "#",
    },
    {
      id: "SF-ACT-1236",
      type: "Task",
      subject: "Prepare Final Draft",
      date: "May 1, 2025",
      description: "Incorporate feedback and prepare final draft",
      related: "Sarah Johnson",
      url: "#",
    },
  ],
}
