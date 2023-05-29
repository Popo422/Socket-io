import React, { useState } from "react";
import { Button, Box, Typography, TextField } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import SendIcon from "@mui/icons-material/Send";
import FlexBetween from "./FlexBetween";
import { SendOutlined } from "@mui/icons-material";
import moment from "moment/moment";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
const LiveChat = () => {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("Enter Room");
  const [messages, setMessages] = useState([]);
  const AddMessage = (message, type) => {
    setMessages([
      ...messages,
      {
        message: message,
        date: moment().format("h:mm:ss a"),
        type: type,
      },
    ]);
  };
  socket.on("connect", () => {
    AddMessage(`Your Connected to server ${socket.id}`, "sent");
  });
  socket.on("received", (message, type) => AddMessage(message, type));

  return (
    <Box
      maxWidth="30rem"
      className="container"
      display="flex"
      flexDirection="column"
    >
      <FlexBetween
        className="ChatHead"
        height="4rem"
        backgroundColor="#33F3FF"
        borderRadius="1.5rem 1.5rem 0 0"
        padding="0.2rem 1rem"
        // box-shadow="5px 5px 5px gray"
        boxShadow="5px 5px 5px gray"
      >
        <Typography variant="h2" fontSize="20px" fontWeight="bold" color="#fff">
          LIVECHAT
        </Typography>
        <Box display="flex" position="inherit">
          <CloseOutlinedIcon />
        </Box>
      </FlexBetween>
      <Box
        className="Body"
        height="30rem"
        overflow="auto"
        backgroundColor="#fff"
        padding="1rem"
        boxShadow="5px 5px 5px gray"
      >
        {messages.map((index) => {
          return index.type == "sent" ? (
            <Box mb="1rem" flexDirection="column" alignItems="flex-start">
              <Box
                className="ChatBubble"
                backgroundColor="lightseagreen"
                display="flex"
                width="fit-content"
                padding="1rem 1rem"
                borderRadius="14px"
              >
                <Typography>{index.message}</Typography>
              </Box>
              <Box className="time">
                <Typography>{index.date}</Typography>
              </Box>
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-end"
              mb="1rem"
            >
              <Box
                className="ChatBubble"
                backgroundColor="darkgray"
                display="flex"
                width="fit-content"
                padding="1rem 1rem"
                borderRadius="14px"
              >
                <Typography>{index.message}</Typography>
              </Box>
              <Box className="time">
                <Typography>{index.date}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
      <FlexBetween
        className="SendBar"
        height="5rem"
        backgroundColor="#BEBEBE"
        padding="0.2rem 1rem"
        boxShadow="5px 5px 5px gray"
      >
        <FlexBetween className="SendBar holder">
          <AddCircleOutlinedIcon />
          <ImageOutlinedIcon />
        </FlexBetween>
        <Box width="19rem" className="TEST" backgroundColor="#E0E0E0">
          <TextField
            backgroundColor="#fff"
            id="outlined-basic"
            fullWidth
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
        </Box>
        <Box>
          <Button
            variant="contained"
            onClick={() => {
              AddMessage(message, "sent");
              socket.emit("customEvent", message, room);
              setMessage("");
            }}
          >
            <SendIcon />
            SEND
          </Button>
        </Box>
      </FlexBetween>
      <Box className="RoomBar" boxShadow="5px 5px 5px gray" display="flex">
        <Box
          className="RoomField"
          backgroundColor="#BEBEBE"
          width="24rem"
          flexGrow="1"
        >
          <TextField
            backgroundColor="#fff"
            id="outlined-basic"
            fullWidth
            value={room}
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          />
        </Box>
        <Box
          display="flex"
          className="buttonContainer"
          width="auto"
          justifyContent="center"
          alignItems="center"
          flexGrow="2"
        >
          <Button
            variant="contained"
            onClick={() => {
              socket.emit("join-room", room, (message) =>
                AddMessage(message, "sent")
              );
            }}
          >
            JOIN
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LiveChat;
