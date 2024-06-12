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
	public Double price;
	public Double amount;
	public Double totalAmount;
	
	@ManyToOne()
	public Invoice invoice;

	public InvoiceDetail(String item, Double price, Double amount, Double totalAmount) {
		super();
		this.item = item;
		this.price = price;
		this.amount = amount;
		this.totalAmount = totalAmount;
	}

	@Override
	public String toString() {
		return "InvoiceDetail [invoiceDetailId=" + invoiceDetailId + ", item=" + item + ", price=" + price + ", amount="
				+ amount + ", totalAmount=" + totalAmount + "]";
	}

	
	

}
