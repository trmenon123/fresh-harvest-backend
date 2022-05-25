// Recheck createTransactionOrderList - Business logic
const createTransactionOrderList = (farmId, dataList)=> {    
    let data = {
        farm: farmId, 
        data: dataList.map((element)=> {
            // const elementIndex = element.orders
            //     .findIndex((item)=> item.farmId._id.toString() === farmId.toString());
            //     console.log(elementIndex);
            
                return  {
                    _id: element._id,
                    user: element.user,
                    address: element.address,
                    orders: element.orders.filter((order)=> {
                        return order.farmId._id.toString() === farmId.toString();                                              
                    }),
                    completed: element.completed,
                    createdAt: element.createdAt,
                    updatedAt: element.updatedAt,
                };                
            
        })
    };
    data.data.forEach((element, index)=> {
        if(element.orders.length === 0) {
            data.data.splice(index, 1);
        } 
    })
    return data;
};

module.exports= {
    createTransactionOrderList
}