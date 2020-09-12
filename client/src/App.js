import React from "react";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import CatalogComponent from "./container/catalogComponent";
import FormProduct from "./container/formProducto.js";
import FormCategory from "./container/formCategory.js";
import ProductComponent from "./container/productComponent";
import HeaderInicio from "./components/headerInicio";
import AdminPanel from "./container/adminPanel";
import EditProduct from './container/EditProduct';
import "./bootstrap.min.css";
import ProductCategory from "./container/productCategory";
import SearchComponent from "./container/SearchComponent";
import FormUser from "./container/addUser";
import EditUserForm from "./container/EditUser";

function App() {
  return (
    <BrowserRouter>
      <Route path="/" render={() => <HeaderInicio />} />
      <main className="main">
        <div className="content">
          <Route path="/" exact={true} render={() => <CatalogComponent />} />
          <Route path="/admin" exact={true} render={() => <AdminPanel />} />
          <Route path="/products/search" exact={true} render={(p) => 
          {console.log(p);
            return <SearchComponent 
          producto={p.location.state} />}} />
          <Route
            path="/admin/products/add"
            exact={true}
            render={() => <FormProduct />}
          />
          <Route
            path="/admin/categories/add"
            exact={true}
            render={() => <FormCategory />}
          />
          <Route
            path="/product/:id"
            exact={true}
            render={(p) => {
              console.log(p);
              return <ProductComponent producto={p.location.state} />;
            }}
          />
          <Route
            path='/admin/products/edit/:id'
            exact={true}
            render={(p) => {
              console.log(p.match.params.id)
              return <EditProduct producto={p.match.params.id} />
            }}
          />
          <Route
            path="/products/categoria/:nombreCat"
            exact={false}
            render={(c) => { 
           return <ProductCategory nombrecat={c.match.params.nombreCat} />}}
         />
         <Route
          path= "/users/signup"
          exact={true}
          render={() => { 
            return <FormUser />}}
           />
          <Route
            path="/users/edit/:id"
            exact={true}
            render={() => {
              return <EditUserForm />}}
            />
        </div>
      </main>
    </BrowserRouter>
  );
}
export default App;
