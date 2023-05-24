import "./orderList.css";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from 'react-redux';
import { useState } from "react";
import { deleteOrder } from "../../redux/apiCalls";
import { Link } from "react-router-dom";
import { DeleteOutline } from "@material-ui/icons";
import {format} from 'timeago.js';
import { useTranslation } from 'react-i18next';
import { 
  Dialog, 
  DialogTitle, 
  DialogActions, 
  Button 
} from '@material-ui/core';
import { useLocale } from "../../constants";


const OrderList = () => {
  const dispatch = useDispatch();
  const orders = useSelector(state => state.order.orders);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { t } = useTranslation(["orderList"]);
  const locale = useLocale();

  const columns = [
    { field: "_id", headerName: t("id"), width: 200 },
    {
      field: "userId",
      headerName: t("user"),
      width: 200,
      renderCell: (params) => {
        return (
          <div className="orderListOrder">
            {params.row.userId}
          </div>
        );
      },
    },
    { field: "email", headerName: t("email"), width: 200 },
    {
      field: "status",
      headerName: t("status"),
      width: 120,
    },
    {
        field: "products",
        headerName: t("products"),
        width: 200,
        renderCell: (params) => {
            return (
                <ul className="productListItem">
                    {params.row.products.map(product => (
                        <li key={product._id}>
                            {product.title}/ 
                        </li>
                    ))}
                </ul>
            );
        }
    },
    {
        field: "amount",
        headerName: t("amount"),
        width: 150,
        renderCell: (params) => {
            return (
                <p>{params.row.amount} UAH</p>
            )
        }
    },
    {
        field: "address",
        headerName: t("address"),
        width: 150,
        renderCell: (params) => {
            return (
                <p>{params.row.address.city}</p>
            )
        }
    },
    {
      field: "createdAt",
      headerName: t("createdAt"),
      width: 160,
      renderCell: (params) => {
        return (
            <div>
                {format(params.row.createdAt, locale)}
            </div>
        )
      }
    },
    {
      field: "action",
      headerName: t("action"),
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/order/" + params.row._id}>
              <button className="orderListEdit">{t("view")}</button>
            </Link>
            <DeleteOutline
              className="orderListDelete"
              onClick={() => {
                setDeleteOrderId(params.row._id);
                setOpenDeleteDialog(true)                
              }}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="orderList">
      <DataGrid
        rows={orders}
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
      >
        <DialogTitle>{t("deleteConfirmation")} {deleteOrderId} ?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            {t("cancel")}
          </Button>
          <Button onClick={() => {
            deleteOrder(deleteOrderId, dispatch);
            setOpenDeleteDialog(false);
          }} color="primary" autoFocus>
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default OrderList;
