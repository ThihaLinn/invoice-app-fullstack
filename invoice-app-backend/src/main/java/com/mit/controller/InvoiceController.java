package com.mit.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mit.dao.InvoiceRepo;
import com.mit.dto.InvoiceDto;
import com.mit.request.InvoiceCreateRequest;
import com.mit.request.InvoiceUpdateRequest;
import com.mit.response.InvoiceResponse;
import com.mit.service.InvoiceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
@RequestMapping("/invoice")
public class InvoiceController {

	private final InvoiceService invoiceService;
	private final InvoiceRepo invoiceRepo;

	@GetMapping()
	public ResponseEntity<List<InvoiceResponse>> getAllInvoice () {
		var result = invoiceService.getAllInvoice();
		return ResponseEntity.ok(result);
	}
	

	@GetMapping("/search/{key}")
	public  ResponseEntity<List<InvoiceDto>> SearchInvoice(@PathVariable String key){
			var result  = invoiceService.searchInvoice(key);
			return ResponseEntity.ok(result);

	}
	
	@GetMapping("/{id}")
	public ResponseEntity<InvoiceResponse> getInvoice(@PathVariable Integer id){
		var invoice = invoiceService.getInvoice(id);
		return ResponseEntity.ok(invoice);
	}
	

	@PostMapping("/createInvoice")
	public ResponseEntity<String> createInvoice(@RequestBody InvoiceCreateRequest invoiceCreateRequest){
		invoiceService.createInvoice(
				 new InvoiceDto(invoiceCreateRequest.invoiceId(),invoiceCreateRequest.casherName(),invoiceCreateRequest.date(),invoiceCreateRequest.township(),invoiceCreateRequest.remark()),
				invoiceCreateRequest.invoiceDetailDtos());

		return ResponseEntity.ok("Successfully Create");
		
	}

	@PostMapping("/updateInvoice")
	public ResponseEntity<String> updateInvoice(@RequestBody InvoiceUpdateRequest invoiceUpdateRequest){

		var result = invoiceService.updateInvoice(
				invoiceUpdateRequest.invoiceId(),
				new InvoiceDto(invoiceUpdateRequest.invoiceId(),invoiceUpdateRequest.casherName(),invoiceUpdateRequest.date(),invoiceUpdateRequest.township(),invoiceUpdateRequest.remark()),
				invoiceUpdateRequest.invoiceDetailDtos());

		return ResponseEntity.ok(result);

	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteInvoice(@PathVariable Integer id){

		if(invoiceRepo.existsById(id)){
			invoiceService.deleteInvoice(id);
			return ResponseEntity.ok("Successfully Delete");
		}

		return ResponseEntity.notFound().build();

	}
	
}
