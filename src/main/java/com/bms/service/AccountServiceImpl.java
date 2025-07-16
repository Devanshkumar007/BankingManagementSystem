package com.bms.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bms.dao.AccountRepository;
import com.bms.model.Account;

import jakarta.transaction.Transactional;

@Service
public class AccountServiceImpl implements AccountService{

	@Autowired
	AccountRepository acDao;
	
	@Override
	@Transactional
	public Account addAccount(Account c) {
		Account newAccount = c;
		acDao.save(newAccount);
		return newAccount;
	}

	@Override
	@Transactional
	public Boolean removeAccount(int id) {
		// TODO Auto-generated method stub
		Optional<Account> opt = acDao.findById(id);
		if(opt.get() == null) return false;
		acDao.deleteById(id);
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
		// TODO Auto-generated method stub
		Optional<Account> opt = acDao.findById(id);
		if(opt.get() == null) return null;
		return opt.get();
	}

}
