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
	public Double quantity;
	public Double setAmount;
	
	@ManyToOne()
	public Invoice invoice;

	public InvoiceDetail(String item, Double price,Double quantity, Double setAmount) {
		super();
		this.item = item;
		this.price = price;
		this.quantity = quantity;
		this.setAmount = setAmount;
	}

	@Override
	public String toString() {
		return "InvoiceDetail [item=" + item + ", price=" + price + ", quantity=" + quantity + ", setAmount="
				+ setAmount + "]";
	}



	

}
