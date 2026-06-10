```markdown
# omus-wallet Crypto Wallet Application

This project is a mobile crypto wallet application capable of interacting with Ethereum and Solana networks. It is developed using React Native (Expo).

## Installation

Follow the steps below to run the project on your local machine:

1. **Clone the Project:**
   ```bash
   git clone [https://github.com/mrkkyatilla/omus-wallet.git](https://github.com/mrkkyatilla/omus-wallet.git)
   cd omus-wallet

```

2. **Install Required Packages:**
```bash
npm install

```


3. **Set Up Environment Variables (VERY IMPORTANT):**
The project requires Ethereum (Infura) and Solana (RPC) connections to function properly.
* Copy the `.env.example` file in the project root directory and create a new file named `.env`.
* Open the newly created `.env` file and enter your own API keys:


```env
EXPO_PUBLIC_INFURA_ID="YOUR_INFURA_ID_HERE"
EXPO_PUBLIC_SOLANA_RPC="YOUR_SOLANA_RPC_URL_HERE"

```


4. **Start the Application:**
Run the following command to start the application and create a tunnel for testing:
```bash
npm run tunnel

```


You can test the application live by scanning the QR code that appears in the terminal using the Expo Go application on your iOS or Android phone.

## Potential Issues

* **Missing Environment Variables:** If you do not create the `.env` file or configure the variables inside it, the application will use public and limited RPC endpoints. This may negatively impact the application's performance and reliability. You might see related warnings in the console.
* **Package Mismatches:** If you encounter an error after running `npm install`, try deleting the `node_modules` folder and the `package-lock.json` file, then run the `npm install` command again.

```

```
