# **🏦 LOVELY BANK \- A Fun Way to Manage Banking**

Hey\! This is a simple but powerful banking management system. We built it with a **Spring Boot** backend and a dynamic **JavaScript** frontend. It's a great tool for handling everything from customer accounts to money transfers and reports\!

## **✨ Key Features**

Here's a look at what you can do with this app:

### **👥 User & Account Management**

* **Customer Lifecycle**: It's super easy to create, update, and delete customer records.  
* **Account Types**: We've got two kinds of accounts for you\!  
  * **💰 Savings Accounts**: These are nice and flexible with a minimum balance of **₹0**.  
  * **💰 Current Accounts**: These are a bit more serious and need a starting balance of at least **₹10,000**.  
* **Account Status**: You can turn accounts on and off whenever you need to\! ✅❌

### **➡️⬅️ Financial Transactions**

* **Deposits & Withdrawals**: Moving money is a breeze\! Just deposit or withdraw funds from any account.  
* **Transfers**: Sending money to someone else? Transfers between accounts are quick and easy.  
* **Transaction History**: Don't worry, we keep a log of every single transaction so you can always see what's happened.

### **📊 Reporting & Analytics**

* **Dashboard**: Get a quick overview of everything at a glance\! It shows you the total number of customers, accounts, and all the money in the bank.  
* **Comprehensive Reports**: You can also pull up detailed reports on all your customers, accounts, and transactions.  
* **Data Search**: Need to find something fast? Just search for a customer, account, or transaction by ID.

## **🛠️ Technology Stack**

Wondering what makes this app tick? Here's the rundown:

### **💻 Backend**

* **Framework**: [Spring Boot](https://spring.io/projects/spring-boot)  
* **Database**: **MySQL**  
* **ORM**: **Spring Data JPA** with Hibernate  
* **Build Tool**: Maven

### **🖥️ Frontend**

* **Core**: We've kept it simple with classic HTML5, CSS3, and JavaScript for a lightweight and fast experience.  
* **Styling**: It's got a clean, modern, and responsive design that looks great on any device.

## **🚀 Getting Started**

### **👇 Prerequisites**

Before we get the ball rolling, you'll need these installed:

* Java Development Kit (**JDK 17** or later)  
* A running **MySQL Database**

### **⚙️ Installation & Setup**

1. **💾 Database Configuration**:  
   * First, create a new MySQL database named bms.  
   * Then, just double-check the src/main/resources/application.properties file to make sure your database login info is correct.

spring.datasource.url=jdbc:mysql://localhost:3306/bms  
spring.datasource.username=root  
spring.datasource.password=password

2. **▶️ Run the Application**:  
   * Open your terminal and navigate to the project's main folder.  
   * Then, run this simple command:

./mvnw spring-boot:run

3. **🌐 Access the Application**:  
   * The app will fire up on port 6969\.  
   * Just open your browser and go to http://localhost:6969 to start using it\! Have fun\!

## **🔌 REST API Endpoints**

Here's a quick guide to all the API endpoints you can use. We've organized them into tables to make them super easy to read\!

### 

### **Customers (/api/persons)**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | / | Creates a new customer. |
| GET | /{id} | Retrieves a customer by ID. |
| PUT | / | Updates a customer's details. |
| DELETE | /{id} | Deletes a customer by ID. |
| GET | / | Gets a list of all customers. |
| POST | /{personId}/accounts/{accountId} | Links an existing account to a person. |
| DELETE | /{personId}/accounts/{accountId} | Unlinks an account from a person. |

### **Accounts (/api/accounts)**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | / | Creates a new account. |
| GET | /{id} | Retrieves an account by ID. |
| DELETE | /{id} | Deletes an account by ID. |
| GET | / | Gets a list of all accounts. |

### **Current Accounts (/api/current-accounts)**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | / | Creates a new current account. |
| GET | /{id} | Gets a current account by ID. |
| GET | /{id}/balance | Gets the balance of the account. |
| PUT | /{id}/disable | Disables the account. |
| PUT | /{id}/enable | Enables the account. |

### **Saving Accounts (/api/saving-accounts)**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | / | Creates a new saving account. |
| GET | /{id} | Gets a saving account by ID. |
| GET | /{id}/balance | Gets the balance of the account. |
| PUT | /{id}/disable | Disables the account. |
| PUT | /{id}/enable | Enables the account. |

### **Transactions (/api/transactions)**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | / | Creates a new transaction. |
| GET | /{id} | Retrieves a transaction by ID. |
| DELETE | /{id} | Deletes a transaction by ID. |
| GET | /account/{accountId} | Gets all transactions for a specific account. |
| GET | /people/{id} | Gets all transactions for a specific person. |
| GET | / | Gets a list of all transactions. |

### **Banking Services (/api/banking)**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /withdraw | Withdraws funds from an account. |
| POST | /deposit | Deposits funds into an account. |
| POST | /transfer | Transfers funds between two accounts. |

