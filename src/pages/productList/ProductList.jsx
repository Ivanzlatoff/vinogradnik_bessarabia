 import "./productList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct } from "../../redux/apiCalls";
import { useTranslation } from "react-i18next";
import { 
  Dialog, 
  DialogTitle, 
  DialogActions, 
  Button 
} from '@material-ui/core';


export default function ProductList() {
  const dispatch = useDispatch();
  const products = useSelector(state => state.product.products);
  const [deleteProductId, setDeleteProductId] = useState('');
  const [deleteProductTitle, setDeleteProductTitle] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { t } = useTranslation(["productList"])

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "product",
      headerName: t("product"),
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params.row.img} alt="" />
            {t(params.row.title)}
          </div>
        );
      },
    },
    { 
      field: "inStock", 
      headerName: t("stock"), 
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            {t(params.row.inStock)}
          </div>          
        )
      } 
    },
    {
      field: "price",
      headerName: t("price"),
      width: 160,
    },
    {
      field: "action",
      headerName: t("action"),
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/product/" + params.row._id}>
              <button className="productListEdit">{t("edit")}</button>
            </Link>
            <DeleteOutline
              className="productListDelete"
              onClick={() => {
                setDeleteProductId(params.row._id);
                setDeleteProductTitle(params.row.title);
                setOpenDeleteDialog(true);
              }}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="productList">
      <Link to="/newproduct">
        <button className="createButton">{t("createNewProduct")}</button>
      </Link>
      <DataGrid
        rows={products}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={8}
        checkboxSelection
      />
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: { 
            border: '3px solid #f54266',
            borderRadius: 10,
            backgroundColor: '#f1eeef',
            justifyContent: 'center',
            textAlign: 'center'
          }
        }}
      >
        <DialogTitle>{t("deleteConfirmation")} {deleteProductId} ({deleteProductTitle})?</DialogTitle>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)} 
            color="primary"
            variant="outlined"
          >
            {t("cancel")}
          </Button>
          <Button onClick={() => {
              deleteProduct(deleteProductId, dispatch);
              setOpenDeleteDialog(false);
            }} 
            color="secondary" 
            autoFocus
            variant="outlined"
          >
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
