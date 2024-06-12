package com.mit.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
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
		 var invoices = invoiceRepo.findAllByOrderByInvoiceIdDesc();

        return invoices.stream().map(InvoiceResponse::toResponse).toList();
	}

	@Transactional
	@Override
	public String createInvoice(InvoiceDto invoiceDto, List<InvoiceDetailDto> invoiceDetailDtos) {
		var invoiceDetails = invoiceDetailService.createInvoiceDetail(invoiceDetailDtos);

		var invoice = InvoiceDto.toEntity(invoiceDto);
		for (InvoiceDetail invoiceDetail : invoiceDetails) {
			invoice.addInvoiceDetail(invoiceDetail);
		}
		invoiceRepo.save(invoice);


		return "Successfully created invoice";
	}



	@Override
	public String updateInvoice(Integer invoiceId,InvoiceDto invoiceDto, List<InvoiceDetailDto> invoiceDetailDtos) {

		var invoice = invoiceRepo.findById(invoiceId).get();
		var toUpdateInvoice = InvoiceDto.toEntity(invoiceDto);
		toUpdateInvoice.setInvoiceId(invoice.invoiceId);
		invoiceRepo.save(toUpdateInvoice);
		
		var inDetailDtos = invoiceDetailService.changetoUnsave(invoiceId, invoiceDetailDtos);
		
//		System.out.println(invoiceDetailDtos);
//		
//		return "okok";
		
		invoiceDetailService.updateInvoiceDetail(invoiceId, inDetailDtos);
	
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
	
	 public boolean isNumeric(String str) {
	        try {
	            Double.parseDouble(str);
	            return true;
	        } catch (NumberFormatException e) {
	            return false;
	        }
	    }
	 
	 public boolean isValidDateFormat(String dateStr) {
	        try {
	            LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
	            return true;
	        } catch (DateTimeParseException e) {
	            return false;
	        }
	    }
	

}
