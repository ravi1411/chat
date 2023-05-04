import {FormLabel, FormControl, InputGroup, Input, VStack, Button, InputRightElement} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { valid } from "../Util/valid";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "./Loader";

const Register = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const initialState = {name: "", email: "", password: "", cnfpassword: "", pic: "", };
  
  const [userDetail, setUserDetail] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const navigate = useNavigate();
  const { name, email, password, cnfpassword, pic } = userDetail;

  const postDetails = (pics) => {
    setUploadingImage(true);
    if (pics === undefined) {
      toast.warn("Please add a Profile Picture");
      return;
    }
    if (pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "DELinkChatApp");
      data.append("cloud_name", "dfcaehp0b");
      fetch("https://api.cloudinary.com/v1_1/dfcaehp0b/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUserDetail({ ...userDetail, ["pic"]: data.url.toString() });
          setUploadingImage(false);
        })
        .catch((err) => {
          toast.error(err);
          setUploadingImage(false);
        });
    } else {
      toast.error("Invalid format of Image\n Only .png accepted");
      setUploadingImage(false);
      return;
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetail({ ...userDetail, [name]: value });
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    const message = valid(name, email, password, cnfpassword);
    if (message) return toast.warn(message);
    // ? request
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      console.log(name, email, password, pic);
      const { data } = await axios.post(
        "/api/users",
        { name, email, password, pic },
        config
      );
      toast.info("User Registered Successfully");
      localStorage.setItem("deLinkUser", JSON.stringify(data));
      setIsLoading(false);
      navigate("/chats");
    } catch (error) {
      toast.error(error);
      setIsLoading(false);
      return;
    }
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <VStack spacing="30px">
      <FormControl id="name" isRequired>
        <FormLabel mb="0px">Name</FormLabel>
        <Input onChange={handleChange} name="name" value={name} size="md" placeholder="eg. John Doe"/>
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel mb="0px">Email</FormLabel>
        <Input onChange={handleChange} name="email" value={email} size="md" placeholder="eg. John.Doe@outlook.com"/>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel mb="0px">Password</FormLabel>
        <InputGroup size="md">
          <Input pr="4.5rem" type={show ? "text" : "password"} placeholder="Enter password" onChange={handleChange} name="password" value={password}/>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="xs" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="cnfpassword" isRequired>
        <FormLabel mb="0px">Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input pr="4.5rem" type={show ? "text" : "password"} placeholder="Please re-enter password" onChange={handleChange} name="cnfpassword" value={cnfpassword}/>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="xs" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel mb="0px">Upload Profile Picture</FormLabel>
        <Input type="file" onChange={(e) => postDetails(e.target.files[0])} accept="image/*" name="pic" size="xl" />
      </FormControl>

      <Button bg={"#1d1931"} colorScheme={"green"} color="#fff" width="100%" style={{ marginTop: "40px" }} onClick={handleSubmit} isLoading={uploadingImage}>
        Register
      </Button>
      
    </VStack>
  );
};

export default Register;
