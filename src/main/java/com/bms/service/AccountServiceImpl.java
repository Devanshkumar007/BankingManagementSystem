package com.bms.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bms.dao.AccountRepository;
import com.bms.model.Account;

import jakarta.transaction.Transactional;

@Service
public class AccountServiceImpl implements AccountService{

	@Autowired
	AccountRepository acRepo;
	
	@Override
	@Transactional
	public Account addAccount(Account c) {
		if( acRepo.findById(c.getAccountNo()).isPresent() ) return null; 
		acRepo.save(c);
		return c;
	}

	@Override
	@Transactional
	public Boolean removeAccount(int id) {
	    Optional<Account> opt = acRepo.findById(id);
	    if(opt.isEmpty()) return false;
	    acRepo.deleteById(id);
	    return true;
	}


	@Override
	@Transactional
	public Account updateAccount(Account c) {
		//TODO
		return c;
	}

	
	@Override
	public Account findById(int id) {
	    Optional<Account> opt = acRepo.findById(id);
	    return opt.orElse(null);
	}

	@Override
	public List<Account> findall() {
		// TODO Auto-generated method stub
		return acRepo.findAll();
	}


}
