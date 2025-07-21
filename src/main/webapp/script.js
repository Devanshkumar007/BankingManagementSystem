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
    }, 10000); // Clear message after 10 seconds
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

// --- Helper function to render an array of objects as a table ---
// This function takes an array of data objects and the ID of the container where the table will be rendered.
function renderTable(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous content in the container

    // If no data or empty array, display a message and exit
    if (!data || data.length === 0) {
        container.textContent = 'No data found.';
        return;
    }

    // Create table elements
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    // Collect all unique keys from all objects to ensure all columns are present, especially for polymorphic types
    const allKeys = new Set();
    data.forEach(item => {
        for (const key in item) {
            allKeys.add(key);
        }
    });

    // Convert Set of keys to an array and sort them alphabetically for consistent column order
    const headers = Array.from(allKeys).sort();

    // Create table header row
    const headerRow = document.createElement('tr');
    headers.forEach(key => {
        const th = document.createElement('th');
        // Convert camelCase keys to a more readable Title Case (e.g., 'phoneNo' -> 'Phone No')
        th.textContent = key.replace(/^./, str => str.toUpperCase());
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Create table rows for each data item
    data.forEach(item => {
        const row = document.createElement('tr');
        headers.forEach(key => {
            const td = document.createElement('td');
            let value = item[key];

            // Special handling for nested objects (like 'person' in Account, 'account' in Transaction)
            // or for arrays (like 'accounts' in Person, 'transactions' in Account)
            if (key === 'person' && value && value.id) {
                // Display key details for associated Person
                td.textContent = `ID: ${value.id}, Name: ${value.name}`;
            } else if (key === 'account' && value && value.accountNo) {
                // Display key details for associated Account
                td.textContent = `Acc No: ${value.accountNo}, Type: ${value.type}`;
            } else if (Array.isArray(value)) {
                // For arrays, just show the count to avoid deep nesting in tables
                td.textContent = `[${value.length} items]`;
            } else if (typeof value === 'object' && value !== null) {
                // Generic handling for other complex nested objects
                td.textContent = `[Object]`;
            } else {
                // For simple values (strings, numbers, booleans, dates)
                td.textContent = value !== null ? value : ''; // Display empty string for null values
            }
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    container.appendChild(table); // Add the complete table to the container
}

// --- Helper function to render a single object's details (e.g., from 'Get by ID' actions) ---
// Displays details in a definition list format (dt for key, dd for value)
function renderObjectDetails(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous content

    // If no data, display a message and exit
    if (!data) {
        container.textContent = 'No data found.';
        return;
    }

    const dl = document.createElement('dl'); // Create a definition list
    dl.classList.add('object-details'); // Add a class for specific styling

    for (const key in data) {
        const dt = document.createElement('dt'); // Definition term (for the key/label)
        // Convert camelCase keys to a more readable Title Case
        dt.textContent = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) + ':';
        dl.appendChild(dt);

        const dd = document.createElement('dd'); // Definition description (for the value)
        let value = data[key];

        // Special handling for specific nested objects/arrays to display more detail
        if (key === 'person' && value && value.id) {
            dd.textContent = `ID: ${value.id}, Name: ${value.name}`;
        } else if (key === 'account' && value && value.accountNo) {
            dd.textContent = `Acc No: ${value.accountNo}, Type: ${value.type}`;
        } else if (Array.isArray(value)) {
            // For nested arrays, create an unordered list to show individual items
            if (value.length > 0) {
                 const ul = document.createElement('ul');
                 ul.style.listStyle = 'none'; // Remove default bullet points
                 ul.style.paddingLeft = '10px'; // Add some left padding
                 value.forEach(item => {
                     const li = document.createElement('li');
                     // Customize display based on the type of array items
                     if (key === 'accounts' && item.accountNo) {
                        li.textContent = `Account: ${item.accountNo} (Type: ${item.type}, Balance: ${item.balance})`;
                     } else if (key === 'transactions' && item.transactionId) {
                         li.textContent = `Transaction: ${item.transactionId} (Type: ${item.type}, Amount: ${item.amount})`;
                     } else if (item.id) { // Generic item with an ID
                         li.textContent = `ID: ${item.id}`;
                     } else { // Fallback for other unhandled objects in arrays
                         li.textContent = `[Object]`;
                     }
                     ul.appendChild(li);
                 });
                 dd.appendChild(ul);
            } else {
                dd.textContent = `[No ${key} linked]`; // Message for empty arrays
            }

        } else if (typeof value === 'object' && value !== null) {
            // Fallback for other generic nested objects
            dd.textContent = `[Object]`;
        } else {
            // For simple values, display value or 'N/A' if null
            dd.textContent = value !== null ? value : 'N/A';
        }
        dl.appendChild(dd);
    }
    container.appendChild(dl); // Add the complete definition list to the container
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


// --- Update Person ---
document.getElementById('updatePersonForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const person = {
        id: parseInt(document.getElementById('updatePersonId').value),
        name: document.getElementById('updatePersonName').value,
        phoneNo: document.getElementById('updatePersonPhone').value,
        address: document.getElementById('updatePersonAddress').value,
        role: document.getElementById('updatePersonRole').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/persons`, { // Assuming PUT /api/persons is used for update
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(person)
        });

        if (response.ok) {
            const updatedPerson = await response.json();
            displayMessage('updatePersonMessage', `Person ${updatedPerson.id} updated successfully!`, 'success');
            document.getElementById('updatePersonForm').reset();
        } else if (response.status === 404) {
            displayMessage('updatePersonMessage', 'Error: Person not found for update.', 'error');
        } else {
            const errorText = await response.text();
            displayMessage('updatePersonMessage', `Error updating person: ${errorText}`, 'error');
        }
    } catch (error) {
        displayMessage('updatePersonMessage', `Network error: ${error.message}`, 'error');
        console.error('Error:', error);
    }
});

// --- Delete Account from Person ---
document.getElementById('deleteAccountFromPersonForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const personId = parseInt(document.getElementById('deleteAccPersonId').value);
    const accountId = parseInt(document.getElementById('deleteAccountId').value);

    // Assuming a DELETE request to /api/persons/{personId}/accounts/{accountId}
    // You might also use a POST/PUT with a request body if DELETE is not suitable for your backend's design
    try {
        const response = await fetch(`${API_BASE_URL}/persons/${personId}/accounts/${accountId}`, {
            method: 'DELETE', // Assuming DELETE is used for this specific action
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok || response.status === 200) { // Backend might return 200 OK or 204 No Content
            const updatedPerson = await response.json(); // Backend might return updated person or nothing
            displayMessage('deleteAccountMessage', `Account ${accountId} deleted from Person ${personId} successfully!`, 'success');
            document.getElementById('deleteAccountFromPersonForm').reset();
        } else if (response.status === 404) {
            displayMessage('deleteAccountMessage', 'Error: Person or Account not found.', 'error');
        } else {
            const errorText = await response.text();
            displayMessage('deleteAccountMessage', `Error deleting account: ${errorText}`, 'error');
        }
    } catch (error) {
        displayMessage('deleteAccountMessage', `Network error: ${error.message}`, 'error');
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
    // Get the container for displaying person data
    const container = document.getElementById('personDataContainer');
    container.textContent = 'Fetching...'; // Show loading message

    if (!personId) {
        container.textContent = 'Please enter a Person ID.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/persons/${personId}`);
        if (response.ok) {
            const person = await response.json();
            // Use the helper function to render single object details
            renderObjectDetails(person, 'personDataContainer');
        } else if (response.status === 404) {
            container.textContent = `Person with ID ${personId} not found.`;
        } else {
            const errorText = await response.text();
            container.textContent = `Error: ${errorText}`;
        }
    } catch (error) {
        container.textContent = `Network error: ${error.message}`;
        console.error('Error:', error);
    }
}

// --- Get Account by ID ---
async function getAccount() {
    const accountId = document.getElementById('getAccountId').value;
    // Get the container for displaying account data
    const container = document.getElementById('accountDataContainer');
    container.textContent = 'Fetching...'; // Show loading message

    if (!accountId) {
        container.textContent = 'Please enter an Account ID.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`); // Using generic account endpoint
        if (response.ok) {
            const account = await response.json();
            // Use the helper function to render single object details
            renderObjectDetails(account, 'accountDataContainer');
        } else if (response.status === 404) {
            container.textContent = `Account with ID ${accountId} not found.`;
        } else {
            const errorText = await response.text();
            container.textContent = `Error: ${errorText}`;
        }
    } catch (error) {
        container.textContent = `Network error: ${error.message}`;
        console.error('Error:', error);
    }
}

// --- Get Transactions by Account ID ---
async function getTransactionsByAccount() {
    const accountId = document.getElementById('getTransactionsAccountId').value;
    // Get the container for displaying transactions data
    const container = document.getElementById('transactionsDataContainer');
    container.textContent = 'Fetching...'; // Show loading message

    if (!accountId) {
        container.textContent = 'Please enter an Account ID.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/transactions/account/${accountId}`);
        if (response.ok) {
            const transactions = await response.json();
            // Use the helper function to render data as a table
            renderTable(transactions, 'transactionsDataContainer');
        } else if (response.status === 204) { // Handle 204 No Content if list is empty
            container.textContent = `No transactions found for Account ID ${accountId}.`;
        }
        else {
            const errorText = await response.text();
            container.textContent = `Error: ${errorText}`;
        }
    } catch (error) {
        container.textContent = `Network error: ${error.message}`;
        console.error('Error:', error);
    }
}

// --- Fetch and Display All Persons ---
async function getAllPersons() {
    // Get the container for displaying all persons data
    const container = document.getElementById('allPersonsDataContainer');
    container.textContent = 'Fetching all persons...'; // Show loading message
    try {
        const response = await fetch(`${API_BASE_URL}/persons`);
        if (response.ok) {
            const persons = await response.json();
            // Use the helper function to render data as a table
            renderTable(persons, 'allPersonsDataContainer');
        } else if (response.status === 204) { // Handle 204 No Content if list is empty
            container.textContent = 'No persons found.';
        }
        else {
            const errorText = await response.text();
            container.textContent = `Error fetching all persons: ${errorText}`;
        }
    } catch (error) {
        container.textContent = `Network error: ${error.message}`;
        console.error('Error:', error);
    }
}

// --- Fetch and Display All Accounts ---
async function getAllAccounts() {
    // Get the container for displaying all accounts data
    const container = document.getElementById('allAccountsDataContainer');
    container.textContent = 'Fetching all accounts...'; // Show loading message
    try {
        const response = await fetch(`${API_BASE_URL}/accounts`);
        if (response.ok) {
            const accounts = await response.json();
            // Use the helper function to render data as a table
            renderTable(accounts, 'allAccountsDataContainer');
        } else if (response.status === 204) { // Handle 204 No Content if list is empty
            container.textContent = 'No accounts found.';
        }
        else {
            const errorText = await response.text();
            container.textContent = `Error fetching all accounts: ${errorText}`;
        }
    } catch (error) {
        container.textContent = `Network error: ${error.message}`;
        console.error('Error:', error);
    }
}

// --- Fetch and Display All Transactions ---
async function getAllTransactions() {
    // Get the container for displaying all transactions data
    const container = document.getElementById('allTransactionsDataContainer');
    container.textContent = 'Fetching all transactions...'; // Show loading message
    try {
        const response = await fetch(`${API_BASE_URL}/transactions`);
        if (response.ok) {
            const transactions = await response.json();
            // Use the helper function to render data as a table
            renderTable(transactions, 'allTransactionsDataContainer');
        } else if (response.status === 204) { // Handle 204 No Content if list is empty
            container.textContent = 'No transactions found.';
        }
        else {
            const errorText = await response.text();
            container.textContent = `Error fetching all transactions: ${errorText}`;
        }
    } catch (error) {
        container.textContent = `Network error: ${error.message}`;
        console.error('Error:', error);
    }
}

// Initialize field visibility on page load
document.addEventListener('DOMContentLoaded', toggleAccountFields);