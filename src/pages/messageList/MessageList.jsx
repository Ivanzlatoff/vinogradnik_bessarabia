import "./messageList.css";
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateMessage } from "../../redux/apiCalls";
import {format} from 'timeago.js';
import { useTranslation } from 'react-i18next';
import { useLocale } from "../../constants";


const MessageList = () => {
    const dispatch = useDispatch();
    const messages = useSelector(state => state.message.messages);
    const { t } = useTranslation(["messageList"]);
    const locale = useLocale();

    const handleToggleRead = (message) => {
        const messageToUpdate = {
            ...message,
            read: !message.read
        }
        updateMessage(message._id, messageToUpdate, dispatch);
    };

  return (
    <div className='messagesContainer'>
        <h1 className="messagesTitle">{t("title")}</h1>
        {messages?.map(message => {
            return (
                <div className="messageBlock" key={message._id}>
                    <button className={message.read ? "markRead" : "markNotRead"} onClick={() => handleToggleRead(message)}></button>
                    <div className={message.read ? "messageDetails read" : "messageDetails notRead"} onClick={() => handleToggleRead(message)}>
                        <div className="topLineList">
                           <b>{t("receivedFromUsername")}</b>: {message.username}
                        </div>
                        <div className="middleLine">
                            <div className="emailLine"><b>{t("email")}</b>: {message.email}</div>
                        </div>
                        <div className="middleLine">
                            <div className="subjectLine"><b>{t("subject")}</b>: {message.subject}</div>
                        </div>
                        <div className="messageBlock">
                            <div className="messageLine">{message.message.substring(0,100)}...</div>
                        </div>
                        <div className="bottomLine">
                            ({format(message.createdAt, locale)})
                        </div>
                    </div>
                    <NavLink to={`/message/${message._id}`} className="viewLink">
                        {t("viewMessage")}
                    </NavLink>
                </div>
            )
        })}
    </div>
  )
}

export default MessageList
