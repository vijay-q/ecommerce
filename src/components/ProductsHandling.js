import React, {useState, useEffect} from 'react'
import DefaultImage from '../images/default.png'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

function ProductsHandling({
    product, 
    handleCloseModal,
    setLoader,
    setShow
}) {
  
    const[allVariants, setAllVariants ] = useState([])
    const[colorCodes, setColorCodes ] = useState([])
    const[quantity, setQuantity ] = useState([])
    const[selectedColor, setSelectedColor] = useState({})
    const[selectedQuantity, setSelectedQuantity] = useState({})
    const[itemsCount, setItemCounts] = useState('')
    const[price, setPrice] = useState('')
    const[selectedItems, setSelectedItems] = useState([])

    useEffect(()=>{
        filterProduct(product)
        setAllVariants(product.variants)
        localStorage.setItem('cart_items', JSON.stringify([]));
    },[product])

    const filterProduct = (data) => {
        let colors = data.variants.map(({ colorCode, colorDescription }) => ({ colorCode, colorDescription }));
        let updatedColors = colors.map(v => ({...v, isActive: false}))
        let removeDupColors = removeDuplicates(updatedColors)
        removeDupColors[0].isActive = true 
        setColorCodes(removeDupColors)
        setSelectedColor(removeDupColors[0])

        let quan = data.variants.map(({ packingCode, packingDescription }) => ({ packingCode, packingDescription }));
        let updatedQuantity = quan.map(v => ({...v, isActive: false}))
        let removeDup = removeDuplicates(updatedQuantity)
        removeDup[0].isActive = true
        setQuantity(removeDup)
        setSelectedQuantity(removeDup[0])
        setPrice(data.variants[0].grossPrice)
    }

    const removeDuplicates = (data) => {
        let jsondata = data.map(JSON.stringify);
        let uniqueSet = new Set(jsondata);
        let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
        return uniqueArray
    }

    const selectColor = (e, data) => {
        e.preventDefault()
        setSelectedColor(data)
        let setActiveColor = [...colorCodes]
        for (let i = 0; i < setActiveColor.length; i++) {
            if(setActiveColor[i].colorCode === data.colorCode){
                setActiveColor[i].isActive = true
            }
            else{
                setActiveColor[i].isActive = false
            }
        }
        setColorCodes(setActiveColor)
        changePrice(data, 'P')
    }

    const selectQuantity = (e,data) => {
        e.preventDefault()
        setSelectedQuantity(data)
        let setActiveQuantity = [...quantity]
        for (let i = 0; i < setActiveQuantity.length; i++) {
            if(setActiveQuantity[i].packingCode === data.packingCode){
                setActiveQuantity[i].isActive = true
            }
            else{
                setActiveQuantity[i].isActive = false
            }
        }
        setQuantity(setActiveQuantity)
        changePrice(data, 'Q')
    }

    const changePrice = (data, name) => {
        if(name === 'P'){
            // console.log(data.colorCode, selectedQuantity)
            let getVariants = [...allVariants]
            for (let i = 0; i < getVariants.length; i++) {
                if(
                    (getVariants[i].colorCode === data.colorCode) && 
                    (getVariants[i].packingCode === selectedQuantity.packingCode)
                ){
                    setPrice(getVariants[i].grossPrice)
                }
            }
        }
        else{
            // console.log(data.packingCode, selectedColor)
            let getVariants = [...allVariants]
            for (let i = 0; i < getVariants.length; i++) {
                if(
                    (getVariants[i].packingCode === data.packingCode) && 
                    (getVariants[i].colorCode === selectedColor.colorCode)
                ){
                    setPrice(getVariants[i].grossPrice)
                }
            }
        }
    }

    const addItem = (e) => {
        e.preventDefault()
        let getAllVariants = [...allVariants]
        let getId = ''
        for (let i = 0; i < getAllVariants.length; i++) {
            // console.log(getAllVariants[i].colorCode, selectedColor.colorCode, getAllVariants[i].packingCode, selectedQuantity.packingCode)
            if(
                (getAllVariants[i].colorCode === selectedColor.colorCode) && 
                (getAllVariants[i].packingCode === selectedQuantity.packingCode)
            ){
                getId = getAllVariants[i]._id
            }
        }
        let obj = {
            id: getId,
            name: product.itemDescription,
            currencySymbol: product.currency.symbol,
            colorCode: selectedColor.colorCode,
            colorDescription: selectedColor.colorDescription,
            packingCode: selectedQuantity.packingCode,
            packingDescription: selectedQuantity.packingDescription,
            price: price,
            totalItems: itemsCount
        }
        if(selectedItems.length > 0){
            let checkSelectedItems = [...selectedItems]
            let idCheck = ''
            for (let i = 0; i < checkSelectedItems.length; i++) {
                if(
                    (checkSelectedItems[i].colorCode === selectedColor.colorCode) && 
                    (checkSelectedItems[i].packingCode === selectedQuantity.packingCode)
                ){
                    idCheck = checkSelectedItems[i].id
                }
            }
            if(idCheck){
                let objIndex = checkSelectedItems.findIndex((obj => obj.id == idCheck));
                checkSelectedItems[objIndex].totalItems =  parseInt(checkSelectedItems[objIndex].totalItems) + parseInt(itemsCount) 
                setSelectedItems(checkSelectedItems)
            }
            else{
                let updateSelectedItems = [...selectedItems]
                updateSelectedItems.push(obj)
                setSelectedItems(updateSelectedItems)    
            }

        }
        else{
            let updateSelectedItems = [...selectedItems]
            updateSelectedItems.push(obj)
            setSelectedItems(updateSelectedItems)
        }
    }

    const removeItem = (id) => {
        let getSelectedItems = [...selectedItems]
        const newSelectedItems = getSelectedItems.filter(object => {
            return object.id !== id;
          });
        setSelectedItems(newSelectedItems)
    }

    const addToCart = (e) => {
        e.preventDefault()
        setLoader(true)
        setShow(false)
        localStorage.setItem('cart_items', JSON.stringify(selectedItems));
        setTimeout(()=>{
            handleCloseModal()
            setLoader(false)
        },1000)
    }

    return (
    <div>
        <div className='row'>
            <div className='col-md-5'>
                <h5>{product.itemDescription}</h5>
                <div className='d-flex justify-content-center bg-light w-50'>
                    <img 
                        src={
                            product.productImages.length > 0 ? 
                            product.productImages[0] :
                            DefaultImage
                        }
                        height={'200px'}
                        width={'150px'}
                        // className='img-fluid'
                    />
                </div>
                <p className='text-muted'>#{product.itemNumber}</p>
                <div className='d-flex justify-content-between'>
                    <p className='font-weight-bold'>{product.itemDescription}</p>
                    <h5>{product.currency.symbol}{" "}{price}</h5>
                </div>
                <p className='text-muted'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <div>
                    <p className='font-weight-bold'>
                        Please Select Color Description 
                    </p>
                    {colorCodes.map((data,i)=>{
                        return(
                            <>
                                <Button
                                    style={{
                                        marginBottom:'4px',
                                        marginRight: '4px'
                                    }}
                                    variant={
                                        data.isActive ? 
                                        "primary" :
                                         "outline-primary"
                                    }
                                    key={i}
                                    onClick={(e)=> selectColor(e,data)}
                                >
                                    {data.colorDescription}
                                </Button>        
                            </>
                        )
                    })}
                    
                </div>
                <div className='mt-3 mb-3'>
                    <p className='font-weight-bold'>
                        Please Select Packaging Description 
                    </p>
                    {quantity.map((data,i)=>{
                        return(
                            <>
                                <Button
                                    style={{
                                        marginBottom:'4px',
                                        marginRight: '4px'
                                    }}
                                    variant={
                                        data.isActive ? 
                                        "primary" :
                                         "outline-primary"
                                    }
                                    key={i}
                                    onClick={(e)=> selectQuantity(e,data)}
                                >
                                    {data.packingDescription}
                                </Button>        
                            </>
                        )
                    })}
                    
                </div>
                <form>
                    <label>Enter Quantity</label>
                    <input 
                        type='number'  
                        className='form-control'
                        min="12" 
                        max="100"
                        onChange={(e) =>{
                            setItemCounts(e.target.value)
                        }}
                    />
                    <p className='text-danger mt-1'>Minimum Quantity must be 12 and Maximum Quantity must be 100 </p>
                    <div className='d-flex justify-content-center'>
                        <Button
                            className='w-50'
                            variant="outline-primary"
                            type='sumbit'
                            onClick={(e)=> addItem(e)}
                        >
                            Add
                        </Button>
                    </div>
                </form>
            </div>
            <div className='col-md-7 bg-light p-3'>
            <Table
                striped bordered hover
            
            >
                <thead>
                    <tr className='text-center'>
                        <th>Sno</th>
                        <th>Products</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedItems.map((data, i) => {
                        return(
                            <tr key={i}>
                                <td>{i+1}</td>
                                <td>
                                    {data.name} <br></br>
                                    <span
                                        className='text-muted'
                                        style={{fontSize: '12px'}}
                                    >
                                        {data.colorDescription} | {data.packingDescription} 
                                    </span>
                                </td>
                                <td>{data.totalItems}</td>
                                <td>
                                    {data.currencySymbol}{" "}
                                    {(data.price)*(data.totalItems)}
                                </td>
                                <td 
                                    className='text-center text-danger'
                                    style={{cursor:"pointer"}}
                                    onClick={() => removeItem(data.id)}
                                >
                                    <i class="fa fa-close"></i>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
                </Table>
                {selectedItems.length > 0 ?
                    <div className='d-flex justify-content-center'>
                        <Button
                            className='w-50'
                            variant="outline-primary"
                            type='sumbit'
                            onClick={(e)=> addToCart(e)}
                        >
                            Add to Cart
                        </Button>
                    </div>
                    :
                    <p className='text-center'>No product is added</p>
                }
            </div>
        </div>
    </div>
  )
}

export default ProductsHandling