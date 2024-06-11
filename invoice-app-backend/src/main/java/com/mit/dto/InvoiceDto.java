package com.mit.dto;

import java.time.LocalDate;

import com.mit.entity.Invoice;
import com.mit.type.Township;

public record InvoiceDto(
		Integer invoiceId,
		 String casherName,
		 LocalDate date,
		 Township township,
		 String remark
		) {
	
	public static Invoice toEntity(InvoiceDto invoiceDto) {
		return new Invoice(invoiceDto.casherName,invoiceDto.date(),invoiceDto.township,invoiceDto.remark);
	}

	public static InvoiceDto toDto(Invoice invoice) {
		return new InvoiceDto(invoice.getInvoiceId(),invoice.casherName,invoice.date,invoice.township,invoice.remark);
	}
	
	

}
