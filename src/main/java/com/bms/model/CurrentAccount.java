package com.bms.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("current acc")
public class CurrentAccount extends Account{
	
	double overdraftLimit;
	double minBalance;
	public CurrentAccount(int accountNo, String type, Person person , double overdraftLimit) {
		super(accountNo,type,person);
		this.overdraftLimit = overdraftLimit;
		this.minBalance = 10000;
	}
	public CurrentAccount() {
		super();
		// TODO Auto-generated constructor stub
	}
	public double getOverdraftLimit() {
		return overdraftLimit;
	}
	public void setOverdraftLimit(double overdraftLimit) {
		this.overdraftLimit = overdraftLimit;
	}
	public double getMinBalance() {
		return minBalance;
	}
	public void setMinBalance(double minBalance) {
		this.minBalance = minBalance;
	}
	
	@Override 
	public String toString() {
		return "Current Account [accountNo=" + getAccountNo() + ", balance=" + getBalance() +  ", openingDate="
				+ getOpeningDate() + ", status=" + getStatus() + ", person=" + person.getName() 
				+", overdraft limit =" + overdraftLimit + ", minimun balance ="+ minBalance +"]";
	}
	
	
	
}
