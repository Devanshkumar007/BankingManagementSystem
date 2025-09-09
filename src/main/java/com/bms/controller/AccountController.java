package com.bms.controller;

import com.bms.dto.AccountResponseDTO;
import com.bms.model.Account;
import com.bms.service.AccountService;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = {"http://localhost:6969", "http://127.0.0.1:6969","https://devanshkumar007.github.io"})
public class AccountController {

	@Autowired
    AccountService accountService;

    @PostMapping // POST /api/accounts
    public ResponseEntity<Account> addAccount(@RequestBody Account account) {
        Account newAccount = accountService.addAccount(account);
        if (newAccount != null) {
            return new ResponseEntity<>(newAccount, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/{id}") // GET /api/accounts/{id}
    public ResponseEntity<AccountResponseDTO> getAccountById(@PathVariable int id) {
        Account account = accountService.findById(id);
        if (account != null) {
            AccountResponseDTO dto = new AccountResponseDTO(account);
            return new ResponseEntity<>(dto, HttpStatus.OK);
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

    
    @GetMapping
    public ResponseEntity<List<AccountResponseDTO>> getAllPersons(){
    	List<Account> accounts = accountService.findall();
        if (!accounts.isEmpty()) {
            List<AccountResponseDTO> dtos = accounts.stream()
                .map(AccountResponseDTO::new)
                .collect(Collectors.toList());
            return new ResponseEntity<>(dtos, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content if list is empty
    }
}