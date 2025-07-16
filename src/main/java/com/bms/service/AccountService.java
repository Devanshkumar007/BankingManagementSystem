package com.bms.service;

import com.bms.model.Account;

public interface AccountService {
	Account addAccount(Account c);
	Boolean removeAccount(int id);
	Account updateAccount(Account c);
	Account findById(int c);
	
}
