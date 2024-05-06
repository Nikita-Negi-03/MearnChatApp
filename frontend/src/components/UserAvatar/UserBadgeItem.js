import React from 'react';
import {ChatState} from '../../context/chatProvider';
import {Avatar, Box, Text} from '@chakra-ui/react';
import {CloseIcon} from '@chakra-ui/icons'


const UserBadgeItem = ({user,handleFunction }) => {

   

    return (
        <Box
            onClick={handleFunction}
            cursor="pointer"
            fontSize={12}
            bgColor="purple"
            color="white"
            variant="solid"
            px={2}
            py={1}
            m={1}
            mb={2}
            borderRadius="lg"
        >
            {user.name}
            <CloseIcon pl={1} />
        </Box>
    );
}

export default UserBadgeItem;