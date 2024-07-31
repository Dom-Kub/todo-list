import { TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { FC, BaseSyntheticEvent } from "react";
import { FieldErrors } from "react-hook-form/dist/types/errors";
import moment from "moment";

interface IFormTextField {
    name: string;
    control: Control<any, object>;
    label?: string;
    type?: "text" | "password" | "date";
    shrink?: boolean;
    errors: FieldErrors<any>;
    defaultValue?: string | number;
    defaultTime?: any;
    isNavBarMode?: boolean;
    onBlur?: (e: BaseSyntheticEvent) => void;
}

const FormTextField: FC<IFormTextField> = ({
                                               control,
                                               label,
                                               name,
                                               type = "text",
                                               shrink,
                                               errors,
                                               defaultValue,
                                               defaultTime,
                                               isNavBarMode,
                                               onBlur,
                                           }) => {
    // Format defaultTime to YYYY-MM-DD if it's provided
    const formattedDefaultTime = defaultTime ? moment(defaultTime).format("YYYY-MM-DD") : undefined;

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={formattedDefaultTime || defaultValue}
            render={({ field }) => (
                <TextField
                    focused={isNavBarMode}
                    error={!!errors[name]}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink,
                    }}
                    type={type}
                    label={label}
                    value={field.value || ''}
                    onChange={field.onChange}
                    onBlur={(e) => {
                        field.onBlur(); // Use the built-in onBlur handler
                        if (onBlur) {
                            onBlur(e);
                        }
                    }}
                />
            )}
        />
    );
};

export default FormTextField;
