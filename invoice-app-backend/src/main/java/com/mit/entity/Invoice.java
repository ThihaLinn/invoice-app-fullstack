package com.mit.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.mit.type.Township;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Invoice {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer invoiceId;
	public String casherName;
	public LocalDate date ; 
    @Enumerated(EnumType.STRING)
	public Township township;
	public String remark;
	
	@OneToMany(mappedBy = "invoice",cascade = CascadeType.ALL,orphanRemoval = true)
	public List<InvoiceDetail> invoiceDetails = new ArrayList<InvoiceDetail>();

	public void addInvoiceDetail(InvoiceDetail invoiceDetail) {
		invoiceDetail.setInvoice(this);
		invoiceDetails.add(invoiceDetail);
	}
	
	

	public Invoice(String casherName ,LocalDate date,Township township, String remark) {
		super();
		this.casherName = casherName;
		this.date= date;
		this.township = township;
		this.remark = remark;
	}

	
	 
	
}
