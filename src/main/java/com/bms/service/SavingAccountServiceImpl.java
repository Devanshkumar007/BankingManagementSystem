package com.bms.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import com.bms.dao.SavingAccountRepository;
import com.bms.model.Account;
import com.bms.model.SavingAccount;
import com.bms.model.Transaction;

import jakarta.transaction.Transactional;

public class SavingAccountServiceImpl implements SavingAccountService {

	@Autowired
	SavingAccountRepository savingRepo;
	
	@Override
	@Transactional
	public SavingAccount addSavingAccount(SavingAccount account) {
		SavingAccount newSavingAccount = account;
		savingRepo.save(newSavingAccount);
		return newSavingAccount;
	}

	@Override
	@Transactional
	public Boolean removeSavingAccount(int id) {
		// TODO Auto-generated method stub
		Optional<SavingAccount> opt = savingRepo.findById(id);
		if(opt.get() == null) return false;
		savingRepo.deleteById(id);
		return true;
	}

	@Override
	@Transactional
	public SavingAccount updateSavingAccount(SavingAccount account) {
		//TODO
		return account;
	}

	@Override
	public SavingAccount findById(int id) {
		Optional<SavingAccount> opt = savingRepo.findById(id);
		if(opt.get() == null) return null;
		return opt.get();
	}

	@Override
	public double getBalance(SavingAccount ac) {
		// TODO Auto-generated method stub
		return ac.getBalance();
	
	}

	@Override
	public SavingAccount disableAccount(SavingAccount ac) {
		// TODO Auto-generated method stub
		SavingAccount account = savingRepo.findById(ac.getAccountNo()).orElse(null);
		if( account !=null ) account.setStatus(false);
		return account;
	}
}
