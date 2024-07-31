"use client";

import TodoTable from "@/app/components/TodoTable";
import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Grid} from "@mui/material";
import AddItemForm from "@/app/form/AddItemForm";
import EditItemForm from "@/app/form/EditItemForm";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';

function TodoList() {
    const [items, setItems] = useState<IItem[]>([]);
    const [editItem, setEditItem] = useState<IItem>();
    const [openEdit, setOpenEdit] = useState(false);
    const [checked, setChecked] = useState<IItem[]>([])

    const addItem = (newItem) => {
        setItems(prevItems => [...prevItems, newItem]);
    }

    const onEditItem = (updatedItem) => {
        const updatedItemWithISODate = {
            ...updatedItem,
            createdAt: new Date(updatedItem.createdAt).toISOString()
        };
        setItems(prevItems => prevItems.map(item =>
            item.id === updatedItemWithISODate.id ? updatedItemWithISODate : item
        ));
    }

    const onClose = () => {
        setOpenEdit(false);
        setEditItem(null);
    }

    const onRemove = (id: number) => {
        axios.delete(`https://66a742e253c13f22a3cf044e.mockapi.io/api/v1/item/${id}`)
            .then((response) => {
                console.log("Item removed");
                // Remove the item from the state
                setItems((prevItems) => prevItems.filter((item) => item.id !== id));
            })
            .catch((error) => {
                console.error("Error removing item: ", error);
            });
    };

    const multipleDelete = () => {
        checked.forEach(item => onRemove(item.id));
        setChecked([])
    };

    function onEdit(item: IItem) {
        setEditItem(item);
        setOpenEdit(true)
    }

    const changeStatus = () => {
        checked.forEach(item => updateItem(item));
        setChecked([]);

    }

    const updateItem = (item) => {
        const newItemAdd = {
            ...item,
            isComplete: !item.isComplete
        };

        return axios.put(`https://66a742e253c13f22a3cf044e.mockapi.io/api/v1/item/${item.id}`, newItemAdd)
            .then((response) => {
                setItems(prevItems => prevItems.map(i =>
                    i.id === item.id ? { ...i, isComplete: !i.isComplete } : i
                ));
            })
            .catch((error) => {
                console.error("Error updating item: ", error);
            });
    };


    useEffect(() => {
        // API call only when component mounts
        axios.get(`https://66a742e253c13f22a3cf044e.mockapi.io/api/v1/item`)
            .then((response) => {
                setItems(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    }, []); // Empty dependency array ensures this runs only once


    return (
        items.length > 0 ?
            <div>
                <Grid
                    sx={{marginTop: "50px", marginBottom: "15px"}}
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid item xs={6}>
                        <AddItemForm addNewItem={addItem}/>
                    </Grid>
                    <Grid item xs={6}>
                        <Button onClick={multipleDelete} startIcon={<DeleteIcon/>} variant="contained">Multiple
                            delete</Button>
                        <Button onClick={changeStatus} startIcon={<DoneIcon/>} variant="contained">Change
                            status</Button>
                    </Grid>
                </Grid>


                <TodoTable items={items} onRemove={onRemove} onEdit={onEdit}
                           setItemsChecked={(items) => setChecked(items)}/>
                <EditItemForm item={editItem as IItem} addEditedItem={onEditItem} openEdit={openEdit}
                              onClose={onClose}/>
            </div>
            : null
    );
}

export default TodoList;

export interface IItem {
    id: number;
    name: string;
    description: string;
    priority: number;
    createdAt: string;
    dueDate: string;
    tag: string;
    isComplete: boolean;
}
