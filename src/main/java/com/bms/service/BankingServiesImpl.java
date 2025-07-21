package com.bms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bms.controller.TransactionController;
import com.bms.dao.AccountRepository;
import com.bms.dao.TransactionRepository;
import com.bms.model.Account;
import com.bms.model.Transaction;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class BankingServiesImpl implements BankingService {

    private final TransactionController transactionController;

	@Autowired
	TransactionRepository transRepo;
	
	@Autowired
	AccountRepository accRepo;
	
	@Autowired
	AccountService accService;
	
	@Autowired
	TransactionService transService;

    BankingServiesImpl(TransactionController transactionController) {
        this.transactionController = transactionController;
    }
	
	@Override
	public Transaction withdrawMoney(int id,int amount) {
		Account acc = accService.findById(id);
		if(acc.getBalance()<amount) return null;
		acc.setBalance(acc.getBalance()-amount);
		accService.updateAccount(acc);
		Transaction transaction = new Transaction(0,"withdraw from account",acc,amount);
		transService.createTransaction(transaction);
		transRepo.save(transaction);
		return transaction;
	}
	
	
	@Override
	public Transaction depositMoney(int id,int amount){
		Account acc = accService.findById(id);
		acc.setBalance(acc.getBalance()+amount);
		Transaction transaction = new Transaction(0,"deposit to account",acc,amount);
		transService.createTransaction(transaction);
		transRepo.save(transaction);
		return transaction;
		
	}
	
	
	@Override
	public boolean transferWithinAccounts(int sender , int receiver , int amount) {
		System.out.println("request to transfer from " + sender + " to receiver " + receiver + " amount "+ amount);
		Account senderacc = accRepo.findById(sender).orElse(null);
		Account receiveracc = accRepo.findById(receiver).orElse(null);
		
//		if(senderacc==null || receiveracc==null) return false;
		if(senderacc.getBalance() < amount) return false;
		
		
		senderacc.setBalance(senderacc.getBalance()-amount);
		receiveracc.setBalance(receiveracc.getBalance()+amount);
		
		Transaction transaction = new Transaction(0,"credited amount "+amount ,receiveracc,amount);
		Transaction transaction2 = new Transaction(0,"debited amount "+amount, senderacc,amount);
		transService.createTransaction(transaction);
		transService.createTransaction(transaction2);
		
		transRepo.save(transaction);
		transRepo.save(transaction2);
		
		return true;
	}


	
	
	
}
