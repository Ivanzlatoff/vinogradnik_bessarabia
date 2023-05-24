import "./userList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser } from "../../redux/apiCalls";
import { useTranslation } from "react-i18next";
import { 
  Dialog, 
  DialogTitle, 
  DialogActions, 
  Button 
} from '@material-ui/core';
import { selectAllUsers } from "../../redux/userRedux";

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { t } = useTranslation(["userList"])
  
  const columns = [
    { field: "_id", headerName: t("id"), width: 200 },
    {
      field: "username",
      headerName: t("user"),
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            {/* <img className="userListImg" src={params.row.avatar} alt="" /> */}
            {params.row.username}
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
      field: "transaction",
      headerName: t("transaction_volume"),
      width: 160,
    },
    {
      field: "action",
      headerName: t("action"),
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/user/" + params.row._id}>
              <button className="userListEdit">{t("edit")}</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => {
                setDeleteUserId(params.row._id);
                setOpenDeleteDialog(true)                
              }}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="userList">
      <Link to="/newUser">
        <button className="createButton">{t("createNewUser")}</button>
      </Link>
      {!!users.length && <DataGrid
        rows={users}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={8}
        checkboxSelection
      />}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>{t("deleteConfirmation")} {deleteUserId} ?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            {t("cancel")}
          </Button>
          <Button onClick={() => {
            deleteUser(deleteUserId, dispatch);
            setOpenDeleteDialog(false);
          }} color="primary" autoFocus>
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserList;
