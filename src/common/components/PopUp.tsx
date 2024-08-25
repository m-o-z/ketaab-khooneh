import React from 'react';
import {useMediaQuery} from "@mantine/hooks";
import {Drawer, Modal} from "@mantine/core";

type Props = {
    title?: string;
    opened: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const PopUp = ({ opened, onClose, children, title }: Props) => {
    const isMobile = useMediaQuery('(max-width: 768px)')
    if (isMobile) {
        return <Drawer position="bottom" title={title} opened={opened} onClose={onClose}>{children}</Drawer>
    }
    return <Modal title={title} opened={opened} onClose={onClose}>{children}</Modal>;
};

export default PopUp;