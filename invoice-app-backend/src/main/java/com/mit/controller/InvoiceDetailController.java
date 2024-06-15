package com.mit.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mit.dao.InvoiceRepo;
import com.mit.entity.Invoice;
import com.mit.entity.InvoiceDetail;
import com.mit.service.InvoiceDetailService;
import com.mit.service.InvoiceService;
import com.mit.type.Township;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
@RequestMapping("/invoiceDetail")
public class InvoiceDetailController{
	
	private final InvoiceDetailService detailService;
	private final InvoiceService invoiceService;
	private final InvoiceRepo invoiceRepo;
	
	
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
	 	
	 	
	 	@PostMapping("/validate-excel")
	 	public ResponseEntity<?> validateExcel(@RequestBody MultipartFile file) {
	 	    if (file == null) {
	 	        return ResponseEntity.badRequest().body("No file uploaded");
	 	    }

	 	    try (InputStream inputStream = file.getInputStream()) {
	 	        Workbook workbook = new XSSFWorkbook(inputStream);
	 	        Sheet sheet = workbook.getSheetAt(0); // Assuming the first sheet is the one we want to read

	 	        // Check if the Excel sheet has 8 columns
	 	        if (sheet.getRow(0).getPhysicalNumberOfCells() != 8) {
	 	            return ResponseEntity.badRequest().body("The Excel sheet must have 8 columns.");
	 	        }

	 	        List<Invoice> invoices = new ArrayList<>();
	 	        List<InvoiceDetail> invoiceDetails = new ArrayList<>();
	 	        Map<String, Invoice> invoiceMap = new HashMap<>();
	 	        Iterator<Row> iterator = sheet.iterator();
	 	        int rowNumber = 0;
	 	        while (iterator.hasNext()) {
	 	            Row currentRow = iterator.next();
	 	            if (rowNumber == 0) { // Skip header row
	 	                rowNumber++;
	 	                continue;
	 	            }
	 	            int columns = currentRow.getPhysicalNumberOfCells();
	 	            if (columns != 8) {
	 	                return ResponseEntity.badRequest().body("Row " + rowNumber + " does not have 8 columns.");
	 	            }
	 	            List<String> rowData = new ArrayList<>();
	 	            for (int i = 0; i < columns; i++) {
	 	                Cell currentCell = currentRow.getCell(i);
	 	                if (currentCell == null) {
	 	                    rowData.add("");
	 	                } else {
	 	                    switch (currentCell.getCellType()) {
	 	                        case STRING:
	 	                            rowData.add(currentCell.getStringCellValue());
	 	                            break;
	 	                        case NUMERIC:
	 	                            rowData.add(String.valueOf(currentCell.getNumericCellValue()));
	 	                            break;
	 	                        case BOOLEAN:
	 	                            rowData.add(String.valueOf(currentCell.getBooleanCellValue()));
	 	                            break;
	 	                        default:
	 	                            rowData.add("");
	 	                    }
	 	                }
	 	            }

	 	            if (!invoiceService.isNumeric(rowData.get(columns - 3)) || 
	 	                !invoiceService.isNumeric(rowData.get(columns - 2)) || 
	 	                !invoiceService.isNumeric(rowData.get(columns - 1))) {
	 	                return ResponseEntity.badRequest().body("Row " + (rowNumber + 1) + ", Columns " + (columns - 2) + " must be numeric value.");
	 	            }

	 	            String key = rowData.get(0) + "|" + rowData.get(1) + "|" + rowData.get(2) + "|" + rowData.get(3);
	 	            Invoice invoice = invoiceMap.get(key);
	 	            
	 	                invoice = new Invoice(rowData.get(0), date, Township.valueOf(rowData.get(2).toUpperCase()), rowData.get(3));
	 	                invoiceMap.put(key, invoice);
	 	                invoices.add(invoice);

	 	            InvoiceDetail detail = new InvoiceDetail(rowData.get(4), Double.parseDouble(rowData.get(5)), Double.parseDouble(rowData.get(6)), Double.parseDouble(rowData.get(7)));
	 	            detail.setInvoice(invoice);
	 	            invoice.getInvoiceDetails().add(detail);
	 	            invoiceDetails.add(detail);

	 	            invoiceMap.put(key, invoice);

	 	            rowNumber++;
	 	        }

	 	        // Check JSON length
	 	        invoices.forEach(invoice -> {
	 	            invoiceRepo.save(invoice);
	 	        });

	 	        return ResponseEntity.ok(new ArrayList<>(invoiceMap.values()));
	 	    } catch (IOException e) {
	 	        e.printStackTrace();
	 	        return ResponseEntity.badRequest().body("Error occurred while processing the Excel file");
	 	    }
	 	}

}
