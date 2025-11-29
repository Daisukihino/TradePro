"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { deleteTransaction, updateTransaction } from "@/lib/firebase/db";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface TransactionTableProps {
    transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleEditClick = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsDialogOpen(true);
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTransaction) return;

        setIsLoading(true);
        try {
            await updateTransaction({
                ...editingTransaction,
                totalAmount: editingTransaction.shares * editingTransaction.pricePerShare
            });
            setIsDialogOpen(false);
            setEditingTransaction(null);
            router.refresh();
        } catch (error) {
            console.error("Failed to update transaction", error);
            alert("Failed to update transaction");
        } finally {
            setIsLoading(false);
        }
    };

    if (transactions.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                No transactions found.
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead className="text-right">Shares</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell className="text-muted-foreground">
                                {formatDateTime(transaction.timestamp)}
                            </TableCell>
                            <TableCell>
                                <span className={cn(
                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                    transaction.type === "buy"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                        : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                )}>
                                    {transaction.type.toUpperCase()}
                                </span>
                            </TableCell>
                            <TableCell className="font-medium">
                                <div>{transaction.symbol}</div>
                                <div className="text-xs text-muted-foreground">{transaction.companyName}</div>
                            </TableCell>
                            <TableCell className="text-right">{transaction.shares}</TableCell>
                            <TableCell className="text-right">{formatCurrency(transaction.pricePerShare)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(transaction.totalAmount)}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() => handleEditClick(transaction)}
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-red-600 focus:text-red-600"
                                            onClick={async () => {
                                                if (confirm("Are you sure you want to delete this transaction?")) {
                                                    try {
                                                        await deleteTransaction(transaction.id);
                                                        window.location.reload(); // Simple reload for now to refresh data
                                                    } catch (error) {
                                                        console.error("Failed to delete transaction", error);
                                                        alert("Failed to delete transaction");
                                                    }
                                                }
                                            }}
                                        >
                                            <Trash className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Transaction</DialogTitle>
                        <DialogDescription>
                            Make changes to your transaction here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    {editingTransaction && (
                        <form onSubmit={handleSaveEdit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="symbol" className="text-right">
                                        Symbol
                                    </Label>
                                    <Input
                                        id="symbol"
                                        value={editingTransaction.symbol}
                                        onChange={(e) =>
                                            setEditingTransaction({
                                                ...editingTransaction,
                                                symbol: e.target.value.toUpperCase(),
                                            })
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="shares" className="text-right">
                                        Shares
                                    </Label>
                                    <Input
                                        id="shares"
                                        type="number"
                                        step="any"
                                        value={editingTransaction.shares}
                                        onChange={(e) =>
                                            setEditingTransaction({
                                                ...editingTransaction,
                                                shares: parseFloat(e.target.value) || 0,
                                            })
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="price" className="text-right">
                                        Price
                                    </Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="any"
                                        value={editingTransaction.pricePerShare}
                                        onChange={(e) =>
                                            setEditingTransaction({
                                                ...editingTransaction,
                                                pricePerShare: parseFloat(e.target.value) || 0,
                                            })
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save changes"}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
