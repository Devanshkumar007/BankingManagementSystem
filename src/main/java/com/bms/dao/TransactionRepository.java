package com.bms.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bms.model.Account;
import com.bms.model.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer>{
	
	@Query("SELECT t FROM Transaction t WHERE t.account.id = :id")
    List<Transaction> findByAccountId(int id);
}
