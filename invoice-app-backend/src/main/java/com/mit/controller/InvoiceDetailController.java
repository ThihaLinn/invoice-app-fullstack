package com.mit.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
	 	                            if (DateUtil.isCellDateFormatted(currentCell)) {
	 	                                SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
	 	                                rowData.add(dateFormat.format(currentCell.getDateCellValue()));
	 	                            } else {
	 	                                rowData.add(String.valueOf(currentCell.getNumericCellValue()));
	 	                            }
	 	                            break;
	 	                        case BOOLEAN:
	 	                            rowData.add(String.valueOf(currentCell.getBooleanCellValue()));
	 	                            break;
	 	                        default:
	 	                            rowData.add("");
	 	                    }
	 	                }
	 	            }


	                // Validate date format (assuming the date is in the first column)
	                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
	                try {
	                    dateFormatter.parse(rowData.get(1)); // Adjust index if date is in a different column
	                } catch (DateTimeParseException e) {
	                    return ResponseEntity.badRequest().body("Row " + (rowNumber + 1) + ": Invalid date format in column 1. Expected format is dd/MM/yyyy.");
	                }
	                
	                Township township;
	                try {
	                    township = Township.valueOf(rowData.get(2).toUpperCase());
	                } catch (IllegalArgumentException e) {
	                    return ResponseEntity.badRequest().body("Row " + (rowNumber + 1) + ": Invalid township value in column 3. Expected one of " + Arrays.toString(Township.values()));
	                }

	                if (!invoiceService.isNumeric(rowData.get(columns - 3)) || 
	                    !invoiceService.isNumeric(rowData.get(columns - 2)) || 
	                    !invoiceService.isNumeric(rowData.get(columns - 1))) {
	                    return ResponseEntity.badRequest().body("Row " + (rowNumber + 1) + ", Columns " + (columns - 2) + " must be numeric value.");
	                }

	                String key = rowData.get(0) + "|" + rowData.get(1) + "|" + rowData.get(2) + "|" + rowData.get(3);
	                Invoice invoice = invoiceMap.get(key);
	                if (invoice == null) {
	                    invoice = new Invoice(rowData.get(0), convertStringToLocalDate(rowData.get(1)), Township.valueOf(rowData.get(2).toUpperCase()), rowData.get(3));
	                    invoiceMap.put(key, invoice);
	                    invoices.add(invoice);
	                }

	                InvoiceDetail detail = new InvoiceDetail(rowData.get(4), Double.parseDouble(rowData.get(5)), Double.parseDouble(rowData.get(6)), Double.parseDouble(rowData.get(7)));
	                detail.setInvoice(invoice);
	                invoice.getInvoiceDetails().add(detail);
	                invoiceDetails.add(detail);

	                rowNumber++;
	            }

	 	        // Save invoices and invoiceDetails (assuming you have a service to handle this)
	 	        invoiceRepo.saveAll(invoices);
	 	        //invoiceService.saveInvoiceDetails(invoiceDetails);

	 	        return ResponseEntity.ok("File uploaded successfully");

	 	    } catch (Exception e) {
	 	        e.printStackTrace();
	 	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the file.");
	 	    }
	 	}
	 	

	    private static final String DATE_FORMAT = "dd/MM/yyyy";

	    public static LocalDate convertStringToLocalDate(String dateString) throws DateTimeParseException {
	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_FORMAT);
	        return LocalDate.parse(dateString, formatter);
	    }

}
