import { useState, useRef, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";
import { useLocalStorage } from "react-use";

import QuotationTable from "./QuotationTable";

function Quotation() {
  const API_URL = "https://company-6135118.herokuapp.com";
  const itemRef = useRef();
  const priceRef = useRef();
  const qtyRef = useRef();
  const quantityRef = useRef();
  const refDate = useRef();
  console.debug({API_URL})

  const [localDataItems, setLocalDataItems, remove] = useLocalStorage(
    "data-items",
    JSON.stringify([])
  );

  const [dataItems, setDataItems] = useState(JSON.parse(localDataItems));

  const [products, setProducts] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [price, setPrice] = useState(0);
  const [newproducts, setNewProducts] = useState({
    item: "",
    date: "",
    price: 0,
    qty: 0,
  });
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        data = data.filter((e) => "code" in e);

        console.log(data);
        const z = data.map((v) => (
          <option key={v._id} value={v._id}>
            {v.name}
          </option>
        ));
        setProducts(data);
        setProductOptions(z);
      });
  }, []);

  const deleteProduct = () => {
    let item = products.find((v) => itemRef.current.value === v._id);
    console.log("Item to be deleted", item);
    fetch(`${API_URL}/quotation`, {
      method: "DELETE",
      body: JSON.stringify({
        _id: item._id,
      }),
    })
      .then((res) => res.json)
      .then((data) => {
        console.log("Delete ", data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addItem = () => {
    let item = products.find((v) => itemRef.current.value === v._id);
    console.log(item);
    var itemObj = {
      _id: item._id,
      code: item.code,
      item: item.name,
      price: priceRef.current.value,
      qty: quantityRef.current.value,
    };

    dataItems.push(itemObj);
    setDataItems([...dataItems]);
    setLocalDataItems(JSON.stringify(dataItems));
    console.log("after", dataItems);
  };

  const saveItem = () => {
          //Add new news
          let item = products.find((v) => itemRef.current.value === v._id);
          let date = new Date()
          var month = date.getUTCMonth() + 1; //months from 1-12
          var day = date.getUTCDate();
          var year = date.getUTCFullYear();
          var itemObj = {
            item: item.name,
            date: day + "/" + month + "/" + year,
            price: priceRef.current.value,
            qty: quantityRef.current.value,
          };
          console.log(itemObj);

          fetch(`${API_URL}/quotation`, {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              mode: "cors", // no-cors, *cors, same-origin
              cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
              // credentials: "same-origin", // include, *same-origin, omit
              headers: {
                  "Content-Type": "application/json",
                  // "Content-Type":"multipart/form-data"
                  // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              redirect: "follow", // manual, *follow, error
              referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
              body: JSON.stringify(itemObj), // body data type must match "Content-Type" header

          })
              .then((res) => res.json())
              .then((json) => {
                  // Successfully added the product
                  console.log("POST Result", json);
                  products.push(json);
                  setProducts(products)
                  dataItems.push(itemObj);
                  setDataItems([...dataItems]);
                
              });
    
  }

  const updateDataItems = (dataItems) => {
    setDataItems([...dataItems]);
    setLocalDataItems(JSON.stringify(dataItems));
  };

  const clearDataItems = () => {
    setDataItems([]);
    setLocalDataItems(JSON.stringify([]));
  };

  const productChange = () => {
    console.log("productChange", itemRef.current.value);
    let item = products.find((v) => itemRef.current.value === v._id);
    console.log("productChange", item);
    priceRef.current.value = item.price;
    console.log(priceRef.current.value);
  };  
  return (
    <Container style={{marginTop:'50px'}}>
      <Row>
        <Col md={4} style={{ backgroundColor: "#d1e0ee", borderRadius:"10px" }}>
          <Row>
            <Col>
              Item
              <Form.Select ref={itemRef} onChange={productChange}>
                {productOptions}
              </Form.Select>
              {/* <Form.Control type="text" ref={itemRef}  /> */}
            </Col>
          </Row>
          <Row>
  
            <Col>
              <Form.Label>Price Per Unit</Form.Label>
              <Form.Control
                type="number"
                ref={priceRef}
                // value={price}
                onChange={(e) => setPrice(priceRef.current.value)}
              />
              {/* <Form.Control type="number" ref={priceRef} defaultValue={1} /> */}

            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" ref={quantityRef} />
            </Col>
          </Row>
          <hr />
          <div className="d-flex gap-2" >
            <Button variant="outline-secondary" onClick={addItem}>
              Add
            </Button>
            <Button variant="outline-danger" onClick={deleteProduct}>
              Delete
            </Button>
            <Button variant="outline-success" onClick={saveItem}>
              Save
            </Button>
          </div>
          {/* {JSON.stringify(dataItems)} */}
        </Col>
        <Col md={8}>
          <QuotationTable
            data={dataItems}
            clearDataItems={clearDataItems}
            updateDataItems={updateDataItems}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Quotation;