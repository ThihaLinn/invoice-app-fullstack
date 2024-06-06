package com.mit.dto;

import com.mit.entity.InvoiceDetail;

public record InvoiceDetailDto(
		 Integer id,
		 String item,
		 Integer price,
		 Integer amount,
		 Integer totalAmount
		) {
	
	public static InvoiceDetail toEntity(InvoiceDetailDto invDetailDto) {
		return new InvoiceDetail(invDetailDto.item,invDetailDto.price,invDetailDto.amount,invDetailDto.totalAmount);
	}

	public static InvoiceDetailDto toDto(InvoiceDetail invDetail) {
		return new InvoiceDetailDto(invDetail.invoiceDetailId,invDetail.item,invDetail.price,invDetail.amount,invDetail.totalAmount);
	}

}
