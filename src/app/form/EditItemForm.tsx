import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormTextField from "@/app/formField/FormTextField";
import axios from "axios";
import {boolean} from "yup";
import {IItem} from "@/app/pages/TodoList";
import {intTime} from "yaml/dist/schema/yaml-1.1/timestamp";
import moment from "moment";

interface AddItemFormProps {
    addEditedItem?: (editedItem) => void,
    openEdit: boolean,
    item?: IItem,
    onClose: () => void
}

function EditItemForm({addEditedItem, openEdit, onClose, item}: AddItemFormProps) {

    const ItemSchema = yup.object().shape({
        name: yup.string().required("Name is required"),
        description: yup.string(),
        priority: yup.number(),
        createdAt: yup.date(),
        dueDate: yup.date(),
        tag: yup.string(),
        isComplete: yup.boolean(),
    })

    const {handleSubmit, control,reset, formState: {errors}} = useForm<IAddItemFormData>({
        resolver: yupResolver(ItemSchema),
    })

    const updateItem = (item) => {
        const newItemAdd = {
            id: item?.id,
            ...item,
            createdAt: new Date().toISOString(),
            dueDate: new Date(item.dueDate).toISOString(),
        }
        axios.put(`https://66a742e253c13f22a3cf044e.mockapi.io/api/v1/item/${item.id}`, newItemAdd)
            .then((response) => {
                onClose();
                if (addEditedItem) {
                    addEditedItem(newItemAdd)
                }
            })
            .catch((error) => {
                console.error("Error removing item: ", error);
            });
    }

    useEffect(() => {
        if (item) {
            // Format the dueDate to YYYY-MM-DD
            const formattedDueDate = moment(item.dueDate).format('YYYY-MM-DD');
            reset({
                id: item.id,
                name: item.name,
                description: item.description,
                dueDate: formattedDueDate,
            });
        }
    }, [item, reset]);

    return (
        <div>
            <Dialog open={openEdit} onClose={onClose}>
                <form onSubmit={handleSubmit(updateItem)} onReset={onClose}>
                    <DialogTitle>Add new item</DialogTitle>
                    <DialogContent>
                        <Grid container xs={12}>
                            <Grid>
                                <FormTextField name={"name"} control={control} errors={errors} label={"Name"}
                                               defaultValue={item?.name}/>
                            </Grid>
                            <Grid>
                                <FormTextField name={"description"} control={control} errors={errors}
                                               label={"Description"} defaultValue={item?.description}/>
                            </Grid>
                            <Grid>
                                <FormTextField name={"priority"} control={control} errors={errors} label={"Priority"}
                                               defaultValue={item?.priority}/>
                            </Grid>
                            <Grid>
                                <FormTextField name={"tag"} control={control} errors={errors} label={"Tag"}
                                               defaultValue={item?.tag}/>
                            </Grid>
                            <Grid>
                                <FormTextField name={"dueDate"} type={"date"} control={control} errors={errors}
                                               label={"Due date"} shrink defaultTime={item?.dueDate}/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit" color="primary" variant="contained">Submit</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>

    )
}

export default EditItemForm;

interface IAddItemFormData {

}