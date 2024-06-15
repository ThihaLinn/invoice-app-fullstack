package com.mit.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.mit.dao.InvoiceDetailRepo;
import com.mit.dao.InvoiceRepo;
import com.mit.dto.InvoiceDetailDto;
import com.mit.dto.InvoiceDto;
import com.mit.entity.Invoice;
import com.mit.entity.InvoiceDetail;
import com.mit.method.InvoiceDetailInf;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class InvoiceDetailService implements InvoiceDetailInf{
	
	private final InvoiceDetailRepo invoiceDetailRepo;
	private final InvoiceRepo invoiceRepo;

	@Override
	public List<InvoiceDetail> createInvoiceDetail(List<InvoiceDetailDto> invoiceDetailDtos) {
		
		var allInvoiceDetails = invoiceDetailDtos.stream().map(InvoiceDetailDto::toEntity).collect(Collectors.toList());
        return invoiceDetailRepo.saveAll((Iterable<InvoiceDetail>) allInvoiceDetails);
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

	@Override
	public void updateInvoiceDetail(Integer id, List<InvoiceDetailDto> invoiceDetailDtos) {
		
		var invoice = invoiceRepo.findByInvoiceId(id).get();
		var invoiceDetails = invoiceDetailRepo.findByInvoiceInvoiceId(id);
		

		
		//For Add 
		var toAdd = invoiceDetailDtos.stream().filter(idd -> idd.id() == null)
				.toList().stream().map(InvoiceDetailDto::toEntity).toList();;
	    toAdd.forEach((iDetail) -> {
	    	iDetail.setInvoice(invoice);
	    	invoiceDetailRepo.save(iDetail);
	    });
		
		
		
		//For Update And Delete
		var toUpdate = invoiceDetailDtos.stream().filter(idd -> idd.id() != null).toList();
		System.out.println("Data From User :"+toUpdate);
		System.out.println("Data From DB   :"+invoiceDetails);
		
		var updatedInvoiceDetailsIds = toUpdate.stream().map(idd -> idd.id()).toList();
		var outOfDateInvoiceDetailsIds = invoiceDetails.stream().map(idd -> idd.invoiceDetailId).toList();
		
		
		forDeleteAndUpdate(outOfDateInvoiceDetailsIds,updatedInvoiceDetailsIds,toUpdate, invoice);
		


		
//		if(toUpdate.size()!= 0) {
//			invoiceDetails.stream().forEach((iDetail) -> {
//				toUpdate.stream().forEach((update) -> {
//					//Update
//					System.out.println(iDetail.invoiceDetailId.equals(update.id()));
//					if(iDetail.invoiceDetailId.equals(update.id())) {
//						var updatedDetail =InvoiceDetailDto.toEntity(update);
//						updatedDetail.setInvoiceDetailId(iDetail.invoiceDetailId);
//						updatedDetail.setInvoice(invoice);
//						System.out.println("updated invoice detail where id ="+iDetail.invoiceDetailId);
//						invoiceDetailRepo.save(updatedDetail);
//
//					//Delete
//					}else {
//						System.out.println("Deleted invoice detail where id ="+iDetail.invoiceDetailId);
//						invoiceDetailRepo.deleteById(iDetail.invoiceDetailId);
//					}
//
//				});
//			});
//		}
		
		System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
		
	}

	@Override
	public void deleteInvoiceDetail(Integer id) {
		if(invoiceDetailRepo.existsById(id)){
			invoiceDetailRepo.deleteById(id);;
			System.out.println("Work");
		}else {
			
			System.out.println("Bad Request");
		}


	}
	
	public  List<InvoiceDetailDto> changetoUnsave(Integer id,List<InvoiceDetailDto> invoiceDetailDtos) {
			
			var invoiceDetails = invoiceRepo.findByInvoiceId(id).get().invoiceDetails;
			System.out.println("From Db"+invoiceDetails);
			System.out.println("From User"+invoiceDetailDtos);
			var invoiceDetailDto = new ArrayList<InvoiceDetailDto>();
			
			var updatedInvoiceDetailsIds = invoiceDetailDtos.stream().map(idd -> idd.id()).toList();
			var outOfDateInvoiceDetailsIds = invoiceDetails.stream().map(idd -> idd.invoiceDetailId).toList();
			
			updatedInvoiceDetailsIds.stream().forEach(uId ->{
				if(!outOfDateInvoiceDetailsIds.contains(uId)) {
					var update = invoiceDetailDtos.stream().filter(ivd -> ivd.id()==uId).toList().get(0);
					update = new InvoiceDetailDto(null, update.item(), update.price(),update.quantity(), update.setAmount());
					invoiceDetailDto.add(update);
				}else {
					var update = invoiceDetailDtos.stream().filter(ivd -> ivd.id()==uId).toList().get(0);
					invoiceDetailDto.add(update);
				}
			});
			
			System.out.println("cange :"+invoiceDetailDto);
			
			return invoiceDetailDto;
		}
	
	private void toUpdateInvoiceDetail(List<Integer> outOfDateInvoiceDetailsIds ,List<Integer> updatedInvoiceDetailsIds,List<InvoiceDetailDto> toUpdate,Invoice invoice) {
		outOfDateInvoiceDetailsIds.stream().forEach((odId) -> {
					
					if(updatedInvoiceDetailsIds.contains(odId)) {
						var updateDetail = toUpdate.stream().filter(idd -> idd.id().equals(odId)).toList().get(0);
						var finalStae = InvoiceDetailDto.toEntity(updateDetail);
						finalStae.setInvoice(invoice);
						finalStae.invoiceDetailId = odId;
						invoiceDetailRepo.save(finalStae);
					}
					
				});
	}
	
	private void toDeleteInvoiceDetail(List<Integer> outOfDateInvoiceDetailsIds ,List<Integer> updatedInvoiceDetailsIds) {
		outOfDateInvoiceDetailsIds.stream().forEach((odId) -> {
					
					if(!updatedInvoiceDetailsIds.contains(odId)) { 
	
						invoiceDetailRepo.deleteByInvoiceDetailId(odId);


					}
				});
	}
	
	@Transactional
	private void forDeleteAndUpdate(List<Integer> outOfDateInvoiceDetailsIds ,List<Integer> updatedInvoiceDetailsIds,List<InvoiceDetailDto> toUpdate,Invoice invoice) {
		toUpdateInvoiceDetail(outOfDateInvoiceDetailsIds, updatedInvoiceDetailsIds, toUpdate, invoice);
		toDeleteInvoiceDetail(outOfDateInvoiceDetailsIds, updatedInvoiceDetailsIds);
	}
	
	public  ByteArrayInputStream generateExcel(List<Invoice> invoices) throws Exception {
		 invoices.stream().forEach(System.out::println);

		    invoices = invoices.stream().map(inv -> invoiceRepo.findById(inv.getInvoiceId()).orElse(null)).toList();

		    try (Workbook workbook = new XSSFWorkbook()) {
		        Sheet sheet = workbook.createSheet("Data");

		        // Create header row
		        Row headerRow = sheet.createRow(0);
		        String[] headers = {"Invoice Id", "Casher Name", "Date", "Township", "Remark", "Invoice Detail Id", "Item", "Price", "Quantity", "Set Amount", "Total Amount"};
		        for (int i = 0; i < headers.length; i++) {
		            Cell cell = headerRow.createCell(i);
		            cell.setCellValue(headers[i]);
		        }

		        // Create cell styles
		        CellStyle style = workbook.createCellStyle();
		        style.setAlignment(HorizontalAlignment.CENTER);
		        style.setVerticalAlignment(VerticalAlignment.CENTER);

		        CellStyle rightAlignStyle = workbook.createCellStyle();
		        rightAlignStyle.setAlignment(HorizontalAlignment.RIGHT);
		        rightAlignStyle.setVerticalAlignment(VerticalAlignment.CENTER);

		        // Fill data rows
		        int rowIndex = 1; // Start after header row
		        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		        for (Invoice invoice : invoices) {
		            if (invoice == null) continue;

		            int detailsCount = invoice.getInvoiceDetails().size();
		            int startRow = rowIndex;
		            double totalAmount = 0;

		            // Fill invoice data
		            for (int i = 0; i < detailsCount; i++) {
		                Row dataRow = sheet.createRow(rowIndex++);
		                if (i == 0) { // First row for this invoice, set the main invoice fields
		                    Cell cell = dataRow.createCell(0);
		                    cell.setCellValue(invoice.getInvoiceId());
		                    cell.setCellStyle(rightAlignStyle);

		                    cell = dataRow.createCell(1);
		                    cell.setCellValue(invoice.getCasherName());
		                    cell.setCellStyle(style);

		                    cell = dataRow.createCell(2);
		                    // Format date to dd/MM/yyyy
		                    String formattedDate = invoice.getDate().format(dateFormatter);
		                    cell.setCellValue(formattedDate);
		                    cell.setCellStyle(style);

		                    cell = dataRow.createCell(3);
		                    cell.setCellValue(invoice.getTownship().name());
		                    cell.setCellStyle(style);

		                    cell = dataRow.createCell(4);
		                    cell.setCellValue(invoice.getRemark());
		                    cell.setCellStyle(style);
		                }

		                // Fill invoice detail data
		                Cell cell = dataRow.createCell(5);
		                cell.setCellValue(invoice.getInvoiceDetails().get(i).getInvoiceDetailId());
		                cell.setCellStyle(rightAlignStyle);

		                cell = dataRow.createCell(6);
		                cell.setCellValue(invoice.getInvoiceDetails().get(i).getItem());
		                cell.setCellStyle(style);

		                cell = dataRow.createCell(7);
		                cell.setCellValue(invoice.getInvoiceDetails().get(i).getPrice());
		                cell.setCellStyle(rightAlignStyle);

		                cell = dataRow.createCell(8);
		                cell.setCellValue(invoice.getInvoiceDetails().get(i).getQuantity());
		                cell.setCellStyle(rightAlignStyle);

		                cell = dataRow.createCell(9);
		                cell.setCellValue(invoice.getInvoiceDetails().get(i).getSetAmount());
		                cell.setCellStyle(rightAlignStyle);

		                totalAmount += invoice.getInvoiceDetails().get(i).getSetAmount();
		            }

		            // Set Total Amount for the first row of the invoice
		            Row totalRow = sheet.getRow(startRow);
		            Cell totalAmountCell = totalRow.createCell(10);
		            totalAmountCell.setCellValue(totalAmount);
		            totalAmountCell.setCellStyle(rightAlignStyle);

		            // Merge cells for invoice data if there are two or more details
		            if (detailsCount > 1) {
		                CellRangeAddress mergedRegion = new CellRangeAddress(startRow, rowIndex - 1, 0, 0);
		                sheet.addMergedRegion(mergedRegion);
		                for (int j = startRow; j < rowIndex; j++) {
		                    Row row = sheet.getRow(j);
		                    Cell cell = row.getCell(0);
		                    if (cell == null) {
		                        cell = row.createCell(0);
		                    }
		                    cell.setCellStyle(rightAlignStyle);
		                }

		                for (int i = 1; i < 5; i++) { // Start from 1 to skip aligning the first column (Invoice Id)
		                    mergedRegion = new CellRangeAddress(startRow, rowIndex - 1, i, i);
		                    sheet.addMergedRegion(mergedRegion);
		                    for (int j = startRow; j < rowIndex; j++) {
		                        Row row = sheet.getRow(j);
		                        Cell cell = row.getCell(i);
		                        if (cell == null) {
		                            cell = row.createCell(i);
		                        }
		                        cell.setCellStyle(style);
		                    }
		                }

		                // Merge cells for Total Amount column
		                CellRangeAddress totalAmountRegion = new CellRangeAddress(startRow, rowIndex - 1, 10, 10);
		                sheet.addMergedRegion(totalAmountRegion);
		                for (int j = startRow; j < rowIndex; j++) {
		                    Row row = sheet.getRow(j);
		                    Cell cell = row.getCell(10);
		                    if (cell == null) {
		                        cell = row.createCell(10);
		                    }
		                    cell.setCellStyle(rightAlignStyle);
		                }
		            }
		        }

		        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
		            workbook.write(out);
		            return new ByteArrayInputStream(out.toByteArray());
		        }
		    } catch (Exception e) {
		        e.printStackTrace();
		        return null;
		    }
		}
	

}


