import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormTextField from "@/app/formField/FormTextField";
import axios from "axios";

interface AddItemFormProps {
    addNewItem?: (newItem) => void
}

function AddItemForm({addNewItem}: AddItemFormProps) {

    const [open, setOpen] = useState(false)

    const ItemSchema = yup.object().shape({
        name: yup.string().required("Name is required"),
        description: yup.string(),
        priority: yup.number(),
        createdAt: yup.date(),
        dueDate: yup.date(),
        tag: yup.string(),
    })

    const {handleSubmit, control, formState: {errors}} = useForm<IAddItemFormData>({
        resolver: yupResolver(ItemSchema),
    })

    const handleClose = () => {
        setOpen(false)
    };

    const addItem = (item) => {
        const newItemAdd = {
            ...item,
            createdAt: new Date().toISOString(),
            dueDate: new Date(item.dueDate).toISOString(),
        }
        axios.post(`https://66a742e253c13f22a3cf044e.mockapi.io/api/v1/item`, newItemAdd)
            .then((response) => {

                if (addNewItem) {
                    addNewItem(newItemAdd)
                }

                handleClose();
            })
            .catch((error) => {
                console.error("Error removing item: ", error);
            });
    }

    return (
        <div>
            <Button startIcon={<AddIcon/>} onClick={() => setOpen(true)} variant="contained" color="success">Add
                new</Button>
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={handleSubmit(addItem)}>
                    <DialogTitle>Add new item</DialogTitle>
                    <DialogContent>
                        <Grid container xs={12}>
                            <Grid>
                                <FormTextField name={"name"} control={control} errors={errors} label={"Name"}/>
                            </Grid>
                            <Grid>
                                <FormTextField name={"description"} control={control} errors={errors}
                                               label={"Description"}/>
                            </Grid>
                            <Grid>
                                <FormTextField name={"priority"} control={control} errors={errors} label={"Priority"}/>
                            </Grid>
                            <Grid>
                                <FormTextField name={"tag"} control={control} errors={errors} label={"Tag"}/>
                            </Grid>
                            <Grid>
                                <FormTextField name={"dueDate"} type={"date"} control={control} errors={errors}
                                               label={"Due date"} shrink/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" color="primary" variant="contained">Submit</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>

    )
}

export default AddItemForm;

interface IAddItemFormData {

}