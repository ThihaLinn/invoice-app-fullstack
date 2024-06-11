package com.mit.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mit.entity.Invoice;

public interface InvoiceRepo extends JpaRepository<Invoice, Integer> {

	@Query("SELECT i FROM Invoice i WHERE i.invoiceId=?1 OR i.casherName LIKE %?2% OR i.township LIKE %?2% OR i.remark LIKE %?2%")
	List<Invoice> findByInvoiceNameLikeAndCashierNumber(Integer keyword1,String keyword2);
	
	Optional<Invoice> findByInvoiceId(Integer Id);
 	
    List<Invoice> findAllByOrderByInvoiceIdDesc();   

	
}
