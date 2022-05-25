const createOrderList = (dataList)=> {
    let orderList = [];
    try {
        dataList.forEach((element)=> {
            elementIndex = orderList.findIndex((item)=> {
                return item.farm.farmId === element.stock.farmId._id
            });
            if(elementIndex < 0) {
                orderList.push({
                    createdBy: element.createdBy._id,
                    farm: {
                        farmId: element.stock.farmId._id,
                        farmer: element.stock.farmId.owner._id
                    },
                    cart:[{
                        cartId: element._id,
                        stockId: element.stock._id,
                        surplusId: element.stock.surplusId._id,
                        unitPrice: element.stock.unitPrice,
                        quantity: element.quantity,
                        itemCost: element.itemCost,                                
                    }]
                })
            }else {
                let currentElement = orderList[elementIndex];
                currentElement = {
                    ...currentElement,
                    cart:[
                        ...currentElement.cart,
                        {
                            cartId: element._id,
                            stockId: element.stock._id,
                            surplusId: element.stock.surplusId._id,
                            unitPrice: element.stock.unitPrice,
                            quantity: element.quantity,
                            itemCost: element.itemCost,  
                        }
                    ]
                };
                orderList.splice(elementIndex, 1, currentElement);
            }
        })
    }catch(err) {
        console.log(err);
    }
    return orderList;
}

const createFrequentList= (data)=> {
    let resList = [];
    data.forEach((element)=> {
        elementIndex = resList.findIndex((item)=> {
            return item?.surplus?._id === element?.stock?.surplusId._id
        });
        if(elementIndex < 0) {
            resList.push({
                surplus: {
                    _id: element?.stock?.surplusId._id,
                    name: element?.stock.surplusId.name,
                    type: element?.stock.surplusId.type
                },
                stock: [
                    {
                        _id: element?.stock?._id,
                        farmName: element?.stock?.farmId?.name,
                        mediaPresent: element?.stock?.mediaPresent,
                        mediaUrl: element?.stock?.mediaUrl
                    }
                ]
            })
        }else {
            let currentElement = resList[elementIndex];
            currentElement = {
                ...currentElement,
                stock:[
                    ...currentElement.stock,
                    {
                        _id: element?.stock?._id,
                        farmName: element?.stock?.farmId?.name,
                        mediaPresent: element?.stock?.mediaPresent,
                        mediaUrl: element?.stock?.mediaUrl  
                    }
                ]
            };
            resList.splice(elementIndex, 1, currentElement);
        }
    });
    
    return resList;
}

module.exports = {
    createOrderList,
    createFrequentList
}