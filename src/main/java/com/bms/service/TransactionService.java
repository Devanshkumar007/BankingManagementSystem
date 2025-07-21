package com.bms.service;

import java.util.List;

import com.bms.model.Transaction;

public interface TransactionService {

	Transaction createTransaction(Transaction t);
	Boolean removeTransaction(int id);
	Transaction findById(int id);
	List<Transaction> findByAccountNo(int id);	
	List<Transaction> findAll();
	
}
