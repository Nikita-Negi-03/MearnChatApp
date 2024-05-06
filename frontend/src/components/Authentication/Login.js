import {Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast} from '@chakra-ui/react';
import axios from 'axios';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'

const Login = () => {

    let [email,setEmail] =useState()
    let [password,setPassword] =useState()
    let [show,setShow] =useState(false)
    let [loading, setLoading] = useState(false)
    let navigation = useNavigate()

    const toast = useToast()

    let handleClick = () => setShow(!show)

    let postDetails = (pics) => {} 

    let submitHandle = async() => {
        setLoading(true)
        if( !email || !password ){
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

        try {
            let config = {
                headers: {
                    "Content-type": "application/json"
                },
            }

            const { data } = await axios.post("/api/user/login", {email,password},config)
            toast({
                title: 'Login Successfully',
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
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    type='email'
                    value={email}
                    placeholder='Enter your email'
                    onChange={(e)=> setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show?'text':'password'}
                        value={password}
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

            <Button
                colorScheme='blue'
                width="100%"
                style={{marginTop:15}}
                onClick={submitHandle}
                isLoading={loading}
            >
                Login
            </Button>
            <Button
                variant="solid"
                colorScheme='red'
                width="100%"
                onClick={()=> {
                    setEmail("guest@example.com");
                    setPassword("12345");
                }}
            >
                Get Guest User Credential
            </Button>
        </VStack>
    );
}

export default Login;