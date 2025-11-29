import { format } from "date-fns";

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatPercent(value: number): string {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(num: number): string {
    if (num >= 1.0e12) {
        return (num / 1.0e12).toFixed(2) + "T";
    } else if (num >= 1.0e9) {
        return (num / 1.0e9).toFixed(2) + "B";
    } else if (num >= 1.0e6) {
        return (num / 1.0e6).toFixed(2) + "M";
    } else if (num >= 1.0e3) {
        return (num / 1.0e3).toFixed(2) + "K";
    } else {
        return num.toString();
    }
}

export function formatDate(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d as Date, "MMM dd, yyyy");
}

export function formatDateTime(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d as Date, "MMM dd, yyyy HH:mm");
}

export function formatTime(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d as Date, "HH:mm");
}
