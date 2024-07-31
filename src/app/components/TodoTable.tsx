import {IItem} from "@/app/pages/TodoList";
import {Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Button, Checkbox} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {useState} from "react";
import {boolean, number} from "yup";
import {formatDate} from "@/app/utils/FormateDate";


interface TableProps {
    items: IItem[],
    onRemove: (id: number) => void,
    onEdit: (item: IItem) => void,
    onReset?: () => boolean,
    setItemsChecked: (items) => void
}

function TodoTable({items, onRemove, onReset, onEdit, setItemsChecked}: TableProps) {

    const [checked, setChecked] = useState<number[]>([])

    const handleCheckboxClick = (id) => {
        let updatedChecked;

        if (checked.includes(id)) {
            updatedChecked = checked.filter(itemId => itemId !== id);
        } else {
            updatedChecked = [...checked, id];
        }

        setChecked(updatedChecked);
        setItemsChecked(updatedChecked);
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table" items={items} onRemove={onRemove} onReset={onReset}>
                <TableHead>
                    <TableRow>
                        <TableCell><Checkbox/></TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Description</TableCell>
                        <TableCell align="center">Priority</TableCell>
                        <TableCell align="center">Created at</TableCell>
                        <TableCell align="center">Due date</TableCell>
                        <TableCell align="center">Tag</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                <Checkbox onClick={() => handleCheckboxClick(row)}/>
                            </TableCell>
                            <TableCell align="left">{row.name}</TableCell>
                            <TableCell align="left">{row.description}</TableCell>
                            <TableCell align="center">{row.priority}</TableCell>
                            <TableCell align="center">{formatDate(row.createdAt)}</TableCell>
                            <TableCell align="center">{formatDate(row.dueDate)}</TableCell>
                            <TableCell align="center">{row.tag}</TableCell>
                            <TableCell align="center"
                                       sx={{backgroundColor: row.isComplete ? "green" : "red"}}>{row.isComplete ? "Complete" : "Incomplete"}</TableCell>
                            <TableCell align="center">
                                <Button onClick={() => onRemove(row.id)} startIcon={<DeleteIcon/>}/>
                                <Button onClick={() => onEdit({...row, id: row.id})} startIcon={<EditIcon/>}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TodoTable;
