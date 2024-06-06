// validationSchema.ts
import { formatDate } from 'date-fns';
import { z } from 'zod';

export const invoiceDetailSchema = z.object({
  id: z.number(),
  item: z.string().min(1, 'Item name is required.'),
  price: z.number().positive('Price must be greater 1.'),
  amount: z.number().positive('Amount must be a positive number.'),
  totalAmount: z.number().nonnegative('Total amount must be a non-negative number.'),
});

export const invoiceSchema = z.object({
    casherName: z.string().min(1, 'Casher name is required.'),
    township: z.string().min(1, 'Township is required.'),
    date: z.string().min(1, 'Date is required.'),
    remark: z.string().optional(),
    invoiceDetailDtos: z.array(invoiceDetailSchema).min(1, 'At least one item is required.'),
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


export const changeString = (date: Date) => {
    const dateString = formatDate(date, 'yyyy-MM-dd');

    return dateString;
  }


export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceDetail = z.infer<typeof invoiceDetailSchema>;

