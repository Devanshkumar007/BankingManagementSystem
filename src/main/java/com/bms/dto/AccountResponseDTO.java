package com.bms.dto;

import com.bms.model.Account;
import com.bms.model.Person;

public class AccountResponseDTO {

    private int accountNo;
    private double balance;
    private String type;
    private String openingDate;
    private boolean status;
    private String personName;

    public AccountResponseDTO(Account account) {
        this.accountNo = account.getAccountNo();
        this.balance = account.getBalance();
        this.type = account.getType();
        this.openingDate = account.getOpeningDate().toString();
        this.status = account.getStatus();
        
        Person person = account.getPerson();
        if (person != null) {
            this.personName = person.getName();
        } else {
            this.personName = "Not Linked";
        }
    }

    // Getters for all fields
    public int getAccountNo() {
        return accountNo;
    }

    public double getBalance() {
        return balance;
    }

    public String getType() {
        return type;
    }

    public String getOpeningDate() {
        return openingDate;
    }

    public boolean isStatus() {
        return status;
    }

    public String getPersonName() {
        return personName;
    }
}
