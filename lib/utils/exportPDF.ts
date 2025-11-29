import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Portfolio, User } from "@/types";
import { formatCurrency, formatPercent } from "./formatters";

/**
 * Export portfolio data as PDF
 */
export function exportPortfolioPDF(portfolio: Portfolio, user: User): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Header
    doc.setFillColor(59, 130, 246); // Primary blue color
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("TradePro", 14, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Portfolio Report", 14, 30);

    // User Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Name: ${user.displayName || "N/A"}`, 14, 50);
    doc.text(`Email: ${user.email}`, 14, 56);
    doc.text(`Date: ${currentDate}`, 14, 62);

    // Portfolio Summary
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Portfolio Summary", 14, 75);

    const summaryData = [
        ["Total Portfolio Value", formatCurrency(portfolio.totalValue)],
        ["Cash Balance", formatCurrency(portfolio.cashBalance)],
        ["Total Gain/Loss", formatCurrency(portfolio.totalGainLoss)],
        ["Gain/Loss Percentage", formatPercent(portfolio.totalGainLossPercent)],
        ["Number of Holdings", portfolio.holdings.length.toString()],
    ];

    autoTable(doc, {
        startY: 80,
        head: [["Metric", "Value"]],
        body: summaryData,
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 14, right: 14 },
    });

    // Holdings Table
    const finalY = (doc as any).lastAutoTable.finalY || 130;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Holdings", 14, finalY + 10);

    if (portfolio.holdings.length > 0) {
        const holdingsData = portfolio.holdings.map((holding) => [
            holding.symbol,
            holding.shares.toString(),
            formatCurrency(holding.avgPurchasePrice || 0),
            formatCurrency(holding.currentPrice || 0),
            formatCurrency(holding.totalValue || 0),
            formatCurrency(holding.gainLoss || 0),
            formatPercent(holding.gainLossPercent || 0),
        ]);

        autoTable(doc, {
            startY: finalY + 15,
            head: [["Symbol", "Shares", "Avg Price", "Current", "Total Value", "Gain/Loss", "%"]],
            body: holdingsData,
            theme: "striped",
            headStyles: { fillColor: [59, 130, 246] },
            margin: { left: 14, right: 14 },
            styles: { fontSize: 9 },
        });
    } else {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("No holdings available", 14, finalY + 20);
    }

    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
        "This is a virtual trading report for educational purposes only.",
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
    );

    // Save PDF
    const fileName = `TradePro_Portfolio_Report_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
}

/**
 * Export transactions data as PDF
 */
export function exportTransactionsPDF(transactions: any[], user: User): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("TradePro", 14, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Transaction History", 14, 30);

    // User Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Name: ${user.displayName || "N/A"}`, 14, 50);
    doc.text(`Email: ${user.email}`, 14, 56);
    doc.text(`Date: ${currentDate}`, 14, 62);

    // Transactions Table
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Recent Transactions", 14, 75);

    if (transactions.length > 0) {
        const transactionsData = transactions.map((tx) => [
            new Date(tx.timestamp).toLocaleDateString(),
            tx.type.toUpperCase(),
            tx.symbol,
            tx.shares.toString(),
            formatCurrency(tx.price),
            formatCurrency(tx.total),
        ]);

        autoTable(doc, {
            startY: 80,
            head: [["Date", "Type", "Symbol", "Shares", "Price", "Total"]],
            body: transactionsData,
            theme: "striped",
            headStyles: { fillColor: [59, 130, 246] },
            margin: { left: 14, right: 14 },
            styles: { fontSize: 9 },
        });
    } else {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("No transactions available", 14, 85);
    }

    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
        "This is a virtual trading report for educational purposes only.",
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
    );

    // Save PDF
    const fileName = `TradePro_Transactions_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
}
