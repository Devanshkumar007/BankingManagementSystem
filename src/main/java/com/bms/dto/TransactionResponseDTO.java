package com.bms.dto;

import com.bms.model.Transaction;

import java.sql.Date;

public class TransactionResponseDTO {

    private int transactionId;
    private Date date;
    private String type;
    private Integer amount;
    private int accountNo;

    public TransactionResponseDTO(Transaction transaction) {
        this.transactionId = transaction.getTransactionId();
        this.date = transaction.getDate();
        this.type = transaction.getType();
        this.amount = transaction.getAmount();
        this.accountNo = transaction.getAccount() != null ? transaction.getAccount().getAccountNo() : 0;
    }

    // Getters for all fields
    public int getTransactionId() {
        return transactionId;
    }

    public Date getDate() {
        return date;
    }

    public String getType() {
        return type;
    }

    public Integer getAmount() {
        return amount;
    }

    public int getAccountNo() {
        return accountNo;
    }
}
