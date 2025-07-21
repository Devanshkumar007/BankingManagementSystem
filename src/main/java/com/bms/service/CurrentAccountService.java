package com.bms.service;

import com.bms.model.CurrentAccount;

public interface CurrentAccountService {

	CurrentAccount addCurrentAccount(CurrentAccount c);
	Boolean removeCurrentAccount(int id);
	CurrentAccount updateCurrentAccount(CurrentAccount c);
	CurrentAccount findById(int c);
	double getBalance(CurrentAccount ac);
	CurrentAccount disableAccount(CurrentAccount ac);
	CurrentAccount enableAccount(CurrentAccount ac);
	
}
