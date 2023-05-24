import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { login } from '../../redux/apiCalls';
import { useTranslation } from "react-i18next";


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const { currentUser, isFetching, error } = useSelector((state) => state.user);
    const { t } = useTranslation(["login"])   

    const handleClick = async (e) => {
      e.preventDefault();
      try {
        await login(dispatch, { username, password });
      } catch (err) {
        console.log(err)
      }
    };

  return (
    <div 
      style={{ 
        height: "100vh",
        width: "100vw",
        display: "flex" , 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center",
      }}
    >
      <input 
        style={{
          padding: "10px",
          marginBottom: "20px"
        }}
        type="text" 
        placeholder="username" 
        onChange={e=>setUsername(e.target.value)} 
      />
      <input 
        style={{
          padding: "10px",
          marginBottom: "20px"
        }}
        type="password" 
        placeholder="password" 
        onChange={e=>setPassword(e.target.value)} 
      />
      <button 
        style={{
          padding: 10,
          width: "100px"
        }}
        onClick={handleClick}
        disabled={isFetching}
      >
        {t("login")}
      </button>
      {error && <p style={{ color: "red" }}>{t("wrong")}</p>}
      {!error && currentUser && <Navigate to="/" />}
    </div>
  )
}

export default Login;
