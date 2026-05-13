import { Button, Form, Input, message } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import { NewUserType } from "../types/userType";
import { api } from "@/utils/api";
import { redirect } from "next/navigation";

const SignUp = () => {
  const [userDetails, setUserDetails] = useState<NewUserType>({
    userName: "",
    password: "",
    fullName: "",
  });

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullName = userDetails.fullName.trim();
    const userName = userDetails.userName;
    const password = userDetails.password;
    const userNameRegeex = /^[a-z0-9_]+$/;
    if (!userNameRegeex.test(userName)) {
      return message.error(
        "Username can only contain lowercase letters, numbers, and underscores",
      );
    }
    if (!userName || !password || !fullName) {
      return message.error("All fields are required");
    }
    const res = await api.post("/signup", { userName, password, fullName });
    const data = res.data;
    if (!data.success) {
      return message.error(data.error);
    }
    message.success(data.message);
    redirect("/login");
  };

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col border border-gray-300/10 gap-2 max-h-screen p-5 rounded-2xl bg-white">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font  -bold">SignUp </h1>
        </div>
        <Form className="max-w-100 min-w-75" onSubmitCapture={handleSignUp}>
          <Form.Item>
            <label htmlFor="" className="text-xs font-semibold">
              Full Name
            </label>
            <Input
              value={userDetails.fullName}
              onChange={(e) =>
                setUserDetails({ ...userDetails, fullName: e.target.value })
              }
              placeholder="Enter Full Name"
              className="border border-gray-200!"
            />
          </Form.Item>
          <Form.Item>
            <label htmlFor="" className="text-xs font-semibold">
              User Name
            </label>
            <Input
              value={userDetails.userName}
              onChange={(e) =>
                setUserDetails({ ...userDetails, userName: e.target.value })
              }
              placeholder="Enter new user name"
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
              placeholder="Enter New passowrd"
              className="border border-gray-200!"
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="flex w-full bg-gray-800!"
          >
            Sign Up
          </Button>
          <Link
            href="/login"
            className="flex justify-center text-xs mt-2 text-black! font-semibold"
          >
            Already have an account? Login
          </Link>
        </Form>
      </div>
    </main>
  );
};

export default SignUp;
