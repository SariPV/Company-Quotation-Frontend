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
import Quotation from "./components/Quotation";
import ProductManagement from "./components/ProductManagement";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Login } from "./components/Login";
import QuotationManagement from "./components/QuotationManagement";

const API_URL ="https://company-6135118.herokuapp.com";

function App() {
  const [user, setUser] = useState();

  const handleLogin = (data) => {
    console.log("handleLogin", data);
    fetch(`${API_URL}/users/login`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          window.alert("Error:" + data.error);
        } else {
          window.alert("Welcome " + data.name);
          console.log(data);
          setUser(data);
        }
      });
  };

  return (
    <Router>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">VMS Company</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/create-quotation">Quotation</Nav.Link>
            {/* <Nav.Link href="#pricing">Pricing</Nav.Link> */}
            <Nav.Link href="/product-management">
              Product
            </Nav.Link>
            <Nav.Link href="/quotation-management">
              Management
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Routes>
        <Route
          path="/product-management"
          element={<ProductManagement />}
        />
         <Route
          path="/quotation-management"
          element={<QuotationManagement />}
        />

        <Route path="/create-quotation" element={<Quotation />} />
        <Route
          path="/"
          element={
            <Container>
              {user ? (
                <div>Hello {user.name}</div>
              ) : (
                <Login onLogin={handleLogin} />
              )}
            </Container>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
