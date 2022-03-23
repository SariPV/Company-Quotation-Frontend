import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Row,
  Col,
  Form,
  Container,
  Table,
  Button,
  Card,
} from "react-bootstrap";
import { FaTrashAlt, FaPencilAlt, FaPlus} from "react-icons/fa";
import { AiFillCloseCircle} from "react-icons/ai"
import style from "../mystyle.module.css";
import "../App.css"
// import {
//   useSort,
//   HeaderCellSort ,
// } from '@table-library/react-table-library/sort';


export default function QuotationManagement() {
  const API_URL = "https://company-6135118.herokuapp.com"

  const [quotations, setquotations] = useState([]);
  const [quotationRows, setquotationRows] = useState([]);
  const [show, setShow] = useState(false);
  const [modeAdd, setModeAdd] = useState(false);
  const [quotation, setquotation] = useState({
    item: "",
    qty: 0,
    price: 0,
  });
  console.debug({API_URL})
  const [total, setTotal] = useState();
  // Input references
  const refCode = useRef();
  const refName = useRef();
  const refPrice = useRef();
  
  //const [topNews, setTopNews] = useState([]);

  const sortDate = (order, data) => {
    return data.sort((a, b) => {
      if (order === "Date") {
        return new Date(b.date) - new Date(a.date);
      // return b.price - a.price;
      } else {
        return new Date(a.date) - new Date(b.date);
      // return a.price - b.price;
      }
    });
  };

  useEffect(() => {
   // const { data } = this.props;
  
    fetch(`${API_URL}/quotation`)
      .then((res) => res.json())
      .then((data) => {
        const quotations = sortDate(
          "Date", data
        );
        let sum = 0;
        const row = data.map((e, i) => {
            let amount = e.qty * e.price;
            sum += amount;
         
          return (
            <tr key={i}>
              <td>{e.date}</td>
              <td>{e.item}</td>
              <td>{e.qty}</td>
              <td>{formatNumber(e.price)}</td>
              <td>{formatNumber(amount)}</td>
              <td style={{float:"left"}}>
             
               
                <AiFillCloseCircle style={{fontSize:"20px", color:"bb0a1e"}}
                  onClick={() => {
                    handleDelete(e);
                  }}
                />
              </td>
            </tr>
          );
        });
        setTotal(sum);
        setquotations(data);
        setquotationRows(row); 
        //setTopNews(orderedNews); 
 
      });
    
  }, []);



  const handleDelete = (quotation) => {
    console.log(quotation);
    if (window.confirm(`Are you sure to delete ${quotation.item}?`)) {
      fetch(`${API_URL}/quotation/${quotation._id}`, {
        method: "DELETE",
        mode: "cors",
      })
        .then((res) => res.json())
        .then((json) => {
          // Successfully deleted
          console.log("DELETE Result", json);
          for (let i = 0; i < quotations.length; i++) {
            if (quotations[i]._id === quotation._id) {
              quotations.splice(i,1);
              break;
            }
          }
          let sum = 0;
          const rows = quotations.map((e, i) => {
            let amount = e.qty * e.price;
            sum += amount;
            return (
              <tr key={i}>
               
               <td>{e.date}</td>
                <td>{e.item}</td>
                <td>{e.qty}</td>
                <td>{formatNumber(e.price)}</td>
                <td>{formatNumber(amount)}</td>
                <td style={{float:"left"}}>
             
              
                <AiFillCloseCircle style={{fontSize:"20px", color:"bb0a1e"}}
                  onClick={() => {
                    handleDelete(e);
                  }}
                />
              </td>
              </tr>
            );
          });
          setTotal(sum);
          setquotations(rows);
          setquotationRows(rows);   
          window.location.reload(false);  
       
        });
    }
  };



  const formatNumber = (x) => {
    x = Number.parseFloat(x)
    return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  
   
   
     
  return (
    <>
      <Container>
        <h1 style={{color:"#000137"}}>Quotation Management</h1>
        {/* API_URL: {API_URL} */}
        <a href="/create-quotation" ><Button style={{marginTop:'20px'}} variant="outline-dark">
          <FaPlus /> Create New Quotation
          
        </Button> </a>
        <Card style={{boxShadow: " 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", marginTop:'20px', borderRadius: "10px",backgroundColor:"#000137"}} >
        <Table borderless striped >
          <thead style={{ color:"#d1e0ee", fontSize:"14px"}}>
            <tr >
            <th className={style.textCenter} >Date</th>
            
              <th className={style.textCenter} >Item</th>
              <th className={style.textCenter}>Quantity</th>
              <th className={style.textCenter}>Price/Unit</th>
              <th className={style.textCenter}>Amount</th>
              <th style={{ width:"40px",alignContent:"left" }}></th>
            </tr>
          </thead>
          <tbody style={{borderTop:"none", textAlign:"center", color:"#ffff", fontSize:"14px", fontWeight:"500"}}>{quotationRows}</tbody>
          <tfoot style={{borderTop:"none", color:"#d1e0ee", fontSize:"16px",fontWeight:"500"}}>
          <tr>
            <td colSpan={4} className={style.textRight} style={{paddingRight:"100px"}}>
              Total
            </td>
            <td className={style.textCenter}>
              {formatNumber(total)}
            </td>
          </tr>
        </tfoot>
        </Table>
        </Card>
      </Container>

    
           
    </>
  );

}