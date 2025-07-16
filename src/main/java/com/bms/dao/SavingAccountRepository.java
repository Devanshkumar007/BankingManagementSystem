package com.bms.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bms.model.SavingAccount;

@Repository
public interface SavingAccountRepository extends JpaRepository<SavingAccount, Integer>{

}
