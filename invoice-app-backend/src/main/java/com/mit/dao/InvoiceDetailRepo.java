package com.mit.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.mit.entity.InvoiceDetail;

import jakarta.transaction.Transactional;

public interface InvoiceDetailRepo extends JpaRepository<InvoiceDetail, Integer> {

	 //@Query("SELECT id FROM InvoiceDetail id JOIN ON  id.invoice.invoiceId = ?1")
	 List<InvoiceDetail> findByInvoiceInvoiceId(Integer id);
	 
	 @Modifying
	 @Transactional
	 @Query("DELETE FROM InvoiceDetail id WHERE id.invoiceDetailId = :id")
	 void deleteByInvoiceDetailId(Integer id);


}
