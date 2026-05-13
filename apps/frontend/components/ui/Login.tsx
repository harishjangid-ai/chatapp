import { Button, Form, Input, message } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import { UserType } from "../types/userType";
import { api } from "@/utils/api";
import { redirect } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth } from "@/redux/features/authSlice";

const Login = () => {
  const [userDetails, setUserDetails] = useState<UserType>({
    userName: "",
    password: "",
  });
  const dispatch = useAppDispatch();
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userName = userDetails.userName;
    const password = userDetails.password;
    if (!userName || !password) {
      return message.error("All fields are required");
    }
    const res = await api.post("/login", { userName, password });
    const data = res.data;
    if (!data.success) {
      return message.error(data.error);
    }
    dispatch(setAuth({ isAuth: true, user: data.user }));
    message.success(data.message);
    redirect("/");
  };

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col border border-gray-300/10 gap-2 max-h-screen p-5 rounded-2xl bg-white">
        <div className="flex flex-col items-center text-black">
          <h1 className="text-xl font  -bold">Login </h1>
        </div>
        <Form className="max-w-100 min-w-75" onSubmitCapture={handleLogin}>
          <Form.Item>
            <label htmlFor="" className="text-xs font-semibold">
              Username
            </label>
            <Input
              value={userDetails.userName}
              onChange={(e) =>
                setUserDetails({ ...userDetails, userName: e.target.value })
              }
              placeholder="Enter username"
              className="border border-gray-200!"
            />
          </Form.Item>

          <Form.Item>
            <label htmlFor="" className="text-xs font-semibold">
              Password
            </label>
            <Input.Password
              value={userDetails.password}
              onChange={(e) =>
                setUserDetails({ ...userDetails, password: e.target.value })
              }
              placeholder="Enter passowrd"
              className="border border-gray-200!"
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="flex w-full bg-gray-800! "
          >
            Log In
          </Button>
          <Link
            href="/signup"
            className="flex justify-center text-xs mt-2 text-black! font-semibold"
          >
            Don't have an account? Sign up
          </Link>
        </Form>
      </div>
    </main>
  );
};

export default Login;
