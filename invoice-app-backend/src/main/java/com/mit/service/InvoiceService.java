package com.mit.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mit.dao.InvoiceRepo;
import com.mit.dto.InvoiceDetailDto;
import com.mit.dto.InvoiceDto;
import com.mit.entity.InvoiceDetail;
import com.mit.method.InvoiceInf;
import com.mit.response.InvoiceResponse;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceService implements InvoiceInf {
	
	private final InvoiceRepo invoiceRepo;
	private final InvoiceDetailService invoiceDetailService;


	@Override
	public List<InvoiceResponse> getAllInvoice() {
		 var invoices = invoiceRepo.findAll();

        return invoices.stream().map(InvoiceResponse::toResponse).toList();
	}

	@Transactional
	@Override
	public String createInvoice(InvoiceDto invoiceDto, List<InvoiceDetailDto> invoiceDetailDtos) {
		var invoiceDetails = invoiceDetailService.createInvoiceDetail(invoiceDetailDtos);

		var invoice = invoiceDto.toEntity(invoiceDto);
		for (InvoiceDetail invoiceDetail : invoiceDetails) {
			invoice.addInvoiceDetail(invoiceDetail);
		}
		invoiceRepo.save(invoice);


		return "Successfully created invoice";
	}


	@Override
	public String updateInvoice(Integer invoiceId,InvoiceDto invoiceDto, List<InvoiceDetailDto> invoiceDetailDtos) {
		System.out.println(invoiceId+"\n"+invoiceDto+"\n"+invoiceDetailDtos);
		var invoice = invoiceDto.toEntity(invoiceDto);
		invoice.setInvoiceId(invoiceId);
		invoiceRepo.save(invoice);
		
		 invoiceDetailDtos =invoiceDetailDtos.stream().map( item -> new InvoiceDetailDto(null, item.item(), item.price(), item.amount(), item.amount()*item.price())).toList();

		invoiceDetailService.updateInvoiceDetail(invoiceId,invoiceDetailDtos);
		
		return "Successfully updated invoice";
	}
	
	@Override
	public String deleteInvoice(Integer id) {
		
		if(invoiceRepo.existsById(id)){
			invoiceRepo.deleteById(id);
			return "Successfully deleted invoice";
		}
		
		return "Fail to delete invoice";
		
	}

	@Override
	public InvoiceResponse getInvoice(Integer id) {
		if(invoiceRepo.existsById(id)) {
			var invoice = invoiceRepo.findById(id).get();
			var invoiceResponse = InvoiceResponse.toResponse(invoice);
			return invoiceResponse;
		}
		return null;
	}

	@Override
	public List<InvoiceDto> searchInvoice(String search) {
		int num;
		try {
			 num = Integer.parseInt(search);
		}catch (NumberFormatException error){
			num = 0;
		}

		System.out.println(num+","+search);

        return invoiceRepo.findByInvoiceNameLikeAndCashierNumber(num,search).stream().map(InvoiceDto::toDto).toList();
	}
	
	
	

}
