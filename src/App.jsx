import { useState, useRef, useEffect } from "react";
import assistantImage from "./assets/assistantImage.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faEllipsisVertical,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

window.config;
function App() {
  const [message, setMessage] = useState("");
  const [toggleDisplay, setToggleDisplay] = useState(false);
  const [toggleChat, setToggleChat] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [title, setTitle] = useState("Chat With Assistant");
  const [formData, setFormData] = useState({
    title: "",
    avatar: "",
    field1: "",
    field2: "",
    field3: "",
    field4: "",
  });
  const [originalColors, setOriginalColors] = useState({
    primary: "#20a8bf",
    secondary: "#eaeaea",
    userTextBg: "#ec277c",
    textColor: "#fff",
  });
  const containerRef = useRef(null);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleForm(e) {
    e.preventDefault();
    await axios
      .post("https://chatbot-backend-tj1j.onrender.com/form", formData)
      .then((response) => {
        window.config = response.data;
        setOriginalColors(window.config.colors);
      })
      .catch((error) => {
        console.error(error);
      });
    setTitle(window.config.title);
  }

  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [conversationHistory]);

  function handleClearChat() {
    setToggleChat(!toggleChat);
    setConversationHistory([]);
  }

  function handleMore() {
    setToggleChat(!toggleChat);
  }

  function handleContainerDisplay() {
    setIsVisible(!isVisible);
    setToggleDisplay(!toggleDisplay);
  }

  async function handleResponse(message) {
    setIsLoading(true);
    await axios
      .post("https://chatbot-backend-tj1j.onrender.com/chat", {
        message,
      })
      .then((res) => {
        const response = res.data.message;
        setConversationHistory((prev) => {
          return [
            ...prev,
            {
              id: conversationHistory.length + 1,
              content: response,
              role: "assistant",
            },
          ];
        });
        setIsLoading(false);
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error.response.status);
        setConversationHistory((prev) => {
          return [
            ...prev,
            {
              id: conversationHistory.length + 1,
              content: error.response.data,
              role: "assistant",
            },
          ];
        });
      });
  }

  function handleSubmit() {
    if (message.trim() !== "") {
      const newMessage = {
        id: conversationHistory.length + 1,
        content: message,
        role: "user",
      };

      setConversationHistory([...conversationHistory, newMessage]);
      setMessage("");
      handleResponse(message);
    }
  }
  function handleEnter(e) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div>
      <div className="absolute">
        <form onSubmit={handleForm} className="flex flex-col gap-10 m-5">
          <div>
            <label htmlFor="title">Title: </label>
            <input
              className="outline outline-1"
              type="text"
              id="title"
              name="title"
              value={formData.input1}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="avatar">Avatar: </label>
            <input
              className="outline outline-1"
              type="text"
              id="avatar"
              name="avatar"
              value={formData.input2}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="field1">Primary Color: </label>
            <input
              className="outline outline-1"
              type="text"
              id="field1"
              name="field1"
              value={formData.field1}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="field2">Secondary Color: </label>
            <input
              className="outline outline-1"
              type="text"
              id="field2"
              name="field2"
              value={formData.field2}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="field3">User Text Background: </label>
            <input
              className="outline outline-1"
              type="text"
              id="field3"
              name="field3"
              value={formData.field3}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="field4">Text Color: </label>
            <input
              className="outline outline-1"
              type="text"
              id="field4"
              name="field4"
              value={formData.field4}
              onChange={handleChange}
              required
            />
          </div>
          <button
            className="bg-[#20a8bf] w-1/4 p-2 text-white rounded-md cursor-pointer"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
      <div
        className={`flex absolute bottom-auto md:fixed  ${
          isVisible ? "right-20" : "right-0"
        } md:right-32 md:bottom-32`}
      >
        <div
          className={`h-[80vh] md:h-[500px] w-screen md:w-[350px] relative ${
            toggleDisplay ? "block" : "hidden"
          }`}
        >
          <div
            className="flex w-full justify-between items-center px-3 py-2 md:rounded-t-xl shadow-[0_0px_16px_rgba(3,27,137,0.25)]"
            style={{
              backgroundColor: originalColors.primary,
              color: originalColors.textColor,
            }}
          >
            <div className="flex items-center gap-2">
              <img
                className="w-[30px] md:w-[40px] rounded-full"
                src={assistantImage}
                alt="img"
              />
              <h2 className="text-lg">{title}</h2>
            </div>
            <FontAwesomeIcon
              className="cursor-pointer"
              icon={faXmark}
              color="white"
              size="2xl"
              onClick={handleContainerDisplay}
            />
          </div>
          <div
            className="bg-[#fff] p-1 h-full overflow-y-auto shadow-[0_0px_16px_rgba(3,27,137,0.25)]"
            ref={containerRef}
          >
            <ul className="flex flex-col">
              {conversationHistory.map((item, i) => {
                return item.role === "user" ? (
                  <li
                    className="max-w-[250px] px-3 py-1 rounded-l-xl rounded-tr-xl m-1 text-base self-end"
                    style={{
                      color: originalColors.textColor,
                      backgroundColor: originalColors.userTextBg,
                    }}
                    key={i}
                  >
                    {item.content}
                  </li>
                ) : (
                  <div className="flex items-end" key={i}>
                    <img
                      className="w-[35px] h-[35px] rounded-full"
                      src={assistantImage}
                    />

                    <li
                      className="max-w-[250px] px-3 py-1 rounded-r-xl rounded-tl-xl m-1 text-base self-start"
                      style={{
                        color: "#000",
                        backgroundColor: originalColors.secondary,
                      }}
                    >
                      {item.content}
                    </li>
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex items-end">
                  <img
                    className="w-[35px] h-[35px] rounded-full"
                    src={assistantImage}
                  />
                  <li
                    className="max-w-[250px] px-3 py-1 rounded-r-xl rounded-tl-xl m-1 text-base self-start"
                    style={{ backgroundColor: originalColors.secondary }}
                  >
                    Loading...
                  </li>
                </div>
              )}
            </ul>
          </div>
          <div
            className="relative flex gap-5 justify-between items-center p-3 rounded-b-xl"
            style={{ backgroundColor: originalColors.secondary }}
          >
            <div className="w-full bg-white flex items-center rounded-md px-2">
              <input
                value={message}
                type="text"
                placeholder="Type your message here..."
                className="h-[35px] w-full outline-none resize-none rounded-md"
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleEnter}
              />
              <FontAwesomeIcon
                className="cursor-pointer"
                style={{ color: originalColors.primary }}
                icon={faArrowRight}
                size="xl"
                onClick={handleSubmit}
              />
            </div>
            <div className="cursor-pointer px-2" onClick={handleMore}>
              <FontAwesomeIcon
                className="mr-1"
                style={{ color: originalColors.primary }}
                icon={faEllipsisVertical}
                size="xl"
              />
            </div>
            <div
              className={`absolute bottom-16 right-1 shadow-[0_0px_16px_rgba(3,27,137,0.25)] p-1 rounded-md cursor-pointer ${
                toggleChat ? "block" : "hidden"
              }`}
              onClick={handleClearChat}
            >
              Clear Chat
            </div>
          </div>
        </div>
        {isVisible && (
          <div>
            <img
              className="w-[50px] ml-3 rounded-full fixed bottom-2 md:bottom-16 cursor-pointer block md:hidden"
              src={assistantImage}
              alt="img"
              onClick={handleContainerDisplay}
            />
          </div>
        )}
        <div>
          <img
            className="w-[50px] ml-3 rounded-full fixed bottom-2 md:bottom-16 cursor-pointer block"
            src={assistantImage}
            alt="img"
            onClick={handleContainerDisplay}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
