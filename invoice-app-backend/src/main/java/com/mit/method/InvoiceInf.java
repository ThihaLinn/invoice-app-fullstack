package com.mit.method;

import java.util.List;

import com.mit.dto.InvoiceDetailDto;
import com.mit.dto.InvoiceDto;
import com.mit.response.InvoiceResponse;

public interface InvoiceInf {

	public List<InvoiceResponse> getAllInvoice();
	
	public List<InvoiceDto> searchInvoice(String search);
	
	public InvoiceResponse getInvoice(Integer id);

	public String createInvoice(InvoiceDto InvoiceDto, List<InvoiceDetailDto> invoiceDetailDto);

	public String updateInvoice(Integer id,InvoiceDto InvoiceDto, List<InvoiceDetailDto> invoiceDetailDto);
	
	public String deleteInvoice(Integer id);

}
