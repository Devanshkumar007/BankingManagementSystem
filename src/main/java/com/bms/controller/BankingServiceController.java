package com.bms.controller;

import com.bms.model.Transaction;
import com.bms.service.BankingService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/banking") // A common base path for banking operations
@CrossOrigin(origins = {"http://localhost:6969", "http://127.0.0.1:6969","https://devanshkumar007.github.io"}) // Allow your frontend origin
public class BankingServiceController {

	private static final Logger log = LoggerFactory.getLogger(BankingServiceController.class);
	
	@Autowired
    BankingService bankingService;

    /**
     * Endpoint for withdrawing money from an account.
     * POST /api/banking/withdraw
     * Request Body: { "accountId": 123, "amount": 500 }
     */
	
    @PostMapping("/withdraw")
    public ResponseEntity<Transaction> withdrawMoney(@RequestBody WithdrawalDepositRequest request) {
    	log.debug("withdraw money :" + request);
        Transaction transaction = bankingService.withdrawMoney(request.getAccountId(), request.getAmount());
        if (transaction != null) {
            return new ResponseEntity<>(transaction, HttpStatus.OK); // Or HttpStatus.CREATED if a new transaction is the primary result
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Insufficient balance or account not found
    }

    /**
     * Endpoint for depositing money into an account.
     * POST /api/banking/deposit
     * Request Body: { "accountId": 123, "amount": 1000 }
     */
    
    @PostMapping("/deposit")
    public ResponseEntity<Transaction> depositMoney(@RequestBody WithdrawalDepositRequest request) {
        Transaction transaction = bankingService.depositMoney(request.getAccountId(), request.getAmount());
        if (transaction != null) {
            return new ResponseEntity<>(transaction, HttpStatus.OK); // Or HttpStatus.CREATED
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Account not found
    }

    /**
     * Endpoint for transferring money between two accounts.
     * POST /api/banking/transfer
     * Request Body: { "senderAccountId": 123, "receiverAccountId": 456, "amount": 200 }
     */
    @PostMapping("/transfer")
    public ResponseEntity<String> transferMoney(@RequestBody TransferRequest request) {
    	System.out.println("request to transfer " + request);
        boolean success = bankingService.transferWithinAccounts(
                request.getSenderAccountId(),
                request.getReceiverAccountId(),
                request.getAmount()
        );
        if (success) {
            return new ResponseEntity<>("Transfer successful!", HttpStatus.OK);
        }
        return new ResponseEntity<>("Transfer failed. Insufficient funds or invalid accounts.", HttpStatus.BAD_REQUEST);
    }

    // --- Inner DTO Classes for Request Bodies ---
    // These help in defining the expected JSON structure for requests
    // You can put these in a separate 'dto' package if they become numerous

    static class WithdrawalDepositRequest {
        private int accountId;
        private int amount;

        // Getters and Setters
        public int getAccountId() { return accountId; }
        public void setAccountId(int accountId) { this.accountId = accountId; }
        public int getAmount() { return amount; }
        public void setAmount(int amount) { this.amount = amount; }
		@Override
		public String toString() {
			return "Request [accountId=" + accountId + ", amount=" + amount + "]";
		}
        
    }

    static class TransferRequest {
        private int senderAccountId;
        private int receiverAccountId;
        private int amount;

        // Getters and Setters
        public int getSenderAccountId() { return senderAccountId; }
        public void setSenderAccountId(int senderAccountId) { this.senderAccountId = senderAccountId; }
        public int getReceiverAccountId() { return receiverAccountId; }
        public void setReceiverAccountId(int receiverAccountId) { this.receiverAccountId = receiverAccountId; }
        public int getAmount() { return amount; }
        public void setAmount(int amount) { this.amount = amount; }
		@Override
		public String toString() {
			return "TransferRequest [senderAccountId=" + senderAccountId + ", receiverAccountId=" + receiverAccountId
					+ ", amount=" + amount + "]";
		}
        
    }
}