package com.mit.controller;

import java.io.ByteArrayInputStream;
import java.util.List;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mit.entity.Invoice;
import com.mit.service.InvoiceDetailService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
@RequestMapping("/invoiceDetail")
public class InvoiceDetailController {
	
	private final InvoiceDetailService detailService;
	
	
	 	@PostMapping("/download/excel")
	 	public ResponseEntity<ByteArrayResource> downloadExcel(@RequestBody List<Invoice> invoices) throws Exception {
	 		  ByteArrayInputStream in = detailService.generateExcel(invoices);

	 	        byte[] excelBytes = in.readAllBytes();

	 	        HttpHeaders headers = new HttpHeaders();
	 	        headers.add("Content-Disposition", "attachment; filename=invoices.xlsx");

	 	        return ResponseEntity.ok()
	 	                .headers(headers)
	 	                .contentLength(excelBytes.length)
	 	                .contentType(MediaType.APPLICATION_OCTET_STREAM)
	 	                .body(new ByteArrayResource(excelBytes));
	    }
	

}
