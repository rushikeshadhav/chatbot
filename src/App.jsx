import { useState, useRef, useEffect } from "react";
import assistantImage from "./assets/assistantImage.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faEllipsisVertical,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [toggleDisplay, setToggleDisplay] = useState(false);
  const [toggleChat, setToggleChat] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef(null);

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
        setResponse(response);
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
      <div
        className={`flex absolute bottom-auto md:fixed ${
          isVisible ? "right-20" : "right-0"
        } md:right-32 md:bottom-32`}
      >
        <div
          className={`h-[80vh] md:h-[500px] w-screen md:w-[350px] relative ${
            toggleDisplay ? "block" : "hidden"
          }`}
        >
          <div className="bg-[--color-primary] flex w-full justify-between items-center text-white px-3 py-2 md:rounded-t-xl">
            <div className="flex items-center gap-2">
              <img
                className="w-[30px] md:w-[40px] rounded-full"
                src={assistantImage}
                alt="img"
              />
              <h2 className="text-lg">Chat with Assistant</h2>
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
            className="p-1 bg-[--color-white] h-full overflow-y-auto"
            ref={containerRef}
          >
            <ul className="flex flex-col">
              {conversationHistory.map((item, i) => {
                return item.role === "user" ? (
                  <li
                    className="max-w-[250px] bg-[--color-red] text-white px-3 py-1 rounded-l-xl rounded-tr-xl m-1 text-base self-end"
                    key={i}
                  >
                    {item.content}
                  </li>
                ) : (
                  <div className="flex items-end">
                    <img
                      className="w-[35px] h-[35px] rounded-full"
                      src={assistantImage}
                    />

                    <li
                      className="max-w-[250px] bg-[--color-secondary] px-3 py-1 rounded-r-xl rounded-tl-xl m-1 text-base self-start"
                      key={i}
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
                  <li className="max-w-[250px] bg-[--color-secondary] px-3 py-1 rounded-r-xl rounded-tl-xl m-1 text-base self-start">
                    Loading...
                  </li>
                </div>
              )}
            </ul>
          </div>
          <div className="bg-[--color-secondary] relative flex gap-5 justify-between items-center p-3 rounded-b-xl">
            <div className="w-full bg-[--color-white] flex items-center rounded-md px-2">
              <input
                value={message}
                type="text"
                placeholder="Type your message here..."
                className="h-[35px] w-full outline-none resize-none rounded-md"
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleEnter}
              />
              <FontAwesomeIcon
                className="cursor-pointer text-[--color-primary]"
                icon={faArrowRight}
                size="xl"
                onClick={handleSubmit}
              />
            </div>
            <div className="cursor-pointer px-2" onClick={handleMore}>
              <FontAwesomeIcon
                className="text-[--color-primary] mr-1"
                icon={faEllipsisVertical}
                size="xl"
              />
            </div>
            <div
              className={`absolute bottom-16 right-1 shadow-[0_0px_16px_rgba(3,27,137,0.25)] p-1 rounded-md cursor-pointer hover:bg-gray-100 ${
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
              className="w-[50px] ml-3 rounded-full fixed bottom-2 md:bottom-16 cursor-pointer"
              src={assistantImage}
              alt="img"
              onClick={handleContainerDisplay}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
