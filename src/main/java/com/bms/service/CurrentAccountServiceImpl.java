package com.bms.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bms.dao.CurrentAccountRepository;
import com.bms.model.CurrentAccount;
import jakarta.transaction.Transactional;


@Service
public class CurrentAccountServiceImpl implements CurrentAccountService{

//    private final AccountRepository accountDao;

	@Autowired
	CurrentAccountRepository currRepo;
	
	@Override
	@Transactional
	public CurrentAccount addCurrentAccount(CurrentAccount account) {
		if( currRepo.findById(account.getAccountNo()).isPresent() ) return null; 
		currRepo.save(account);
		return account;
	}

	@Override
	@Transactional
	public Boolean removeCurrentAccount(int id) {
		// TODO Auto-generated method stub
		Optional<CurrentAccount> opt = currRepo.findById(id);
		if(opt.get() == null) return false;
		currRepo.deleteById(id);
		return true;
	}

	@Override
	@Transactional
	public CurrentAccount updateCurrentAccount(CurrentAccount account) {
		//TODO
		return account;
	}

	@Override
	public CurrentAccount findById(int id) {
		// TODO Auto-generated method stub
		Optional<CurrentAccount> opt = currRepo.findById(id);
		if(opt.get() == null) return null;
		return opt.get();
	}

	@Override
	public double getBalance(CurrentAccount ac) {
		return ac.getBalance() ;
	}

	

	@Override
	public CurrentAccount disableAccount(CurrentAccount ac) {
		// TODO Auto-generated method stub
		Optional<CurrentAccount> opt = currRepo.findById(ac.getAccountNo());
		if(opt.get() == null) return null;
		opt.get().setStatus(false);
		return ac;
	}
	
	@Override
	public CurrentAccount enableAccount(CurrentAccount ac) {
		Optional<CurrentAccount> opt = currRepo.findById(ac.getAccountNo());
		if(opt.get() == null) return null;
		opt.get().setStatus(true);
		return ac;
	}
	
}
