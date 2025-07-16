package com.bms.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bms.dao.TransactionRepository;
import com.bms.model.Transaction;

@Service
public class TransactionServiceImpl implements TransactionService{

	@Autowired
	TransactionRepository transRepo;
	
	@Override
	public Transaction createTransaction(Transaction t) {
		// TODO Auto-generated method stub
		if(transRepo.findById(t.getTransactionId())!=null) return null;
		return transRepo.save(t);
	}

	@Override
	public Boolean removeTransaction(int id) {
		if(transRepo.findById(id)==null) return false;
		transRepo.deleteById(id);
		return true;
	}

	@Override
	public Transaction findById(int id) {
		// TODO Auto-generated method stub
		Transaction t = transRepo.findById(id).orElse(null);
		return t;
	}

	@Override
	public List<Transaction> findByAccountNo(int id) {
		return transRepo.findByAccountId(id);
	}

}
