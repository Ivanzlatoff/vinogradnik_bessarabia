import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@material-ui/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import "./user.css";
import {format} from 'timeago.js';
import { useTranslation } from 'react-i18next';
import { useState } from "react";
import { updateUser } from "../../redux/apiCalls";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
import { selectMessagesByUser } from "../../redux/messageRedux";
import { useLocale } from "../../constants";


const User = () => {
  const location = useLocation();
  const userId = location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["user"]);
  const user = useSelector((state) => 
  state.user.users.find(user => user._id === userId)
  );
  const messagesByUser = useSelector(state => selectMessagesByUser(state, userId));
  const [inputs, setInputs] = useState({});
  const [ file, setFile ] = useState(null);
  const locale = useLocale();

  const handleChange = (e) => {
    setInputs(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (file) {
      const fileName = new Date().getTime() + file.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
        case 'paused':
            console.log('Upload is paused');
            break;
        case 'running':
            console.log('Upload is running');
            break;
        default:
        }        
      },
      (error) => {
          // Handle unsuccessful uploads
      },     
      () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              const userToUpdate = { 
                  ...user,
                  ...inputs,  
                  img: downloadURL, 
              };
              updateUser(userId, userToUpdate, dispatch);
          });
      },
      navigate('/users/')
      );
    } else {
      const userToUpdate = {
        ...user,
        ...inputs
      }
      updateUser(userId, userToUpdate, dispatch);
      navigate('/users/');
    }
  };


  return (
    <div className="user">
      <div className="userTitleContainer">
        <div className="userShowTopTitle">
          <span className="userShowUsername">{user?.username}</span>
          <span className="userShowUserTitle">{user?.email}</span>
          <span className="userShowUserTitle">{format(user?.createdAt, locale)}</span>
        </div>
        <h1 className="userTitle">{t("editTitle")}</h1>
        <Link to="/newUser">
          <button className="userAddButton">{t("createButton")}</button>
        </Link>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              src={user?.img ? user.img : "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
              alt=""
              className="userShowImg"
            />
            <div className="userShowTopTitle">
              <span className="userShowUsername">{user?.username ? user.username : t("unknown")}</span>
              <span className="userShowUserTitle">{user?.title ? user.title : t("unknown")}</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">{t("accountDetails")}</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">{user?.username ? user.username : t("unknown")}</span>
            </div>
            <div className="userShowInfo">
              <CalendarToday className="userShowIcon" />
              <span className="userShowInfoTitle">{user?.dob ? user.dob : t("birthday")}</span>
            </div>
            <span className="userShowTitle">{t("contactDetails")}</span>
            <div className="userShowInfo">
              <PhoneAndroid className="userShowIcon" />
              <span className="userShowInfoTitle">{user?.phone ? user.phone : t("phone")}</span>
            </div>
            <div className="userShowInfo">
              <MailOutline className="userShowIcon" />
              <span className="userShowInfoTitle">{user?.email ? user.email : t("email")}</span>
            </div>
            <div className="userShowInfo">
              <LocationSearching className="userShowIcon" />
              <span className="userShowInfoTitle">{user?.address ? user.address : t("address")}</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">{t("edit")}</span>
          <form className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>{t("username")}</label>
                <input
                  type="text"
                  name="username"
                  placeholder={user?.username ? user.username : t("unknown")}
                  className="userUpdateInput"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="userUpdateItem">
                <label>{t("fullName")}</label>
                <input
                  type="text"
                  name="fullname"
                  placeholder={user?.fullname ? user.fullname : t("fullName")}
                  className="userUpdateInput"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="userUpdateItem">
                <label>{t("email")}</label>
                <input
                  type="text"
                  name="email"
                  placeholder={user?.email ? user.email : t("email")}
                  className="userUpdateInput"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="userUpdateItem">
                <label>{t("phone")}</label>
                <input
                  type="text"
                  name="phone"
                  placeholder={user?.phone ? user.phone : t("phone")}
                  className="userUpdateInput"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="userUpdateItem">
                <label>{t("birthday")}</label>
                <input
                  type="date"
                  name="dob"
                  placeholder={user?.dob ? user.dob : t("birthday")}
                  className="userUpdateInput"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="userUpdateItem">
                <label>{t("address")}</label>
                <input
                  type="text"
                  name="address"
                  placeholder={user?.address ? user.address : t("address")}
                  className="userUpdateInput"
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img
                  className="userUpdateImg"
                  src={user?.img ? user.img : "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
                  alt=""
                />
                <label htmlFor="file">
                  <Publish className="userUpdateIcon" />
                </label>
                <input type="file" id="file" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])}/>
              </div>
              <button className="userUpdateButton" onClick={handleUpdateUser}>{t("updateButton")}</button>
            </div>
          </form>
        </div>
      </div>
      <div className="userNotifications">
        <h2>{t("notifications")}</h2>
        <ul className="notificationsList">
          {messagesByUser.map(message => (
            <li key={message._id}>
              <Link 
                to={`/message/${message._id}`}
                className="notificationItem"
              >
                {message.subject} <i>{format(message?.createdAt, locale)}</i>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default User;
