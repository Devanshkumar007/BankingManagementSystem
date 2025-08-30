package com.bms.controller;

import com.bms.model.Transaction;
import com.bms.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = {"http://localhost:6969", "http://127.0.0.1:6969","https://froth-run-58409450.figma.site"})
public class TransactionController {

	@Autowired
    TransactionService transactionService;

    @PostMapping // POST /api/transactions
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        Transaction newTransaction = transactionService.createTransaction(transaction);
        if (newTransaction != null) {
            return new ResponseEntity<>(newTransaction, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.CONFLICT); // Transaction with ID might already exist
    }

    @GetMapping("/{id}") // GET /api/transactions/{id}
    public ResponseEntity<Transaction> getTransactionById(@PathVariable int id) {
        Transaction transaction = transactionService.findById(id);
        if (transaction != null) {
            return new ResponseEntity<>(transaction, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}") // DELETE /api/transactions/{id}
    public ResponseEntity<Void> removeTransaction(@PathVariable int id) {
        if (transactionService.removeTransaction(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/account/{accountId}") // GET /api/transactions/account/{accountId}
    public ResponseEntity<List<Transaction>> getTransactionsByAccountId(@PathVariable int accountId) {
        List<Transaction> transactions = transactionService.findByAccountNo(accountId);
        if (!transactions.isEmpty()) {
            return new ResponseEntity<>(transactions, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Or HttpStatus.NO_CONTENT if an empty list is expected
    }
    @GetMapping // <-- ADD THIS: GET /api/transactions to get all transactions
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.findAll();
        if (!transactions.isEmpty()) {
            return new ResponseEntity<>(transactions, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content if list is empty
    }
    
    @GetMapping("/people/{id}")
    public ResponseEntity<List<Transaction>> getTransactionByPersonId(@PathVariable int id){
    	List<Transaction> transactions = transactionService.findByPersonId(id);
    	if (!transactions.isEmpty()) {
            return new ResponseEntity<>(transactions, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
}