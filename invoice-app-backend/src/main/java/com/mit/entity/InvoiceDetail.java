package com.mit.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor

public class InvoiceDetail {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer invoiceDetailId;
	public String item;
	public Integer price;
	public Integer amount;
	public Integer totalAmount;
	
	@ManyToOne()
	public Invoice invoice;

	public InvoiceDetail(String item, Integer price, Integer amount, Integer totalAmount) {
		super();
		this.item = item;
		this.price = price;
		this.amount = amount;
		this.totalAmount = totalAmount;
	}

	
	

}
