package com.mit.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.mit.dao.InvoiceDetailRepo;
import com.mit.dao.InvoiceRepo;
import com.mit.dto.InvoiceDetailDto;
import com.mit.dto.InvoiceDto;
import com.mit.entity.InvoiceDetail;
import com.mit.method.InvoiceDetailInf;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class InvoiceDetailService implements InvoiceDetailInf{
	
	private final InvoiceDetailRepo invoiceDetailRepo;
	private final InvoiceRepo invoiceRepo;

	@Override
	public List<InvoiceDetail> createInvoiceDetail(List<InvoiceDetailDto> invoiceDetailDtos) {
		
		var allInvoiceDetails = invoiceDetailDtos.stream().map(invDetail ->invDetail.toEntity(invDetail)).collect(Collectors.toList());
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
		
		
		System.out.println(id+"\n"+invoiceDetailDtos);
		
		var invoiceDetails = invoiceDetailRepo.findAllInvoiceDetailsWithInvoice(id);
		var invoice = invoiceRepo.findById(id).get();
		
		//for Delete and Update
		
		for(InvoiceDetail detail : invoiceDetails) {
			
			var invoiceDetailIds = invoiceDetailDtos.stream().map(idd -> idd.id()).toList(); 


			System.out.println(invoiceDetailDtos);
			System.out.println(invoiceDetailIds);
			if( invoiceDetailIds.contains(detail.getInvoiceDetailId())  ) {
				
					var updateInvoiceDetailDto = invoiceDetailDtos.stream().filter(idd -> idd.id()==detail.getInvoiceDetailId()).toList().get(0);
					var updateInvoiceDetail = InvoiceDetailDto.toEntity(updateInvoiceDetailDto);
					
					updateInvoiceDetail.setInvoiceDetailId(updateInvoiceDetailDto.id());
					updateInvoiceDetail.setInvoice(invoice);
					
					System.out.println(updateInvoiceDetail);
					
					invoiceDetailRepo.save(updateInvoiceDetail);
			
				
				
			}else if(invoiceDetailIds.contains(null)) {
				System.out.println("Sure");
				var detailId = detail.invoiceDetailId;
				System.out.println(detailId);
				this.deleteInvoiceDetail(detailId);
			}
			
			
//			var idList = invoiceDetailDtos.stream().map(idd -> idd.id()).toList();
//			System.out.println(idList+"lists");
//			if(!idList.contains(detail.invoiceDetailId)) {
//				System.out.println(detail.invoiceDetailId);
//				this.deleteInvoiceDetail(detail.invoiceDetailId);
//				
//			}else {
//				detail.setInvoice(invoice);
//				System.out.println(detail);
//				invoiceDetailRepo.save(detail);
//			}
//			
		}
		
		//for Add
		for(InvoiceDetailDto invoiceDetailDto : invoiceDetailDtos) {
			if(invoiceDetailDto.id() == null) {
				var result = InvoiceDetailDto.toEntity(invoiceDetailDto);
				result.setInvoice(invoice);
				invoiceDetailRepo.save(result);
				
			}
		}
		
		
		
		
		//remove
//		var invoiceDetails = invoiceDetailRepo.findAllInvoiceDetailsWithInvoice(id);
//		for(InvoiceDetail invoiceDetail : invoiceDetails) {
//			this.deleteInvoiceDetail(invoiceDetail.invoiceDetailId);
//		}
//		System.out.println(invoiceDetailDtos);
//		//create
//		for(InvoiceDetailDto detailDto :invoiceDetailDtos) {
//			var invoiceDetail = InvoiceDetailDto.toEntity(detailDto);
//			invoiceDetail.setInvoiceDetailId(detailDto.id());
//			invoiceDetailRepo.save(invoiceDetail);
//		}
	}

	@Override
	public void deleteInvoiceDetail(Integer id) {
		if(invoiceDetailRepo.existsById(id)){
			invoiceDetailRepo.deleteById(id);
			System.out.println("Work");
		}else {
			
			System.out.println("Bad Request");
		}


	}
	
	

}
