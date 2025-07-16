package com.bms.model;

import java.sql.Date;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;

@Entity
public class Transaction {
	
	@SequenceGenerator(name ="transaction", initialValue = 100001, allocationSize=1)
	
	@Id 
	@GeneratedValue(generator="transaction", strategy = GenerationType.SEQUENCE) 
	private int transactionId ; 
	private Date date; 
	private String type;
	private Integer amount ;
	
	@OneToOne
	@JoinColumn(name = "accountNo")
	Account account;
	
	
	public Transaction(int transactionId, String type) {
		super();
		this.transactionId = transactionId;
		this.date = Date.valueOf(LocalDate.now());
		this.type = type;
		this.amount = null;
	}
	public Transaction() {
		super();
		// TODO Auto-generated constructor stub
	}
	public int getTransactionId() {
		return transactionId;
	}
	public void setTransactionId(int transactionId) {
		this.transactionId = transactionId;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public int getAmount() {
		return amount;
	}
	public void setAmount(int amount) {
		this.amount = amount;
	}
	@Override
	public String toString() {
		return "Transaction [transactionId=" + transactionId + ", date=" + date + ", type=" + type + ", amount="
				+ amount + "]";
	}
	
}
	