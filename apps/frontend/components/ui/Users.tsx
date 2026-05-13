import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Input } from "antd";
import Chat from "./Chat";
import { SelectedUser, User } from "../types/userType";
import { api } from "@/utils/api";
import { useLogout } from "../methods/logoutMethod";
import { redirect } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useSocket } from "../hooks/useSocket";
import { registerUser } from "../methods/socketMethods";

const Users = () => {
  const [users, setUsers] = useState<User[]>();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>();
  const [selectedUser, setSelectedUser] = useState<SelectedUser | undefined>();
  const [search, setSearch] = useState<string>("");
  const [onlineUsersList, setOnlineUsers] = useState<string[] | undefined>([]);

  const user = useAppSelector((state) => state.auth.user);
  const socketRef = useSocket();
  const logout = useLogout();

  const getSelUser = async () => {
    const res = await api.get(`/selected-user/${id}`);
    const data = res.data;
    setSelectedUser(data);
  };

  const getUsers = async () => {
    const res = await api.get("/users", { withCredentials: true });
    const data = res.data;
    setUsers(data);
  };

  useEffect(() => {
    if (socketRef.current) {
      registerUser({ socket: socketRef.current, userId: user?._id });
      const handleOnlineUsers = (onlineUsers: string[]) => {
        setOnlineUsers(onlineUsers);
      };
      socketRef.current.on("get_online_users", handleOnlineUsers);
      getUsers();

      return () => {
        socketRef.current?.off("get_online_users", handleOnlineUsers);
      };
    }
  }, []);

  useEffect(() => {
    getSelUser();
  }, [id]);

  const handleChatOpen = ({ id }: { id: string }) => {
    setId(id);
    setOpen(true);
  };

  const handleLogout = () => {
    logout();
    redirect("/login");
  };

  const filteredUsers = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return users;
    return users?.filter(
      (user) =>
        user.fullName.toLowerCase().includes(s) ||
        user.userName.toLowerCase().includes(s),
    );
  }, [search, users]);

  const closeChat = () => {
    setOpen(false);
    setId("");
    setSelectedUser({
      userName: "",
      fullName: "",
      _id: "",
    });
  };

  return (
    <div className="flex w-full h-screen gap-2">
      <div className="w-full sm:w-[30%] lg:w-[20%] bg-white flex flex-col p-4 gap-5">
        <div className="flex justify-between">
          <h1>Welcome, {user?.fullName}</h1>
          <Button
            className="flex! sm:hidden! border-red-500! text-red-500! p-2 rounded-lg"
            icon={<LogoutOutlined />}
            type="default"
            onClick={handleLogout}
          />
        </div>
        <div className="flex">
          <Input
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200!"
          />
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto h-[90%]">
          {filteredUsers?.map((user, i) => (
            <div
              className={`w-full p-1 rounded-lg flex items-center gap-2 ${id == user._id ? "bg-gray-300" : "bg-gray-100 hover:bg-gray-200 duration-300"}`}
              key={i}
              onClick={() => handleChatOpen({ id: user._id })}
              title={
                onlineUsersList?.includes(user._id) ? "Online" : "Offline"
              }
            >
              <p className="bg-gray-300/30 px-3 text-black py-1 rounded-full text-xl relative">
                {user.fullName.charAt(0).toUpperCase()}
                <span
                  className={` bg-green-600 p-1 absolute rounded-full bottom-0.5 right-0.5 ${onlineUsersList?.includes(user._id) ? "flex" : "hidden"}`}
                />
              </p>
              <h2 className="font-light">{user.fullName}</h2>
            </div>
          ))}
        </div>
        <Button
          className="hidden! sm:flex! border-red-500! text-red-500! p-2 rounded-lg"
          icon={<LogoutOutlined />}
          type="default"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      {open ? (
        <main className="hidden sm:flex sm:flex-col sm:w-[70%] lg:w-[80%] gap-2">
          <nav className="bg-white flex mt-1 rounded-s-2xl px-1 py-1 items-center gap-3">
            <ArrowLeftOutlined
              className="cursor-pointer hover:bg-gray-300/30 p-2.5 rounded-full text-gray-500/50! duration-200"
              onClick={closeChat}
            />
            <div
              className="flex items-center gap-2 relative"
              title={
                selectedUser?._id &&
                onlineUsersList?.includes(selectedUser?._id)
                  ? "Online"
                  : "Offline"
              }
            >
              <UserOutlined className="bg-gray-300/30 p-2.5 rounded-full text-gray-500/50!" />
              <span
                className={`p-1 absolute rounded-full bottom-0.5 left-6.5 ${selectedUser?._id && onlineUsersList?.includes(selectedUser?._id) ? "bg-green-600" : " bg-red-600"}`}
              />
              <h1 className="text-lg">
                {selectedUser?.fullName}{" "}
                <span className="self-end font-thin text-xs">
                  ({selectedUser?.userName})
                </span>
              </h1>
            </div>
          </nav>
          <Chat id={id} getUsers={getUsers} />
        </main>
      ) : (
        <div className="hidden sm:w-[70%] lg:w-[80%] sm:flex items-center justify-center">
          <h2 className="text-lg text-gray-500">
            Select a user to start chatting...
          </h2>
        </div>
      )}
    </div>
  );
};

export default Users;
