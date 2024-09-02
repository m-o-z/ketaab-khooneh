import React from 'react';
import {Center, Stack, Text} from "@mantine/core";
import {IconMoodEmpty} from "@tabler/icons-react";

const NotFound = () => {
    return (
        <Center flex={1} w="100%" mt={60}>
            <Stack align="center">
                <IconMoodEmpty size={60} />
                <Text>Not found!</Text>
            </Stack>
        </Center>
    );
};

export default NotFound;