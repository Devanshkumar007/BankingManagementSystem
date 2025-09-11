// API Configuration
const API_BASE_URL = "http://localhost:6969/api"
const CURRENT_ACCOUNT_MIN_BALANCE = 10000

// Global state
let customers = []
let accounts = []
let transactions = []
let currentCustomerToDelete = null

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
})

function initializeApp() {
  // Show dashboard by default
  showSection("dashboard")

  // Load initial data
  refreshDashboard()
  loadCustomers()
  loadAccounts()
  loadTransactions()
}

function setupEventListeners() {
  // Navigation
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const section = link.getAttribute("data-section")
      showSection(section)

      // Update active nav link
      navLinks.forEach((l) => l.classList.remove("active"))
      link.classList.add("active")

      // Close mobile menu
      document.getElementById("navMenu").classList.remove("active")
    })
  })

  // Mobile menu toggle
  document.getElementById("navToggle").addEventListener("click", () => {
    document.getElementById("navMenu").classList.toggle("active")
  })

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none"
    }
  })
}

// Navigation Functions
function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll(".section")
  sections.forEach((section) => section.classList.remove("active"))

  // Show selected section
  document.getElementById(sectionId).classList.add("active")

  // Load section-specific data
  switch (sectionId) {
    case "customers":
      displayCustomers()
      break
    case "accounts":
      displayAccounts()
      break
    case "reports":
      loadReportsData()
      break
  }
}

// Dashboard Functions
async function refreshDashboard() {
  try {
    showLoading()

    // Fetch all data
    const [customersRes, accountsRes, transactionsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/persons`),
      fetch(`${API_BASE_URL}/accounts`),
      fetch(`${API_BASE_URL}/transactions`),
    ])

    customers = customersRes.ok ? await customersRes.json() : []
    accounts = accountsRes.ok ? await accountsRes.json() : []
    transactions = transactionsRes.ok ? await transactionsRes.json() : []

    updateDashboardStats()
    displayRecentTransactions()
  } catch (error) {
    console.error("Error refreshing dashboard:", error)
    showToast("Failed to refresh dashboard", "error")
  }
}

function updateDashboardStats() {
  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0)

  document.getElementById("totalCustomers").textContent = customers.length
  document.getElementById("totalAccounts").textContent = accounts.length
  document.getElementById("totalBalance").textContent = formatCurrency(totalBalance)
  document.getElementById("totalTransactions").textContent = transactions.length
}

function displayRecentTransactions() {
  const container = document.getElementById("recentTransactions")
  const recentTransactions = transactions.slice(-5).reverse()

  if (recentTransactions.length === 0) {
    container.innerHTML = '<p class="no-data">No recent transactions</p>'
    return
  }

  container.innerHTML = recentTransactions
    .map(
      (transaction) => `
        <div class="transaction-item">
            <div class="transaction-info">
			<div class="transaction-icon ${transaction.type.includes("deposit") || transaction.type.includes("credited") ? "deposit" : "withdraw"}">
			    <i class="fas fa-arrow-${transaction.type.includes("deposit") || transaction.type.includes("credited") ? "down" : "up"}"></i>
			</div>
                <div class="transaction-details">
                    <h4>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</h4>
                    <p>ID: ${transaction.transactionId} | Account: ${transaction.accountNo}</p>
                </div>
            </div>
            <div class="transaction-amount ${transaction.type.includes("deposit") || transaction.type.includes("credited") ? "positive" : "negative"}">
                ${transaction.type.includes("deposit") || transaction.type.includes("credited") ? "+" : "-"}${formatCurrency(transaction.amount)}
            </div>
        </div>
    `,
    )
    .join("")
}

// Customer Management Functions
async function loadCustomers() {
  try {
    const response = await fetch(`${API_BASE_URL}/persons`)
    if (response.ok) {
      customers = await response.json()
      displayCustomers()
    }
  } catch (error) {
    console.error("Error loading customers:", error)
  }
}

function displayCustomers() {
  const tbody = document.getElementById("customersTableBody")

  if (customers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="no-data">No customers found</td></tr>'
    return
  }

  tbody.innerHTML = customers
    .map(
      (customer) => `
        <tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td><i class="fas fa-phone"></i> ${customer.phoneNo}</td>
            <td><i class="fas fa-map-marker-alt"></i> ${customer.address}</td>
            <td><span class="badge badge-secondary">${customer.role}</span></td>
            <td>${customer.accounts ? customer.accounts.length : 0} accounts</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="editCustomer(${customer.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteCustomer(${customer.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("")
}

function filterCustomers() {
  const searchTerm = document.getElementById("customerSearch").value.toLowerCase()
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.phoneNo.includes(searchTerm) ||
      customer.role.toLowerCase().includes(searchTerm),
  )

  const tbody = document.getElementById("customersTableBody")
  tbody.innerHTML = filteredCustomers
    .map(
      (customer) => `
        <tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td><i class="fas fa-phone"></i> ${customer.phoneNo}</td>
            <td><i class="fas fa-map-marker-alt"></i> ${customer.address}</td>
            <td><span class="badge badge-secondary">${customer.role}</span></td>
            <td>${customer.accounts ? customer.accounts.length : 0} accounts</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="editCustomer(${customer.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteCustomer(${customer.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("")
}

async function handleAddCustomer(event) {
  event.preventDefault()

  const formData = {
    id: Number.parseInt(document.getElementById("customerId").value),
    name: document.getElementById("customerName").value,
    phoneNo: document.getElementById("customerPhone").value,
    address: document.getElementById("customerAddress").value,
    role: document.getElementById("customerRole").value,
  }

  try {
    const response = await fetch(`${API_BASE_URL}/persons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      showToast("Customer added successfully!", "success")
      closeModal("addCustomerModal")
      document.getElementById("addCustomerForm").reset()
      loadCustomers()
      refreshDashboard()
    } else if (response.status === 409) {
      showToast("Customer with this ID already exists", "error")
    } else {
      const errorText = await response.text()
      showToast(`Error: ${errorText}`, "error")
    }
  } catch (error) {
    showToast("Network error occurred", "error")
  }
}

// NEW: Update Customer Functions
async function editCustomer(customerId) {
  try {
    const response = await fetch(`${API_BASE_URL}/persons/${customerId}`)
    if (response.ok) {
      const customer = await response.json()

      // Populate the update form
      document.getElementById("updateCustomerId").value = customer.id
      document.getElementById("updateCustomerName").value = customer.name
      document.getElementById("updateCustomerPhone").value = customer.phoneNo
      document.getElementById("updateCustomerAddress").value = customer.address
      document.getElementById("updateCustomerRole").value = customer.role

      openModal("updateCustomerModal")
    } else {
      showToast("Customer not found", "error")
    }
  } catch (error) {
    showToast("Error loading customer data", "error")
  }
}

async function handleUpdateCustomer(event) {
  event.preventDefault()

  const customerId = Number.parseInt(document.getElementById("updateCustomerId").value)
  const formData = {
    id: customerId,
    name: document.getElementById("updateCustomerName").value,
    phoneNo: document.getElementById("updateCustomerPhone").value,
    address: document.getElementById("updateCustomerAddress").value,
    role: document.getElementById("updateCustomerRole").value,
  }

  try {
    const response = await fetch(`${API_BASE_URL}/persons/${customerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      showToast("Customer updated successfully!", "success")
      closeModal("updateCustomerModal")
      loadCustomers()
      refreshDashboard()
    } else {
      const errorText = await response.text()
      showToast(`Error: ${errorText}`, "error")
    }
  } catch (error) {
    showToast("Network error occurred", "error")
  }
}

// NEW: Delete Customer Functions
function deleteCustomer(customerId) {
  const customer = customers.find((c) => c.id === customerId)
  if (customer) {
    currentCustomerToDelete = customerId
    document.getElementById("deleteCustomerInfo").innerHTML = `
            <strong>Customer:</strong> ${customer.name}<br>
            <strong>ID:</strong> ${customer.id}<br>
            <strong>Accounts:</strong> ${customer.accounts ? customer.accounts.length : 0}
        `
    openModal("deleteCustomerModal")
  }
}

async function confirmDeleteCustomer() {
  if (!currentCustomerToDelete) return

  try {
    const response = await fetch(`${API_BASE_URL}/persons/${currentCustomerToDelete}`, {
      method: "DELETE",
    })

    if (response.ok) {
      showToast("Customer deleted successfully!", "success")
      closeModal("deleteCustomerModal")
      currentCustomerToDelete = null
      loadCustomers()
      refreshDashboard()
    } else {
      const errorText = await response.text()
      showToast(`Error: ${errorText}`, "error")
    }
  } catch (error) {
    showToast("Network error occurred", "error")
  }
}

// Account Management Functions
async function loadAccounts() {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts`)
    if (response.ok) {
      accounts = await response.json()
      displayAccounts()
    }
  } catch (error) {
    console.error("Error loading accounts:", error)
  }
}

function displayAccounts() {
  const tbody = document.getElementById("accountsTableBody")

  if (accounts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="no-data">No accounts found</td></tr>'
    return
  }

  tbody.innerHTML = accounts
    .map(
      (account) => `
        <tr>
            <td>${account.accountNo}</td>
            <td><span class="badge ${account.type === "saving acc" ? "badge-primary" : "badge-secondary"}">${account.type === "saving acc" ? "SAVINGS" : "CURRENT"}</span></td>
            <td>₹${formatCurrency(account.balance)}</td>
            <td>${account.personName ? `<i class="fas fa-user"></i> ${account.personName}` : '<span style="color: #a0aec0;">Not linked</span>'}</td>
            <td><span class="badge ${account.balance > 0 ? "badge-success" : "badge-danger"}">${account.balance > 0 ? "ACTIVE" : "INACTIVE"}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-danger" onclick="openDeleteAccountModal(${account.accountNo})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("")
}

function filterAccounts() {
  const searchTerm = document.getElementById("accountSearch").value.toLowerCase()
  const filteredAccounts = accounts.filter(
    (account) =>
      account.accountNo.toString().includes(searchTerm) ||
      (account.personName && account.personName.toLowerCase().includes(searchTerm)) ||
      account.type.toLowerCase().includes(searchTerm),
  )

  const tbody = document.getElementById("accountsTableBody")
  tbody.innerHTML = filteredAccounts
    .map(
      (account) => `
        <tr>
            <td>${account.accountNo}</td>
            <td><span class="badge ${account.type === "saving acc" ? "badge-primary" : "badge-secondary"}">${account.type === "saving acc" ? "SAVINGS" : "CURRENT"}</span></td>
            <td>₹${formatCurrency(account.balance)}</td>
            <td>${account.personName ? `<i class="fas fa-user"></i> ${account.personName}` : '<span style="color: #a0aec0;">Not linked</span>'}</td>
            <td><span class="badge ${account.balance > 0 ? "badge-success" : "badge-danger"}">${account.balance > 0 ? "ACTIVE" : "INACTIVE"}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-danger" onclick="openDeleteAccountModal(${account.accountNo})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("")
}

function toggleAccountTypeInfo() {
  const accountType = document.getElementById("accountType").value
  const infoDiv = document.getElementById("currentAccountInfo")

  if (accountType === "CurrentAccount") {
    infoDiv.style.display = "block"
  } else {
    infoDiv.style.display = "none"
  }
}

async function handleCreateAccount(event) {
  event.preventDefault()

  const accountType = document.getElementById("accountType").value
  const initialBalance = Number.parseFloat(document.getElementById("initialBalance").value)
  const personId = Number.parseInt(document.getElementById("accountPersonId").value)

  // Validate current account minimum balance
  if (accountType === "CurrentAccount" && initialBalance <= CURRENT_ACCOUNT_MIN_BALANCE) {
    showToast(
      `Current account requires initial balance greater than ₹${CURRENT_ACCOUNT_MIN_BALANCE.toLocaleString()}`,
      "error",
    )
    return
  }

  try {
    // Get person data
    const personResponse = await fetch(`${API_BASE_URL}/persons/${personId}`)
    if (!personResponse.ok) {
      showToast("Customer not found", "error")
      return
    }
    const personData = await personResponse.json()

    const accountData = {
      balance: initialBalance,
      type: accountType === "SavingAccount" ? "saving acc" : "current acc",
      person: personData,
    }

    const endpoint =
      accountType === "SavingAccount" ? `${API_BASE_URL}/saving-accounts` : `${API_BASE_URL}/current-accounts`

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accountData),
    })

    if (response.ok) {
      const newAccount = await response.json()
      showToast(`Account created successfully! Account No: ${newAccount.accountNo}`, "success")
      closeModal("createAccountModal")
      document.getElementById("createAccountForm").reset()
      loadAccounts()
      refreshDashboard()
    } else {
      const errorText = await response.text()
      showToast(`Error: ${errorText}`, "error")
    }
  } catch (error) {
    showToast("Network error occurred", "error")
  }
}

// NEW: Delete Account Functions
function openDeleteAccountModal(accountNo) {
  document.getElementById("deleteAccountId").value = accountNo
  openModal("deleteAccountModal")
}

async function handleDeleteAccount(event) {
  event.preventDefault()

  const accountId = Number.parseInt(document.getElementById("deleteAccountId").value)

  try {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
      method: "DELETE",
    })

    if (response.ok) {
      showToast("Account deleted successfully!", "success")
      closeModal("deleteAccountModal")
      document.getElementById("deleteAccountForm").reset()
      loadAccounts()
      refreshDashboard()
    } else {
      const errorText = await response.text()
      showToast(`Error: ${errorText}`, "error")
    }
  } catch (error) {
    showToast("Network error occurred", "error")
  }
}

// Banking Operations Functions
function showBankingTab(tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll("#banking .tab-content")
  tabContents.forEach((content) => content.classList.remove("active"))

  // Remove active class from all tab buttons
  const tabButtons = document.querySelectorAll("#banking .tab-btn")
  tabButtons.forEach((btn) => btn.classList.remove("active"))

  // Show selected tab content
  document.getElementById(`${tabName}Tab`).classList.add("active")

  // Add active class to clicked button
  event.target.classList.add("active")
}

async function handleWithdraw(event) {
  event.preventDefault()

  const accountId = Number.parseInt(document.getElementById("withdrawAccountId").value)
  const amount = Number.parseInt(document.getElementById("withdrawAmount").value)

  try {
    const response = await fetch(`${API_BASE_URL}/banking/withdraw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId, amount }),
    })

    if (response.ok) {
      const transaction = await response.json()
      showToast(`Withdrawal successful! Transaction ID: ${transaction.transactionId}`, "success")
      document.getElementById("withdrawForm").reset()
      refreshDashboard()
    } else {
      const errorText = await response.text()
      showToast(`Withdrawal failed: ${errorText}`, "error")
    }
  } catch (error) {
    showToast("Network error occurred", "error")
  }
}

async function handleDeposit(event) {
  event.preventDefault()

  const accountId = Number.parseInt(document.getElementById("depositAccountId").value)
  const amount = Number.parseInt(document.getElementById("depositAmount").value)

  try {
    const response = await fetch(`${API_BASE_URL}/banking/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId, amount }),
    })

    if (response.ok) {
      const transaction = await response.json()
      showToast(`Deposit successful! Transaction ID: ${transaction.transactionId}`, "success")
      document.getElementById("depositForm").reset()
      refreshDashboard()
    } else {
      const errorText = await response.text()
      showToast(`Deposit failed: ${errorText}`, "error")
    }
  } catch (error) {
    showToast("Network error occurred", "error")
  }
}

async function handleTransfer(event) {
  event.preventDefault()

  const senderAccountId = Number.parseInt(document.getElementById("senderAccountId").value)
  const receiverAccountId = Number.parseInt(document.getElementById("receiverAccountId").value)
  const amount = Number.parseInt(document.getElementById("transferAmount").value)

  try {
    const response = await fetch(`${API_BASE_URL}/banking/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderAccountId, receiverAccountId, amount }),
    })

    if (response.ok) {
      const message = await response.text()
      showToast(`Transfer successful! ${message}`, "success")
      document.getElementById("transferForm").reset()
      refreshDashboard()
    } else {
      const errorText = await response.text()
      showToast(`Transfer failed: ${errorText}`, "error")
    }
  } catch (error) {
    showToast("Network error occurred", "error")
  }
}

// Reports Functions
function showReportsTab(tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll("#reports .tab-content")
  tabContents.forEach((content) => content.classList.remove("active"))

  // Remove active class from all tab buttons
  const tabButtons = document.querySelectorAll("#reports .tab-btn")
  tabButtons.forEach((btn) => btn.classList.remove("active"))

  // Show selected tab content
  document.getElementById(`${tabName}Tab`).classList.add("active")

  // Add active class to clicked button
  event.target.classList.add("active")

  // Load data for specific tabs
  if (tabName === "allCustomers") {
    loadAllCustomersReport()
  } else if (tabName === "allAccounts") {
    loadAllAccountsReport()
  } else if (tabName === "allTransactions") {
    loadAllTransactionsReport()
  }
}

async function loadTransactions() {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`)
    if (response.ok) {
      transactions = await response.json()
    }
  } catch (error) {
    console.error("Error loading transactions:", error)
  }
}

function loadReportsData() {
  loadAllCustomersReport()
  loadAllAccountsReport()
  loadAllTransactionsReport()
}

function loadAllCustomersReport() {
  const tbody = document.getElementById("allCustomersTableBody")

  if (customers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="no-data">No customers found</td></tr>'
    return
  }

  tbody.innerHTML = customers
    .map(
      (customer) => `
        <tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.phoneNo}</td>
            <td>${customer.address}</td>
            <td><span class="badge badge-secondary">${customer.role}</span></td>
            <td>${customer.accounts ? customer.accounts.length : 0}</td>
        </tr>
    `,
    )
    .join("")
}

function loadAllAccountsReport() {
  const tbody = document.getElementById("allAccountsTableBody")

  if (accounts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="no-data">No accounts found</td></tr>'
    return
  }

  tbody.innerHTML = accounts
    .map(
      (account) => `
        <tr>
            <td>${account.accountNo}</td>
            <td><span class="badge ${account.type === "saving acc" ? "badge-primary" : "badge-secondary"}">${account.type === "saving acc" ? "Savings" : "Current"}</span></td>
            <td>${formatCurrency(account.balance)}</td>
            <td>${account.personName ? account.personName : "Not linked"}</td>
        </tr>
    `,
    )
    .join("")
}

function loadAllTransactionsReport() {
  const tbody = document.getElementById("allTransactionsTableBody")

  if (transactions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="no-data">No transactions found</td></tr>'
    return
  }

  tbody.innerHTML = transactions
    .map(
      (transaction) => `
        <tr>
            <td>${transaction.transactionId}</td>
            <td><span class="badge ${transaction.type.includes("deposit") || transaction.type.includes("credited") ? "badge-success" : "badge-danger"}">${transaction.type}</span></td>
            <td class="${transaction.type.includes("deposit") || transaction.type.includes("credited") ? "text-green" : "text-red"}">
                ${transaction.type.includes("deposit") || transaction.type.includes("credited") ? "+" : "-"}${formatCurrency(transaction.amount)}
            </td>
            <td>${transaction.accountNo}</td>
        </tr>
    `,
    )
    .join("")
}

async function performSearch() {
  const searchType = document.getElementById("searchType").value
  const searchId = document.getElementById("searchId").value
  const resultsContainer = document.getElementById("searchResults")

  if (!searchId) {
    showToast("Please enter an ID to search", "error")
    return
  }

  resultsContainer.innerHTML = '<div class="no-data">Searching...</div>'

  try {
    let endpoint = ""
    if (searchType === "person") {
      endpoint = `${API_BASE_URL}/persons/${searchId}`
    } else if (searchType === "account") {
      endpoint = `${API_BASE_URL}/accounts/${searchId}`
    } else if (searchType === "transactions") {
      endpoint = `${API_BASE_URL}/transactions/account/${searchId}`
    }

    const response = await fetch(endpoint)
    if (response.ok) {
      const data = await response.json()
      displaySearchResults(data, searchType)
    } else {
      resultsContainer.innerHTML = `<div class="no-data">${searchType} with ID ${searchId} not found</div>`
    }
  } catch (error) {
    resultsContainer.innerHTML = '<div class="no-data">Search failed</div>'
    showToast("Search failed", "error")
  }
}

function displaySearchResults(data, searchType) {
  const container = document.getElementById("searchResults")

  if (searchType === "person") {
    container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>Customer Details</h3>
                </div>
                <div class="card-content">
                    <div style="display: grid; gap: 15px;">
                        <div><strong>ID:</strong> ${data.id}</div>
                        <div><strong>Name:</strong> ${data.name}</div>
                        <div><strong>Phone:</strong> ${data.phoneNo}</div>
                        <div><strong>Address:</strong> ${data.address}</div>
                        <div><strong>Role:</strong> <span class="badge badge-secondary">${data.role}</span></div>
                        ${
                          data.accounts && data.accounts.length > 0
                            ? `
                            <div><strong>Accounts:</strong>
                                <div style="margin-top: 10px;">
                                    ${data.accounts
                                      .map(
                                        (account) => `
                                        <div style="background: #f7fafc; padding: 10px; border-radius: 6px; margin-bottom: 5px;">
                                            Account: ${account.accountNo} - ${formatCurrency(account.balance)}
                                        </div>
                                    `,
                                      )
                                      .join("")}
                                </div>
                            </div>
                        `
                            : "<div><strong>Accounts:</strong> No accounts linked</div>"
                        }
                    </div>
                </div>
            </div>
        `
  } else if (searchType === "account") {
    container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>Account Details</h3>
                </div>
                <div class="card-content">
                    <div style="display: grid; gap: 15px;">
                        <div><strong>Account No:</strong> ${data.accountNo}</div>
                        <div><strong>Type:</strong> <span class="badge badge-secondary">${data.type === "saving acc" ? "Savings" : "Current"}</span></div>
                        <div><strong>Balance:</strong> ${formatCurrency(data.balance)}</div>
                        ${data.personName ? `<div><strong>Customer:</strong> ${data.personName}</div>` : "<div><strong>Customer:</strong> Not linked</div>"}
                    </div>
                </div>
            </div>
        `
  } else if (searchType === "transactions" && Array.isArray(data)) {
    if (data.length === 0) {
      container.innerHTML = '<div class="no-data">No transactions found for this account</div>'
      return
    }

    container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>Account Transactions</h3>
                </div>
                <div class="card-content">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data
                                  .map(
                                    (transaction) => `
                                    <tr>
                                        <td>${transaction.transactionId}</td>
                                        <td><span class="badge ${transaction.type.includes("deposit") || transaction.type.includes("credited") ? "badge-success" : "badge-danger"}">${transaction.type}</span></td>
                                        <td class="${transaction.type.includes("deposit") || transaction.type.includes("credited") ? "text-green" : "text-red"}">
                                            ${transaction.type.includes("deposit") || transaction.type.includes("credited") ? "+" : "-"}${formatCurrency(transaction.amount)}
                                        </td>
                                    </tr>
                                `,
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `
  }
}

// Modal Functions
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block"
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
}

// Toast Functions
function showToast(message, type = "success") {
  const toast = document.getElementById("toast")
  const toastMessage = document.getElementById("toastMessage")

  toastMessage.textContent = message
  toast.className = `toast ${type}`
  toast.classList.add("show")

  setTimeout(() => {
    hideToast()
  }, 5000)
}

function hideToast() {
  const toast = document.getElementById("toast")
  toast.classList.remove("show")
}

// Utility Functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function showLoading() {
  // You can implement a loading spinner here if needed
  console.log("Loading...")
}
