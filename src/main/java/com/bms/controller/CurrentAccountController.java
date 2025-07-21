package com.bms.controller;

import com.bms.model.CurrentAccount;
import com.bms.service.CurrentAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/current-accounts")
@CrossOrigin(origins = {"http://localhost:6969", "http://127.0.0.1:6969"})
public class CurrentAccountController {

	@Autowired
    CurrentAccountService currentAccountService;

 
    @PostMapping // POST /api/current-accounts
    public ResponseEntity<CurrentAccount> addCurrentAccount(@RequestBody CurrentAccount currentAccount) {
        CurrentAccount newCurrentAccount = currentAccountService.addCurrentAccount(currentAccount);
        if (newCurrentAccount != null) {
            return new ResponseEntity<>(newCurrentAccount, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/{id}") // GET /api/current-accounts/{id}
    public ResponseEntity<CurrentAccount> getCurrentAccountById(@PathVariable int id) {
        CurrentAccount currentAccount = currentAccountService.findById(id);
        if (currentAccount != null) {
            return new ResponseEntity<>(currentAccount, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}") // DELETE /api/current-accounts/{id}
    public ResponseEntity<Void> removeCurrentAccount(@PathVariable int id) {
        if (currentAccountService.removeCurrentAccount(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping // PUT /api/current-accounts (requires an 'updateCurrentAccount' implementation)
    public ResponseEntity<CurrentAccount> updateCurrentAccount(@RequestBody CurrentAccount currentAccount) {
        // **TODO: Implement updateCurrentAccount in CurrentAccountServiceImpl first**
        CurrentAccount updatedAccount = currentAccountService.updateCurrentAccount(currentAccount);
        if (updatedAccount != null) {
            return new ResponseEntity<>(updatedAccount, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}/balance") // GET /api/current-accounts/{id}/balance
    public ResponseEntity<Double> getCurrentAccountBalance(@PathVariable int id) {
        CurrentAccount currentAccount = currentAccountService.findById(id);
        if (currentAccount != null) {
            double balance = currentAccountService.getBalance(currentAccount);
            return new ResponseEntity<>(balance, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}/disable") // PUT /api/current-accounts/{id}/disable
    public ResponseEntity<CurrentAccount> disableCurrentAccount(@PathVariable int id) {
        CurrentAccount currentAccount = currentAccountService.findById(id);
        if (currentAccount != null) {
            CurrentAccount disabledAccount = currentAccountService.disableAccount(currentAccount);
            return new ResponseEntity<>(disabledAccount, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}/enable") // PUT /api/current-accounts/{id}/enable
    public ResponseEntity<CurrentAccount> enableCurrentAccount(@PathVariable int id) {
        CurrentAccount currentAccount = currentAccountService.findById(id);
        if (currentAccount != null) {
            CurrentAccount enabledAccount = currentAccountService.enableAccount(currentAccount);
            return new ResponseEntity<>(enabledAccount, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}