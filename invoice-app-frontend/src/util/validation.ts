// validationSchema.ts
import { z } from "zod";
import { downloadExcel } from "../api/invoice";

export const invoiceDetailSchema = z.object({
  id: z.number(),
  item: z.string().min(1, "Item name is required."),
  price: z.number().positive("Price must be greater 1."),
  quantity: z.number().positive("Quantity must be a positive number."),
  setAmount: z
    .number()
    .nonnegative("Set amount must be a non-negative number."),
});

export const invoiceSchema = z.object({
  casherName: z.string().min(1, "Casher name is required."),
  township: z.string().min(1, "Township is required."),
  date: z.string().min(1, "Date is required."),
  remark: z.string().optional(),
  invoiceDetailDtos: z
    .array(invoiceDetailSchema)
    .min(1, "At least one item is required."),
});

export const changeDate = (dateString: string) => {
  const dateParts = dateString.split("-"); // Split the string into year, month, and day parts
  const year = parseInt(dateParts[0], 10); // Convert year part to integer
  const month = parseInt(dateParts[1], 10) - 1; // Convert month part to integer and subtract 1
  const day = parseInt(dateParts[2], 10); // Convert day part to integer

  // Create a Date object using individual year, month, and day components
  const date = new Date(year, month, day);
  return date;
};

export function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Pad month for single-digit values
  const day = String(today.getDate()).padStart(2, "0"); // Pad day for single-digit values

  // Choose your desired format:
  // Option 1: YYYY-MM-DD (ISO 8601)
  const formattedDate = `${year}-${month}-${day}`;

  // Option 2: MM/DD/YYYY (US format)
  // const formattedDate = `${month}/${day}/${year}`;

  // Option 3: Custom format (e.g., DD-MMM-YYYY)
  // const formattedDate = `${day}-${today.toLocaleString('default', { month: 'short' })}-${year}`;

  return formattedDate;
}

export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function formatDateString(dateString: string) {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${day}-${month}`;
};

export const generateExcel = async (invoices: any) => {
  try {
    const response = await downloadExcel(invoices);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

    // Construct the file name
    const fileName = `invoice_${year}-${month}-${day}_${hours}-${minutes}-${seconds}-${milliseconds}.xlsx`;

    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // Clean up
  } catch (error) {
    console.error("Error generating Excel:", error);
  }
};

export const numberWithCommas = (x: number): string => {
  if (x < 1000) return x.toString(); // No commas needed for numbers less than 1000
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceDetail = z.infer<typeof invoiceDetailSchema>;
