package com.bms.service;

import com.bms.model.Transaction;

public interface BankingService {
	Transaction withdrawMoney(int id,int amount);
	Transaction depositMoney(int id, int amount);
	boolean transferWithinAccounts(int sender , int receiver , int amount);
}
