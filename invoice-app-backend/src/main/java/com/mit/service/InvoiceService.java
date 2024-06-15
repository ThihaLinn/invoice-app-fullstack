package com.mit.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.mit.dao.InvoiceRepo;
import com.mit.dto.InvoiceDetailDto;
import com.mit.dto.InvoiceDto;
import com.mit.entity.Invoice;
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
	
    private static final String OUTPUT_FORMAT_PATTERN = "dd/MM/yyyy";



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
	            LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
	            return true;
	        } catch (DateTimeParseException e) {
	            return false;
	        }
	    }
	 
	 public <T extends Enum<T>> boolean isValidEnum(Class<T> enumClass, String value) {
		    for (T enumConstant : enumClass.getEnumConstants()) {
		        if (enumConstant.name().equals(value)) {
		            return true;
		        }
		    }
		    return false;
		}
	 
	  public String getInvoiceField(Invoice invoice, int index) {
	        switch (index) {
	            case 0:
	                return invoice.invoiceId.toString();
	            case 1:
	                return invoice.casherName;
	            case 2:
	                return invoice.date.toString();
	            case 3:
	                return invoice.township.name();
	            default:
	                return "";
	        }
	    }
	  
	  private LocalDate parseDate(String dateString, int rowNumber) {
		    if (dateString == null || dateString.trim().isEmpty()) {
		        return null;
		    }

		    try {
		        // Parse the original date string without changing its format
		        DateTimeFormatter originalFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		        return LocalDate.parse(dateString, originalFormatter);
		    } catch (DateTimeParseException e) {
		        return null;
		    }
		}

}
