package com.bms.model;

import java.sql.Date;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.annotation.Generated;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;


@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "account_type")
public class Account {
	
	@SequenceGenerator(name = "accno" , initialValue = 10000001 , allocationSize = 1)
	@Id
	@GeneratedValue( generator = "accno" , strategy = GenerationType.SEQUENCE)
	private int accountNo;
	private double balance;
	private String type;
	private Date openingDate;
	private Boolean status;
	
	@ManyToOne
	@JoinColumn(name = "person_id") // Proper FK column
	@JsonBackReference 
	Person person;

	public Account() {
		super();
		this.openingDate = Date.valueOf(LocalDate.now());
		this.status = true;
		// TODO Auto-generated constructor stub
	}

	public Account(int accountNo, String type, Person person) {
		super();
		this.accountNo = accountNo;
		this.balance = 0;
		this.type = type;
		this.person = person;
		this.openingDate = Date.valueOf(LocalDate.now());
		this.status = true;
	}

	public int getAccountNo() {
		return accountNo;
	}

	public void setAccountNo(int accountNo) {
		this.accountNo = accountNo;
	}

	public double getBalance() {
		return balance;
	}

	public void setBalance(double balance) {
		this.balance = balance;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Date getOpeningDate() {
		return openingDate;
	}

	public Boolean getStatus() {
		return status;
	}

	public void setStatus(Boolean status) {
		this.status = status;
	}

	public Person getPerson() {
		return person;
	}

	public void setPerson(Person person) {
		this.person = person;
	}

	@Override
	public String toString() {
		return "Account [accountNo=" + accountNo + ", balance=" + balance + ", type=" + type + ", openingDate="
				+ openingDate + ", status=" + status + ", person=" + person + "]";
	}
	
	
	
	
}
