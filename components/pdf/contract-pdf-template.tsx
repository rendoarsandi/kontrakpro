"use client"

import type React from "react"
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer"

// Register fonts
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
  ],
})

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Roboto",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 40,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    backgroundColor: "#f3f4f6",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
  },
  description: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "45%",
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingTop: 5,
  },
  signatureName: {
    fontSize: 12,
    fontWeight: "bold",
  },
  signatureTitle: {
    fontSize: 10,
    color: "#6b7280",
  },
  signatureDate: {
    fontSize: 10,
    marginTop: 5,
  },
  pageNumber: {
    position: "absolute",
    bottom: 10,
    right: 30,
    fontSize: 10,
    color: "#6b7280",
  },
})

interface ContractPDFTemplateProps {
  contract: any
  includeSignatures?: boolean
  includeWatermark?: boolean
  companyLogo?: string
}

export const ContractPDFTemplate: React.FC<ContractPDFTemplateProps> = ({
  contract,
  includeSignatures = true,
  includeWatermark = false,
  companyLogo = "/placeholder.svg",
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={companyLogo || "/placeholder.svg"} style={styles.logo} />
          <View style={styles.headerRight}>
            <Text>{new Date().toLocaleDateString()}</Text>
            <Text>Reference: {contract.id}</Text>
          </View>
        </View>

        <Text style={styles.title}>{contract.name}</Text>
        <Text style={styles.subtitle}>Status: {contract.status}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contract Description</Text>
          <Text style={styles.description}>{contract.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contract Details</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Contract Owner</Text>
              <Text style={styles.value}>{contract.owner}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Counterparty</Text>
              <Text style={styles.value}>{contract.counterparty}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Created Date</Text>
              <Text style={styles.value}>{contract.created}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Expiry Date</Text>
              <Text style={styles.value}>{contract.expiry}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Contract Type</Text>
              <Text style={styles.value}>{contract.type}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Contract Value</Text>
              <Text style={styles.value}>{contract.value}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Dates</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Effective Date</Text>
              <Text style={styles.value}>May 15, 2025</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Expiry Date</Text>
              <Text style={styles.value}>May 10, 2026</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>First Deliverable</Text>
              <Text style={styles.value}>June 30, 2025</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Renewal Notice</Text>
              <Text style={styles.value}>April 10, 2026</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Approval Status</Text>
          {contract.approvalSteps.map((step: any, index: number) => (
            <View key={index} style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.value}>
                  {step.name}: {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                </Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.value}>{step.user}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.value}>{step.date || "Pending"}</Text>
              </View>
            </View>
          ))}
        </View>

        {includeSignatures && (
          <View style={styles.signatureSection}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureName}>{contract.owner}</Text>
              <Text style={styles.signatureTitle}>Contract Owner</Text>
              <Text style={styles.signatureDate}>Date: ________________</Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureName}>{contract.counterparty} Representative</Text>
              <Text style={styles.signatureTitle}>Counterparty</Text>
              <Text style={styles.signatureDate}>Date: ________________</Text>
            </View>
          </View>
        )}

        <Text style={styles.footer}>
          This document was generated by KontrakPro on {new Date().toLocaleDateString()}.
          {includeWatermark && " DRAFT - NOT FOR DISTRIBUTION"}
        </Text>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}
