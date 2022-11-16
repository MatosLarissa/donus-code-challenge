import BaseDataBase from "../baseDataBase/baseDataBase"


export default class Migration extends BaseDataBase {

    static createTables = async () => {
        try {
            await this.connection.raw(`
            CREATE TABLE IF NOT EXISTS customer (
                id VARCHAR(255) PRIMARY KEY,
                fullName VARCHAR(255) NOT NULL,
                cpf VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created VARCHAR(255) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS card(
                id VARCHAR(255) PRIMARY KEY,
                cardCustomerName VARCHAR(255) NOT NULL,
                cardNumber VARCHAR(255) NOT NULL,
                lastNumber VARCHAR(255) NOT NULL,
                cvv VARCHAR(255) NOT NULL,
                amount FLOAT NOT NULL,
                idCustomer VARCHAR(255) NOT NULL,
                FOREIGN KEY (idCustomer) REFERENCES customer(id)
            );

            CREATE TABLE IF NOT EXISTS payable(
                id VARCHAR(255) PRIMARY KEY,
                status ENUM("PAID","WAITING_FUNDS"),
                paymentDate VARCHAR(255) NOT NULL,
                createdDate VARCHAR(255) NOT NULL,
                amount FLOAT NOT NULL,
                description VARCHAR(255) NOT NULL,
                cardNumber VARCHAR(255) NOT NULL,
                idCustomer VARCHAR(255) NOT NULL,
                FOREIGN KEY (idCustomer) REFERENCES customer(id)
            );
            `)

        } catch (error: any) {
            console.log(error.message)
        }
    }
}

Migration.createTables()