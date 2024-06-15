package com.mit.dto;

import com.mit.entity.InvoiceDetail;

public record InvoiceDetailDto(
		 Integer id,
		 String item,
		 Double price,
		 Double quantity,
		 Double setAmount
		) {

	
	public static InvoiceDetail toEntity(InvoiceDetailDto invDetailDto) {
		return new InvoiceDetail(invDetailDto.item,invDetailDto.price,invDetailDto.quantity,invDetailDto.setAmount);
	}


	public static InvoiceDetailDto toDto(InvoiceDetail invDetail) {
		return new InvoiceDetailDto(invDetail.invoiceDetailId,invDetail.item,invDetail.price,invDetail.quantity,invDetail.setAmount);
	}
	

}
