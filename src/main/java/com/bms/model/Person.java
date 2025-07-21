package com.bms.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;

@Entity
public class Person {
	
	@Id
	private int id ;
	private String name ;
	private String phoneNo ;
	private String address;
	private String role;
	
	
	
	@OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	List<Account> accounts = new ArrayList<>();
//	@OneToMany(mappedBy = "person")
//	private List<Account> accounts = new ArrayList<>();

	
	public Person(int id, String name, String phoneNo, String address, String role){
		super();
		this.id = id;
		this.name = name;
		this.phoneNo = phoneNo;
		this.address = address;
		this.role = role;
//		this.accounts = new ArrayList<>();
	}
	public Person() {
		super();
		// TODO Auto-generated constructor stub
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPhoneNo() {
		return phoneNo;
	}
	public void setPhoneNo(String phoneNo) {
		this.phoneNo = phoneNo;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public List<Account> getAccounts() {
		return accounts;
	}
	public void setAccounts(List<Account> accounts) {
		this.accounts = accounts;
	}
	@Override
	public String toString() {
		return "Person [id=" + id + ", name=" + name + ", phoneNo=" + phoneNo + ", address=" + address + ", role="
				+ role + ", accounts=" + accounts + "]";
	}
	
	
}
