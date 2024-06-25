const transactionsLoad = document.querySelector(".show-transactions-btn")
const transactionsLoadContainer = document.querySelector(".show-transactions-button-container")
const transactionsTable = document.querySelector(".table-container")
const transactionsTablesBody = document.querySelector(".transactions-table-body")
// 1.show transactions using btn
transactionsLoad.addEventListener("click" , async ()=>{
    transactionsLoadContainer.style.display="none"
    transactionsTable.style.display="flex"
    const api = new Api()
    const ui = new Ui()
    let transactions = await api.getTransactions()
    ui.renderTransactions(transactions.data)

})



class Ui{
    renderTransactions(transactions){
        console.log(transactions)
        let result = transactions.map((transaction) =>{
            return `
             <tr class="table-body-row">
                            <th class="table-body-cell" scope="col">${transaction.id}</th>
                            <th class="table-body-cell" scope="col"> <h3 class=${transaction.type==="افزایش اعتبار"?"green-text" : "red-text"}>${transaction.type}</h3></th>
                            <th class="table-body-cell transaction-price-cell" scope="col">
                                ${transaction.price.toLocaleString()}
                            </th>
                            <th class="table-body-cell" scope="col">${transaction.refId}</th>
                            <th class="table-body-cell transaction-date-cell" scope="col"> ${transaction.date}</th>
                        </tr>
            `
        })
        transactionsTablesBody.innerHTML=result
    }
}


class Api{
     baseUrl="http://localhost:3000";
    async getTransactions(){
        try {
            return  await axios.get(`${this.baseUrl}/transactions`)
        }
        catch (e){
            console.log(e.message)
        }
     }
}

class Date{
    options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
            hour:"numeric",
            minute:"numeric"
    }
    static dateConvert(transactionDate){
        const date = new Date(transactionDate.toISOString("fa-IR" , this.options))
    }
}