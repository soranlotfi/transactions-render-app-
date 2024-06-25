const transactionsLoad = document.querySelector(".show-transactions-btn")
const transactionsLoadContainer = document.querySelector(".show-transactions-button-container")
const transactionsTable = document.querySelector(".table-container")
const transactionsTablesBody = document.querySelector(".transactions-table-body")
const priceSortIcon = document.querySelector(".price-sort-icon")
const dateSortIcon = document.querySelector(".date-sort-icon")
const searchInput = document.querySelector(".search-input")
const searchIcon = document.querySelector(".search-icon")


let searchParams={}
// 1.show transactions using btn
transactionsLoad.addEventListener("click" , async ()=>{
    transactionsLoadContainer.style.display="none"
    transactionsTable.style.display="flex"
    const api = new Api()
    const ui = new Ui()
    let transactions = await api.getTransactions()
    ui.renderTransactions(transactions.data)

})
// do some moves on the icons
priceSortIcon.addEventListener("click" , ()=>{
    priceSortIcon.classList.toggle("rotate")
    const api = new Api()
    if(priceSortIcon.classList.contains("rotate")) api.filterTransaction({priceSort:"asc"})
    else api.filterTransaction({priceSort:"desc"})
})
dateSortIcon.addEventListener("click" , ()=>{
    const api = new Api()
    dateSortIcon.classList.toggle("rotate")
    if(dateSortIcon.classList.contains("rotate")) api.filterTransaction({dateSort:"asc"})
    else api.filterTransaction({dateSort:"desc"})
})
searchInput.addEventListener("focus" , ()=>{
    !searchIcon.classList.contains("search-animate") ? searchIcon.classList.add("search-animate") : searchIcon.classList.remove("search-animate")
})
searchInput.addEventListener("input" , async (e)=>{
    const api = new Api()
    const ui = new Ui()
    if(e.target.value===""){
        let transactions =await api.getTransactions()
        ui.renderTransactions(transactions.data)
    }else {
        api.filterTransaction({refId:e.target.value})
    }
})
class Ui{
    renderTransactions(transactions){
        let result = transactions.map((transaction) =>{
            return `
             <tr class="table-body-row">
                            <th class="table-body-cell" scope="col">${transaction.id}</th>
                            <th class="table-body-cell" scope="col"> <h3 class=${transaction.type==="افزایش اعتبار"?"green-text" : "red-text"}>${transaction.type}</h3></th>
                            <th class="table-body-cell transaction-price-cell" scope="col">
                                ${transaction.price.toLocaleString()}
                            </th>
                            <th class="table-body-cell" scope="col">${transaction.refId}</th>
                            <th class="table-body-cell transaction-date-cell" scope="col"> ${Date.dateConvert(transaction.date)}</th>
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
            return  await axios.get(" http://localhost:3000/transactions")
        }
        catch (e){
            throw new Error(e.message)
        }
     }

    async  filterTransaction({ refId = "", dateSort = "", priceSort = "" }) {
        let url = `${this.baseUrl}/transactions?`;

        if (refId) searchParams.refId=`refId_like=${refId}`;
        if (priceSort) searchParams.sort=`&_sort=price&_order=${priceSort}`
        if (dateSort)searchParams.sort=`&_sort=date&_order=${dateSort}` ;

        if(searchParams.refId) url+=searchParams.refId ?? ""
        if(searchParams.sort) url+=searchParams.sort ?? ""
        if(searchParams.dateSort) url+=searchParams.dateSort ?? ""

        try {
            const filteredData = await axios.get(url);
            const ui = new Ui();
            ui.renderTransactions(filteredData.data);
        } catch (e) {
            throw new Error(e.message);
        }
    }
}
class Date{
    static options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            // weekday: "long",
            hour:"numeric",
            minute:"numeric"
    }
    static dateConvert(transactionDate){
        const convertedDate = (Intl.DateTimeFormat("fa-IR" , Date.options).format(transactionDate))
        return `${convertedDate}`
    }
}
