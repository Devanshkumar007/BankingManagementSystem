package com.bms.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("saving acc")
public class SavingAccount extends Account {
	
	double interestRate;
	double minBalance;
	public SavingAccount(int accountNo, String type, Person person) {
		super(accountNo,type,person);
		this.interestRate = person.getRole().equals("customer") ? 6.5 : 8 ;
		this.minBalance = 0;
	}
	public SavingAccount() {
		super();
		this.interestRate = 6.5 ;
		this.minBalance = 0;
		// TODO Auto-generated constructor stub
	}
	public double getInterestRate() {
		return interestRate;
	}
	public void setInterestRate(double interestRate) {
		this.interestRate = interestRate;
	}
	public double getMinBalance() {
		return minBalance;
	}
	
	@Override
	public String toString() {
		return "Savings Account [accountNo=" + getAccountNo() + ", balance=" + getBalance() + ", openingDate="
				+ getOpeningDate() + ", status=" + getStatus() + ", person=" + person.getName() 
				+", interest rate =" + interestRate + ", minimun balance ="+ minBalance +"]";
	}
	
	
}
