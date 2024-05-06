import {Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast} from '@chakra-ui/react';
import axios from 'axios';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'

const Signup = () => {

    let [name,setName] =useState()
    let [email,setEmail] =useState()
    let [password,setPassword] =useState()
    let [confirmPassword,setConfirmPassword] =useState()
    let [pic,setPic] =useState()
    let [show,setShow] =useState(false)
    let [loading, setLoading] = useState(false)
    let navigation = useNavigate()

    const toast = useToast()

    let handleClick = () => setShow(!show)

    let postDetails = (pics) => {
        setLoading(true)
        if(pics=== undefined){
            toast({
                title: 'Please Select an Image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            })
            return;
        }

        if(pics.type === "image/jpeg" || pics.type === "image/png") {
            let data =  new FormData()
            data.append("file", pics);
            data.append("upload_preset","chat-app")
            data.append("cloud_name","dmtaqexke")
            fetch("https://api.cloudinary.com/v1_1/dmtaqexke/image/upload", {
                method:"post",
                body:data,
            }).then((res) => res.json())
            .then(data => {
                setPic(data.url.toString());
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            })
        } else {
            toast({
                title: 'Please Select an Image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            })
            return;
        }
    } 

    let submitHandler = async () => {
        setLoading(true)
        if(!name || !email || !password || !confirmPassword){
            toast({
                title: 'Please Fill all the Fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            })
            setLoading(false);
            return;
        }

        if(password !== confirmPassword){
            toast({
                title: 'Passwords Do Not Match',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            })
            setLoading(false);
            return;
        }

        try {
            let config = {
                headers: {
                    "Content-type": "application/json",
                },
            }

            const { data } = await axios.post("/api/user/register", {name,email,password,pic},config)
            toast({
                title: 'Registeration Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            })

            localStorage.setItem('userInfo',JSON.stringify(data))
            setLoading(false)
            navigation("/chats")
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description:error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            })
            setLoading(false)
        }
    }

    return (
        <VStack spacing="5px">
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter your name'
                    onChange={(e)=> setName(e.target.value)}
                />
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    type='email'
                    placeholder='Enter your email'
                    onChange={(e)=> setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show?'text':'password'}
                        placeholder='Enter your password'
                        onChange={(e)=> setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show?'text':'password'}
                        placeholder='Confirm password'
                        onChange={(e)=> setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            
            <FormControl id="pic">
                <FormLabel>Upload Your Picture</FormLabel>
                <Input
                    type='file'
                    p={1.5}
                    accept='image/*'
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>

            <Button
                colorScheme='blue'
                width="100%"
                style={{marginTop:15}}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    );
}

export default Signup;