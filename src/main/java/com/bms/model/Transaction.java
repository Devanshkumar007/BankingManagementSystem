package com.bms.model;

import java.sql.Date;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;

@Entity
public class Transaction {
	
	@SequenceGenerator(name ="transgen", initialValue = 100001, allocationSize=1)
	
	@Id 
	@GeneratedValue(generator="transgen", strategy = GenerationType.SEQUENCE) 
	private int transactionId ; 
	private Date date; 
	private String type;
	private Integer amount ;
	
	@ManyToOne
	@JoinColumn(name = "accountNo")
	@JsonBackReference("account-transactions")
	Account account;
	
	
	public Transaction(int transactionId, String type , Account account , Integer amount) {
		super();
		this.transactionId = transactionId;
		this.date = Date.valueOf(LocalDate.now());
		this.type = type;
		this.amount = amount;
		this.account = account ;
	}
	public Transaction() {
		super();
		this.amount = 0;
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
	public Account getAccount() {
		return account;
	}
	public void setAccount(Account account) {
		this.account = account;
	}
	public void setAmount(Integer amount) {
		this.amount = amount;
	}
	public Integer getAmount() {
		return amount==null ? 0 : amount;
	}
	public void setAmount(int amount) {
		this.amount = amount;
	}
	@Override
	public String toString() {
		return "Transaction [transactionId=" + transactionId + ", date=" + date + ", type=" + type + ", amount="
				+ amount + "parent Account= " + account.getAccountNo() +" "+account.getType() +" ]";
	}
	
}
	