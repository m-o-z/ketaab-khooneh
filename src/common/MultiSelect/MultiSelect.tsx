import { MultiSelect as MantineMultiSelect, MultiSelectProps } from "@mantine/core";
import s from './MultiSeslect.module.scss'

const MultiSeslect = (props: MultiSelectProps) => {

    return (
        <MantineMultiSelect 
        classNames={{
            label: s.label,
            input: s.input,
            wrapper: s.wrapper,
        }} 
        {...props} />
    )
}

export default MultiSeslect;
