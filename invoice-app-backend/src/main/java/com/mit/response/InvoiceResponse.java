package com.mit.response;

import java.time.LocalDate;
import java.util.List;

import com.mit.dto.InvoiceDetailDto;
import com.mit.entity.Invoice;
import com.mit.type.Township;

public record InvoiceResponse (
		Integer invoiceId,
        String casherName,
        Township township,
        LocalDate date,
        String remark,
        List<InvoiceDetailDto> invoiceDetailDtos
){

    public static InvoiceResponse toResponse(Invoice invoice) {
        var invoiceDetails = invoice.invoiceDetails.stream().map(InvoiceDetailDto::toDto).toList();
        return new InvoiceResponse(invoice.getInvoiceId(),invoice.casherName,invoice.township,invoice.date,invoice.remark,invoiceDetails);
    }


}
