import React, {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Card from 'react-bootstrap/Card';
import * as apiService from '../services/apiservice';
import DefaultImage from '../images/default.png';
import Loader from '../services/loader';
import Modal from 'react-bootstrap/Modal';
import ProductsHandling from './ProductsHandling';
import Table from 'react-bootstrap/Table';

function Dashboard() {
    const [category, setCategory] = useState([])
    const [isCategory, setIsCategory] = useState(false)
    const [subCategory, setSubCategory] = useState([])
    const [loader, setLoader]  = useState(false)
    const [dynamicHeight, setdDynamicHeight]  = useState('86vh')
    const [allproducts, setAllproducts] = useState([])
    const [show, setShow] = useState(false);
    const [orderShow, setOrderShow] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [cartItems, setCartItems] = useState([])
    const [priceDetails, setPriceDetails] = useState({
        itemTotal: '',
        sgst:'',
        cgst:'',
        igst:'',
        taxableAmt:''
    })

    useEffect(()=> {
        getCategory()
    },[])

    useEffect(()=> {
        if(cartItems && cartItems.length > 0){
            var itemTotal = cartItems.map(item => (item.price * parseInt(item.totalItems))).reduce((prev, next) => prev + next);
            var gst = itemTotal * 0.09
            var taxableAmt = itemTotal + (gst * 3)
            setPriceDetails({
                itemTotal: itemTotal,
                sgst: gst,
                cgst: gst,
                igst: gst,
                taxableAmt:taxableAmt
            })
        }
    },[cartItems])

    const handleClose = () => {
        var retrievedCartItems = localStorage.getItem('cart_items');
        var getCartItems = JSON.parse(retrievedCartItems)
        let getSelectedItems = [...cartItems]

        if((getSelectedItems && getSelectedItems.length > 0) && 
            getCartItems && getCartItems.length > 0){
            if(getCartItems){
                for (var i = 0; i < getSelectedItems.length; i++) {
                    for (var k = 0; k < getCartItems.length; k++) {
                        // console.log(getSelectedItems[i], getCartItems[k])
                        if ((getSelectedItems[i] !== undefined && getSelectedItems[i].id ) == (getCartItems[k]!== undefined && getCartItems[k].id)) {
                            // console.log(parseInt(getSelectedItems[i].totalItems) + parseInt(getCartItems[k].totalItems))
                            getSelectedItems[i].totalItems = parseInt(getSelectedItems[i].totalItems) + parseInt(getCartItems[k].totalItems)
                            delete getCartItems[k]
                        }
                        
                    }
                }
            }
            if(getCartItems && getCartItems.length > 0){
                for (var i = 0; i < getSelectedItems.length; i++) {
                    for (var k = 0; k < getCartItems.length; k++) {
                        // console.log(getSelectedItems[i], getCartItems[k])
                        if ((getSelectedItems[i] !== undefined  && getSelectedItems[i].id )  !== (getCartItems[k] !== undefined && getCartItems[k].id)) {
                            getSelectedItems.push(getCartItems[k])
                            delete getCartItems[k]
                        }
                    }
                }
            }

            // console.log('local:', getCartItems, 'state:', getSelectedItems)
            let filterGetSelectedItems = getSelectedItems.filter(item => item);
            setCartItems(filterGetSelectedItems)
        }
        else{
            // console.log('local:', getCartItems, 'state:', getSelectedItems)
            setCartItems(getCartItems)
        }
        setShow(false)
    };

    const handleShow = (singleProduct) => {
        setShow(true)
        setSelectedProduct(singleProduct)
    };

    const getCategory = () => {
        setLoader(true)
        apiService.getCategoryApi().then(response => {
            let updatedCategory = response.data.result.map(v => ({...v, isActive: false}))
            setCategory(updatedCategory)
            setLoader(false)
        }).catch(error => {
            setLoader(false)
        })
    }

    const getSubCategory = (singleCategory) => {
        setLoader(true)
        setIsCategory(true)
        let setActiveCategory = [...category]
        for (let i = 0; i < setActiveCategory.length; i++) {
            if(setActiveCategory[i].categoryId === singleCategory.categoryId){
                setActiveCategory[i].isActive = true
            }
            else{
                setActiveCategory[i].isActive = false
            }
        }
        setCategory(setActiveCategory)
        apiService.getSubCategoryApi(singleCategory.categoryId).then(response => {
            let updatedSubCategory = response.data.result.map(v => ({...v, isActive: false}))
            setSubCategory(updatedSubCategory)
            setLoader(false)
        }).catch(error => {
            setLoader(false)
        })
    }

    const getAllProducts = (singleSubCategory) => {
        setdDynamicHeight('70vh')
        let setActiveSubCategory = [...subCategory]
        for (let i = 0; i < setActiveSubCategory.length; i++) {
            if(setActiveSubCategory[i].subCategoryId === singleSubCategory.subCategoryId){
                setActiveSubCategory[i].isActive = true
            }
            else{
                setActiveSubCategory[i].isActive = false
            }
        }
        setSubCategory(setActiveSubCategory)
        apiService.getProductsApi(singleSubCategory.subCategoryId).then(response => {
            setAllproducts(response.data.result)
            setLoader(false)
        }).catch(error => {
            setLoader(false)
        })
    }

    const backToCategory = () => {
        setdDynamicHeight('86vh')
        let setActiveSubCategory = [...subCategory]
        for (let i = 0; i < setActiveSubCategory.length; i++) {
            setActiveSubCategory[i].isActive = false
        }
        setSubCategory(setActiveSubCategory)
    }

    const removeMainItem = (id) => {
        let getSelectedItems = [...cartItems]
        const removedItems = getSelectedItems.filter(object => {
            return object.id !== id;
          });
        setCartItems(removedItems)
    }

    const handleOrderShow = () => {
        setOrderShow(true)
    };

    const handleOrderClose = () => {
        setOrderShow(false)
        setCartItems([])
        setPriceDetails({
            itemTotal: '',
            sgst:'',
            cgst:'',
            igst:'',
            taxableAmt:''
        })
        setdDynamicHeight('86vh')
        setSelectedProduct(null)
    };

  return (
    <div>
        {loader && <Loader />} 
        <Navbar bg="light" expand="lg">
            <Container fluid>
                <Navbar.Brand href="#">Shopping Application</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link href="#action1">Home</Nav.Link>
                        <Nav.Link href="#action2">Link</Nav.Link>
                        <NavDropdown title="Link" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action4">
                            Another action
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action5">
                            Something else here
                        </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#" disabled>
                        Link
                        </Nav.Link>
                    </Nav>
                    <Form className="d-flex">
                        <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <div className="dashboard-main">
            <div className="dashboard-center">
                <div className="dashboard-main-inner">
                    <div 
                        className='left-bar bg-light'
                        style={{height: dynamicHeight }}
                    >
                        <ul className='left-bar-list'>
                            <li 
                                className='bg-primary rounded text-white'
                            >
                                All products
                            </li>
                            <li>Dashboard</li>
                            <li>Contact</li>
                        </ul>
                    </div>
                    <div 
                        className='center-bar bg-light'
                        style={{height: dynamicHeight }}
                    >
                        {dynamicHeight === '86vh' ?
                            <>
                                <h5>Category</h5>
                                <div className='main-category'>
                                    {category.map((data,i)=>{
                                        return (
                                            <Card 
                                                className={
                                                    data.isActive == true ? 
                                                    'main-card is-active' : 
                                                    'main-card'
                                                }
                                                key={i}
                                                onClick={() => getSubCategory(data)}
                                            >
                                                <Card.Img 
                                                    variant="top" 
                                                    src={
                                                        data.categoryImageURL ? 
                                                        data.categoryImageURL :
                                                        DefaultImage
                                                    }
                                                    height={'120px'}
                                                    width={'50px'}
                                                />
                                                <Card.Body
                                                className='p-1'
                                                >
                                                    <Card.Title 
                                                        className='text-center'
                                                    >
                                                        {data.categoryName}
                                                    </Card.Title>
                                                </Card.Body>
                                            </Card>
                                        )
                                    })}
                                    
                                </div>
                                <hr></hr>
                                <h5>Sub Category</h5>
                                {!isCategory && <p className='text-center'>***Select any Category***</p>}
                                {isCategory && subCategory.length === 0 && <p className='text-center'>No Sub Category Available</p>}
                                <div className='sub-category'>
                                    <div className='row'>
                                        {subCategory.map((data,i)=>{
                                            return (
                                                <div className='col-lg-3 col-md-4 mb-2'>
                                                    <Card 
                                                        className={
                                                            data.isActive == true ? 
                                                            'sub-card is-active' : 
                                                            'sub-card'
                                                        }
                                                        key={i}
                                                        onClick={() => getAllProducts(data)}
                                                    >
                                                        <Card.Img 
                                                            variant="top" 
                                                            src={
                                                                data.subCategoryImageURL ? 
                                                                data.subCategoryImageURL :
                                                                DefaultImage
                                                            }
                                                            height={'90px'}
                                                            width={'20px'}
                                                        />
                                                        <Card.Body
                                                            className='p-1'
                                                        >
                                                            <p className='text-center'>{data.subCategoryName}</p>
                                                        </Card.Body>
                                                    </Card>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </>
                        :
                            <>
                            <div className='d-flex'>
                                <i 
                                    className="fa fa-arrow-left" 
                                    style={{
                                        marginTop :'3px',
                                        cursor:'pointer'
                                    }}
                                    onClick={() => backToCategory()}
                                >
                                </i>
                                <h5 style={{marginLeft :'7px'}}>All Products</h5>
                            </div>
                                <div className='row'>
                                    {allproducts.map((data,i)=>{
                                        return (
                                            <div className='col-lg-3 col-md-4 mb-2'>
                                                <Card 
                                                    className={
                                                        data.isActive == true ? 
                                                        'sub-card is-active' : 
                                                        'sub-card'
                                                    }
                                                    key={i}
                                                    onClick={() => handleShow(data)}
                                                >
                                                    <div className='d-flex justify-content-center p-2'>
                                                        <img 
                                                            src={
                                                                data.productImages.length > 0 ? 
                                                                data.productImages[0] :
                                                                DefaultImage
                                                            }
                                                            height={'100px'}
                                                            width={'85px !important'}
                                                        />
                                                    </div>
                                                    <Card.Body
                                                        className='p-1'
                                                    >
                                                        <p className='text-center font-weight-bold'>{data.itemDescription}</p>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        }
                             
                    </div>
                </div>
                {dynamicHeight === '70vh' &&
                    <div 
                        className='bottom-bar bg-light'
                        style={{height: "14.5vh", width:'99%' }}
                    >
                        {subCategory.map((data,i)=>{
                            return (
                                <Card 
                                    className={
                                        data.isActive == true ? 
                                        'bottom-card is-active' : 
                                        'bottom-card'
                                    }
                                    key={i}
                                    onClick={() => getAllProducts(data)}
                                >
                                    <Card.Img 
                                        variant="top" 
                                        src={
                                            data.subCategoryImageURL ? 
                                            data.subCategoryImageURL :
                                            DefaultImage
                                        }
                                        height={'70px'}
                                        width={'20px'}
                                    />
                                </Card>
                            )
                        })}
                    </div>
                }
            </div>
        
            <div className='right-bar bg-light'>
                <Table
                    striped bordered hover
                    style={{
                        fontSize:'11px',
                    }}
                >
                    <thead>
                        <tr className='text-center'>
                            <th>Sno</th>
                            <th>Products</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            {/* <th>Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems && 
                        cartItems.length > 0 && 
                        cartItems.map((data, i) => {
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
                                        onClick={() => removeMainItem(data.id)}
                                    >
                                        <i class="fa fa-close"></i>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                {cartItems.length == 0 && 
                    <p className='text-center'>No Items in Cart</p>
                }
                <label>Purchase Order Number</label>
                <input 
                    className='form-control mb-2'
                    type='text'
                    disabled = "true"
                    value={'#8756899'}
                />
                <label>Address</label>
                <input 
                    className='form-control mb-2'
                    type='text'
                    disabled = "true"
                    value={'No 50, Test Street, Xyz'}
                />
                <Table
                    striped
                    style={{
                        fontSize:'11px',
                    }}
                >
                    <thead>
                
                    </thead>
                    <tbody>
                        <tr>
                            <td>Item Total</td>
                            <td>{selectedProduct && selectedProduct.currency.symbol}{' '}{priceDetails.itemTotal}</td>
                        </tr>
                        <tr>
                            <td>SGST(%9)</td>
                            <td>{selectedProduct && selectedProduct.currency.symbol}{' '}{priceDetails.sgst}</td>
                        </tr>
                        <tr>
                            <td>CGST(%9)</td>
                            <td>{selectedProduct && selectedProduct.currency.symbol}{' '}{priceDetails.cgst}</td>
                        </tr>
                        <tr>
                            <td>IGST(%9)</td>
                            <td>{selectedProduct && selectedProduct.currency.symbol}{' '}{priceDetails.igst}</td>
                        </tr>
                        <tr>
                            <td>Taxable Amount</td>
                            <td>{selectedProduct && selectedProduct.currency.symbol}{' '}{priceDetails.taxableAmt}</td>
                        </tr>
                    </tbody>
                </Table>
                <Button
                    variant='warning'
                    className='w-100'
                    onClick={() => handleOrderShow()}
                >
                    Place Order
                </Button>
            </div>
        </div>
        <>
            <Modal 
                show={show} 
                onHide={handleClose}
                size="xl"
            >
                <Modal.Header closeButton>
                <Modal.Title>Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductsHandling 
                        product = {selectedProduct}
                        handleCloseModal = {handleClose}
                        setLoader = {setLoader}
                        setShow = {setShow}
                    />
                </Modal.Body>
            </Modal>

            <Modal 
                show={orderShow} 
                onHide={handleOrderClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className='text-center'>Order Placed Successfully</h5>
                </Modal.Body>
            </Modal>
        </>
    </div>
  )
}

export default Dashboard