package com.bms.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bms.model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
		
}
