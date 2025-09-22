import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import {
  UserRole,
  type getRequestUsersDTO,
  type getUsersDTO,
} from "../../shared/types";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import React from "react";
import { getSocket } from "../../socket";
import { setRequestUsers, setUsers } from "../../redux/slices/roomSlice";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export const UsersSidebar = () => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const { users, requestUsers, roomId } = useSelector(
    (state: RootState) => state.room
  );
  const { role } = useSelector((state: RootState) => state.personal);
  const [showUsers, setShowUsers] = React.useState(true);
  const roleRef = React.useRef<UserRole>(null);

  React.useEffect(() => {
    roleRef.current = role;
  }, [role]);

  React.useEffect(() => {
    const handleGetUsers = ({ users }: { users: getUsersDTO[] }) => {
      dispatch(setUsers(users));
    };

    const handleRequestUsers = ({
      requestUsers,
    }: {
      requestUsers: getRequestUsersDTO[];
    }) => {
      if (roleRef.current === UserRole.ADMIN) {
        dispatch(setRequestUsers(requestUsers));
      }
    };

    socket.on("getUsers", handleGetUsers);
    socket.on("getRequestUsers", handleRequestUsers);

    return () => {
      socket.off("getUsers", handleGetUsers);
      socket.off("getRequestUsers", handleRequestUsers);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        minHeight: "25vh",
        maxHeight: "25vh",
        borderRadius: "5px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        color: "white",
        listStyle: "none",
        padding: 1,
      }}
    >
      <Box>
        <IconButton
          sx={{
            backgroundColor: showUsers
              ? "rgba(255, 255, 255, 0.7)"
              : "rgba(255, 255, 255, 0)",
          }}
          onClick={() => setShowUsers(true)}
        >
          <PeopleAltIcon />
        </IconButton>

        {roleRef.current === UserRole.ADMIN && (
          <IconButton
            sx={{
              backgroundColor: showUsers
                ? "rgba(255, 255, 255, 0)"
                : "rgba(255, 255, 255, 0.7)",
              position: "relative",
            }}
            onClick={() => setShowUsers(false)}
          >
            <PersonAddAlt1Icon />
            <Typography
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                color: "white",
                fontSize: "10px",
              }}
            >
              {requestUsers.length}
            </Typography>
          </IconButton>
        )}
      </Box>

      <Divider />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflow: "auto",
        }}
      >
        {showUsers ? (
          <List>
            {users.map((obj) => {
              let time;
              const objTime = obj.currentTimeMs;

              if (objTime > 3600) {
                time = `${Math.trunc(objTime / 3600)}:${
                  Math.trunc(
                    (objTime - Math.trunc(objTime / 3600) * 3600) / 60
                  ) < 10
                    ? "0" +
                      Math.trunc(
                        (objTime - Math.trunc(objTime / 3600) * 3600) / 60
                      )
                    : Math.trunc(
                        (objTime - Math.trunc(objTime / 3600) * 3600) / 60
                      )
                }:${
                  Math.trunc(objTime % 60) < 10
                    ? "0" + Math.trunc(objTime % 60)
                    : Math.trunc(objTime % 60)
                }`;
              } else {
                time = `${Math.trunc(objTime / 60)}:${
                  Math.trunc(objTime % 60) < 10
                    ? "0" + Math.trunc(objTime % 60)
                    : Math.trunc(objTime % 60)
                }`;
              }
              return (
                <ListItem key={obj.user.socketId} disablePadding>
                  <ListItemText
                    primary={`${obj.user.username}${
                      obj.role == UserRole.ADMIN ? "(admin) - " : " - "
                    } ${time}`}
                  />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <List>
            {requestUsers.map((obj) => (
              <ListItem key={obj.user.socketId} disablePadding>
                <ListItemText primary={obj.user.username} />
                <Box>
                  <IconButton
                    onClick={() => {
                      socket.emit("accessUserToJoinRoom", {
                        roomId,
                        socketId: obj.user.socketId,
                      });
                    }}
                  >
                    <CheckIcon sx={{ color: "green" }} />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      socket.emit("rejectUserToJoinRoom", {
                        roomId,
                        socketId: obj.user.socketId,
                      });
                    }}
                  >
                    <CloseIcon sx={{ color: "red" }} />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};
