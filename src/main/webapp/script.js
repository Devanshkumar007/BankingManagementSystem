const API_BASE_URL = 'http://localhost:6969/api'; // Make sure this matches your Spring Boot application's port and base path
const CURRENT_ACCOUNT_MIN_BALANCE = 10000; // Hardcoded min balance for client-side validation

// --- Helper function for displaying messages ---
function displayMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block'; // Ensure message is visible
    setTimeout(() => {
        element.textContent = '';
        element.className = 'message';
        element.style.display = 'none'; // Hide message after timeout
    }, 10000); // Clear message after 5 seconds
}

// --- Toggle Account Specific Fields and Validation Message ---
function toggleAccountFields() {
    const radioSavingAccount = document.getElementById('radioSavingAccount');
    const radioCurrentAccount = document.getElementById('radioCurrentAccount');
    const currentAccountMinBalanceMsg = document.getElementById('currentAccountMinBalanceMsg');

    currentAccountMinBalanceMsg.style.display = 'none'; // Hide validation message by default

    if (radioCurrentAccount.checked) {
        currentAccountMinBalanceMsg.textContent = `Initial balance must be greater than ${CURRENT_ACCOUNT_MIN_BALANCE}.`;
        currentAccountMinBalanceMsg.style.display = 'block'; // Show the requirement message
    }
}

// --- Add New Person ---
document.getElementById('addPersonForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const person = {
        id: parseInt(document.getElementById('personId').value),
        name: document.getElementById('personName').value,
        phoneNo: document.getElementById('personPhone').value,
        address: document.getElementById('personAddress').value,
        role: document.getElementById('personRole').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/persons`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(person)
        });

        if (response.ok) {
            const newPerson = await response.json();
            displayMessage('addPersonMessage', `Person added successfully! ID: ${newPerson.id}`, 'success');
            document.getElementById('addPersonForm').reset();
        } else if (response.status === 409) { // Conflict
            displayMessage('addPersonMessage', 'Error: Person with this ID already exists.', 'error');
        } else {
            const errorText = await response.text();
            displayMessage('addPersonMessage', `Error adding person: ${errorText}`, 'error');
        }
    } catch (error) {
        displayMessage('addPersonMessage', `Network error: ${error.message}`, 'error');
        console.error('Error:', error);
    }
});

// --- Create New Account (Saving or Current) ---
document.getElementById('createAccountForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const radioSavingAccount = document.getElementById('radioSavingAccount');
    const radioCurrentAccount = document.getElementById('radioCurrentAccount');

    let accountType = '';
    if (radioSavingAccount.checked) {
        accountType = 'SavingAccount';
    } else if (radioCurrentAccount.checked) {
        accountType = 'CurrentAccount';
    }

    const initialBalance = parseFloat(document.getElementById('createAccountBalance').value);
    const personId = parseInt(document.getElementById('createAccountPersonId').value);

    // Client-side validation for Current Account initial balance
    if (accountType === 'CurrentAccount' && initialBalance <= CURRENT_ACCOUNT_MIN_BALANCE) {
        displayMessage('createAccountMessage', `For Current Account, initial balance must be greater than ${CURRENT_ACCOUNT_MIN_BALANCE}.`, 'error');
        return; // Stop form submission
    }

    let personData;
    try {
        const personResponse = await fetch(`${API_BASE_URL}/persons/${personId}`);
        if (!personResponse.ok) {
            displayMessage('createAccountMessage', `Error: Person with ID ${personId} not found.`, 'error');
            return;
        }
        personData = await personResponse.json();
    } catch (error) {
        displayMessage('createAccountMessage', `Network error fetching person: ${error.message}`, 'error');
        console.error('Error fetching person:', error);
        return;
    }

    let accountData = {
        balance: initialBalance,
        type: accountType === 'SavingAccount' ? 'saving acc' : 'current acc', // Match discriminator value
        person: personData
    };
    let endpoint = '';

    if (accountType === 'SavingAccount') {
        // No interestRate input needed, backend sets it
        endpoint = `${API_BASE_URL}/saving-accounts`;
    } else if (accountType === 'CurrentAccount') {
        // No overdraftLimit input needed, backend sets it
        endpoint = `${API_BASE_URL}/current-accounts`;
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(accountData)
        });

        if (response.ok) {
            const newAccount = await response.json();
            displayMessage('createAccountMessage', `${accountType} added successfully! Acc No: ${newAccount.accountNo}`, 'success');
            document.getElementById('createAccountForm').reset();
            // No need to call toggleAccountFields after reset as no fields to hide/show
        } else {
            const errorText = await response.text();
            displayMessage('createAccountMessage', `Error adding ${accountType}: ${errorText}`, 'error');
        }
    } catch (error) {
        displayMessage('createAccountMessage', `Network error: ${error.message}`, 'error');
        console.error('Error:', error);
    }
});


// --- Link Existing Account to Person ---
document.getElementById('linkAccountForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const personId = parseInt(document.getElementById('linkPersonId').value);
    const accountId = parseInt(document.getElementById('linkAccountId').value);

    try {
        const response = await fetch(`${API_BASE_URL}/persons/${personId}/accounts/${accountId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const updatedPerson = await response.json();
            displayMessage('linkAccountMessage', `Account ${accountId} linked to Person ${personId} successfully!`, 'success');
            document.getElementById('linkAccountForm').reset();
        } else if (response.status === 404) {
             displayMessage('linkAccountMessage', `Error: Person or Account not found.`, 'error');
        }
        else {
            const errorText = await response.text();
            displayMessage('linkAccountMessage', `Error linking account: ${errorText}`, 'error');
        }
    } catch (error) {
        displayMessage('linkAccountMessage', `Network error: ${error.message}`, 'error');
        console.error('Error:', error);
    }
});


// --- Withdraw Money ---
document.getElementById('withdrawForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const accountId = parseInt(document.getElementById('withdrawAccountId').value);
    const amount = parseInt(document.getElementById('withdrawAmount').value);

    try {
        const response = await fetch(`${API_BASE_URL}/banking/withdraw`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accountId, amount })
        });

        if (response.ok) {
            const transaction = await response.json();
            displayMessage('withdrawMessage', `Withdrawal successful! Transaction ID: ${transaction.transactionId}`, 'success');
        } else {
            const errorText = await response.text();
            displayMessage('withdrawMessage', `Withdrawal failed: ${errorText}`, 'error');
        }
    } catch (error) {
        displayMessage('withdrawMessage', `Network error: ${error.message}`, 'error');
    }
});

// --- Deposit Money ---
document.getElementById('depositForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const accountId = parseInt(document.getElementById('depositAccountId').value);
    const amount = parseInt(document.getElementById('depositAmount').value);

    try {
        const response = await fetch(`${API_BASE_URL}/banking/deposit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accountId, amount })
        });

        if (response.ok) {
            const transaction = await response.json();
            displayMessage('depositMessage', `Deposit successful! Transaction ID: ${transaction.transactionId}`, 'success');
        } else {
            const errorText = await response.text();
            displayMessage('depositMessage', `Deposit failed: ${errorText}`, 'error');
        }
    } catch (error) {
        displayMessage('depositMessage', `Network error: ${error.message}`, 'error');
    }
});

// --- Transfer Money ---
document.getElementById('transferForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const senderAccountId = parseInt(document.getElementById('transferSenderAccountId').value);
    const receiverAccountId = parseInt(document.getElementById('transferReceiverAccountId').value);
    const amount = parseInt(document.getElementById('transferAmount').value);

    try {
        const response = await fetch(`${API_BASE_URL}/banking/transfer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ senderAccountId, receiverAccountId, amount })
        });

        if (response.ok) {
            const message = await response.text();
            displayMessage('transferMessage', `Transfer successful! ${message}`, 'success');
        } else {
            const errorText = await response.text();
            displayMessage('transferMessage', `Transfer failed: ${errorText}`, 'error');
        }
    } catch (error) {
        displayMessage('transferMessage', `Network error: ${error.message}`, 'error');
    }
});


// --- Get Person by ID ---
async function getPerson() {
    const personId = document.getElementById('getPersonId').value;
    const personDataElement = document.getElementById('personData');
    personDataElement.textContent = 'Fetching...';

    if (!personId) {
        personDataElement.textContent = 'Please enter a Person ID.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/persons/${personId}`);
        if (response.ok) {
            const person = await response.json();
            personDataElement.textContent = JSON.stringify(person, null, 2);
        } else if (response.status === 404) {
            personDataElement.textContent = `Person with ID ${personId} not found.`;
        } else {
            const errorText = await response.text();
            personDataElement.textContent = `Error: ${errorText}`;
        }
    } catch (error) {
        personDataElement.textContent = `Network error: ${error.message}`;
        console.error('Error:', error);
    }
}

// --- Get Account by ID ---
async function getAccount() {
    const accountId = document.getElementById('getAccountId').value;
    const accountDataElement = document.getElementById('accountData');
    accountDataElement.textContent = 'Fetching...';

    if (!accountId) {
        accountDataElement.textContent = 'Please enter an Account ID.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`); // Using generic account endpoint
        if (response.ok) {
            const account = await response.json();
            accountDataElement.textContent = JSON.stringify(account, null, 2);
        } else if (response.status === 404) {
            accountDataElement.textContent = `Account with ID ${accountId} not found.`;
        } else {
            const errorText = await response.text();
            accountDataElement.textContent = `Error: ${errorText}`;
        }
    } catch (error) {
        accountDataElement.textContent = `Network error: ${error.message}`;
        console.error('Error:', error);
    }
}

// --- Get Transactions by Account ID ---
async function getTransactionsByAccount() {
    const accountId = document.getElementById('getTransactionsAccountId').value;
    const transactionsDataElement = document.getElementById('transactionsData');
    transactionsDataElement.textContent = 'Fetching...';

    if (!accountId) {
        transactionsDataElement.textContent = 'Please enter an Account ID.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/transactions/account/${accountId}`);
        if (response.ok) {
            const transactions = await response.json();
            if (transactions.length > 0) {
                transactionsDataElement.textContent = JSON.stringify(transactions, null, 2);
            } else {
                transactionsDataElement.textContent = `No transactions found for Account ID ${accountId}.`;
            }
        } else if (response.status === 404) {
            transactionsDataElement.textContent = `No transactions found for Account ID ${accountId}.`;
        } else {
            const errorText = await response.text();
            transactionsDataElement.textContent = `Error: ${errorText}`;
        }
    } catch (error) {
        transactionsDataElement.textContent = `Network error: ${error.message}`;
        console.error('Error:', error);
    }
}

async function getAllPersons() {
    const allPersonsDataElement = document.getElementById('allPersonsData');
    allPersonsDataElement.textContent = 'Fetching all persons...';
    try {
        const response = await fetch(`${API_BASE_URL}/persons`);
        if (response.ok) {
            const persons = await response.json();
            if (persons.length > 0) {
                allPersonsDataElement.textContent = JSON.stringify(persons, null, 2);
            } else {
                allPersonsDataElement.textContent = 'No persons found.';
            }
        } else if (response.status === 204) { // Handle 204 No Content
            allPersonsDataElement.textContent = 'No persons found.';
        }
        else {
            const errorText = await response.text();
            allPersonsDataElement.textContent = `Error fetching all persons: ${errorText}`;
        }
    } catch (error) {
        allPersonsDataElement.textContent = `Network error: ${error.message}`;
        console.error('Error:', error);
    }
}

async function getAllAccounts() {
    const allAccountsDataElement = document.getElementById('allAccountsData');
    allAccountsDataElement.textContent = 'Fetching all accounts...';
    try {
        const response = await fetch(`${API_BASE_URL}/accounts`);
        if (response.ok) {
            const accounts = await response.json();
            if (accounts.length > 0) {
                allAccountsDataElement.textContent = JSON.stringify(accounts, null, 2);
            } else {
                allAccountsDataElement.textContent = 'No accounts found.';
            }
        } else if (response.status === 204) { // Handle 204 No Content
            allAccountsDataElement.textContent = 'No accounts found.';
        }
        else {
            const errorText = await response.text();
            allAccountsDataElement.textContent = `Error fetching all accounts: ${errorText}`;
        }
    } catch (error) {
        allAccountsDataElement.textContent = `Network error: ${error.message}`;
        console.error('Error:', error);
    }
}

async function getAllTransactions() {
    const allTransactionsDataElement = document.getElementById('allTransactionsData');
    allTransactionsDataElement.textContent = 'Fetching all transactions...';
    try {
        const response = await fetch(`${API_BASE_URL}/transactions`);
        if (response.ok) {
            const transactions = await response.json();
            if (transactions.length > 0) {
                allTransactionsDataElement.textContent = JSON.stringify(transactions, null, 2);
            } else {
                allTransactionsDataElement.textContent = 'No transactions found.';
            }
        } else if (response.status === 204) { // Handle 204 No Content
            allTransactionsDataElement.textContent = 'No transactions found.';
        }
        else {
            const errorText = await response.text();
            allTransactionsDataElement.textContent = `Error fetching all transactions: ${errorText}`;
        }
    } catch (error) {
        allTransactionsDataElement.textContent = `Network error: ${error.message}`;
        console.error('Error:', error);
    }
}

// Initialize field visibility on page load
document.addEventListener('DOMContentLoaded', toggleAccountFields);