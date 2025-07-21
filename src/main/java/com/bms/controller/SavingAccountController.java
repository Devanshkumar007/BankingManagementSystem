package com.bms.controller;

import com.bms.model.SavingAccount;
import com.bms.service.SavingAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/saving-accounts")
@CrossOrigin(origins = {"http://localhost:6969", "http://127.0.0.1:6969"})
public class SavingAccountController {

	@Autowired
    SavingAccountService savingAccountService;

    @PostMapping // POST /api/saving-accounts
    public ResponseEntity<SavingAccount> addSavingAccount(@RequestBody SavingAccount savingAccount) {
        SavingAccount newSavingAccount = savingAccountService.addSavingAccount(savingAccount);
        if (newSavingAccount != null) {
            return new ResponseEntity<>(newSavingAccount, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/{id}") // GET /api/saving-accounts/{id}
    public ResponseEntity<SavingAccount> getSavingAccountById(@PathVariable int id) {
        SavingAccount savingAccount = savingAccountService.findById(id);
        if (savingAccount != null) {
            return new ResponseEntity<>(savingAccount, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}") // DELETE /api/saving-accounts/{id}
    public ResponseEntity<Void> removeSavingAccount(@PathVariable int id) {
        if (savingAccountService.removeSavingAccount(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping // PUT /api/saving-accounts (requires 'updateSavingAccount' implementation)
    public ResponseEntity<SavingAccount> updateSavingAccount(@RequestBody SavingAccount savingAccount) {
        // **TODO: Implement updateSavingAccount in SavingAccountServiceImpl first**
        SavingAccount updatedAccount = savingAccountService.updateSavingAccount(savingAccount);
        if (updatedAccount != null) {
            return new ResponseEntity<>(updatedAccount, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}/balance") // GET /api/saving-accounts/{id}/balance
    public ResponseEntity<Double> getSavingAccountBalance(@PathVariable int id) {
        SavingAccount savingAccount = savingAccountService.findById(id);
        if (savingAccount != null) {
            double balance = savingAccountService.getBalance(savingAccount);
            return new ResponseEntity<>(balance, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}/disable") // PUT /api/saving-accounts/{id}/disable
    public ResponseEntity<SavingAccount> disableSavingAccount(@PathVariable int id) {
        SavingAccount savingAccount = savingAccountService.findById(id);
        if (savingAccount != null) {
            SavingAccount disabledAccount = savingAccountService.disableAccount(savingAccount);
            return new ResponseEntity<>(disabledAccount, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}/enable") // PUT /api/saving-accounts/{id}/enable
    public ResponseEntity<SavingAccount> enableSavingAccount(@PathVariable int id) {
        SavingAccount savingAccount = savingAccountService.findById(id);
        if (savingAccount != null) {
            SavingAccount enabledAccount = savingAccountService.enableAccount(savingAccount);
            return new ResponseEntity<>(enabledAccount, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}