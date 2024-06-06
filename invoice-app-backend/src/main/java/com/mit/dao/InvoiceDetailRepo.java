package com.mit.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mit.entity.InvoiceDetail;

public interface InvoiceDetailRepo extends JpaRepository<InvoiceDetail, Integer> {

	 @Query("SELECT invDetail FROM InvoiceDetail invDetail JOIN Invoice inv ON invDetail.invoice.invoiceId = ?1")
	 List<InvoiceDetail> findAllInvoiceDetailsWithInvoice(Integer id);


}
