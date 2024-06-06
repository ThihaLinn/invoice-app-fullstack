package com.mit.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mit.entity.Invoice;

public interface InvoiceRepo extends JpaRepository<Invoice, Integer> {

	@Query("SELECT i FROM Invoice i WHERE i.invoiceId=?1 OR i.casherName LIKE %?2%")
	List<Invoice> findByInvoiceNameLikeAndCashierNumber(Integer keyword1,String keyword2);
	
}
