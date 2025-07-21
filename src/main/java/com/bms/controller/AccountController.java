package com.bms.controller;

import com.bms.model.Account;
import com.bms.service.AccountService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = {"http://localhost:6969", "http://127.0.0.1:6969"})
public class AccountController {

	@Autowired
    AccountService accountService;

    

    @PostMapping // POST /api/accounts
    public ResponseEntity<Account> addAccount(@RequestBody Account account) {
        // This will likely need more specific handling for Current/Saving accounts.
        // For now, it assumes a generic Account can be created.
        // You might consider DTOs here to differentiate account types.
        Account newAccount = accountService.addAccount(account);
        if (newAccount != null) {
            return new ResponseEntity<>(newAccount, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Or a more specific error
    }

    @GetMapping("/{id}") // GET /api/accounts/{id}
    public ResponseEntity<Account> getAccountById(@PathVariable int id) {
        Account account = accountService.findById(id);
        if (account != null) {
            return new ResponseEntity<>(account, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}") // DELETE /api/accounts/{id}
    public ResponseEntity<Void> removeAccount(@PathVariable int id) {
        if (accountService.removeAccount(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping // PUT /api/accounts (requires an 'updateAccount' implementation in service)
    public ResponseEntity<Account> updateAccount(@RequestBody Account account) {
        // **TODO: Implement updateAccount in AccountServiceImpl first**
        Account updatedAccount = accountService.updateAccount(account);
        if (updatedAccount != null) {
            return new ResponseEntity<>(updatedAccount, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    @GetMapping
    public ResponseEntity<List<Account>> getAllPersons(){
    	List<Account> accounts = accountService.findall();
        if (!accounts.isEmpty()) {
            return new ResponseEntity<>(accounts, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content if list is empty
    }
}