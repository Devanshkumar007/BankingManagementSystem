package com.bms.service;

import java.util.List;

import com.bms.model.SavingAccount;
import com.bms.model.Transaction;

public interface SavingAccountService {

	SavingAccount addSavingAccount(SavingAccount c);
	Boolean removeSavingAccount(int id);
	SavingAccount updateSavingAccount(SavingAccount c);
	SavingAccount findById(int id);
	double getBalance(SavingAccount ac);
	SavingAccount disableAccount(SavingAccount ac);
	SavingAccount enableAccount(SavingAccount ac);
	
}
