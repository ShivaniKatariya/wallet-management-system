a.mention endpoints with sample queries for each API.

    1. POST /setup body:{id: wId, name: username }
        Create new wallet with wId walletId and username.

    2. POST /transact/:id body:{amount:100}
        To credit or debit amount from wallet. If you want to credit sent positive amount, if you want to debit sent negative value.

    3. GET transactions?walletId=:id&skip=0&limit=10
        Will give you first ten records from transaction table sorted by date.

    4. GET /wallet/:id
        To get wallet details

b.Include setup instructions of the project:

    1. do npm i in root directory to install all packages.
    2. start back-end server by running node server/server.js command in terminal.
    3. start front-end server by running npm start in another terminal window.
    4. web app is ready to test on localhost:3000.

c.Short explanations on your database and query design:

    1. Created two tables Wallets and Transactions.
    2. Table definitions are present in set-up-db.sql file.
    3. There is one to many mapping between wallets and transactions.
