/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  ButtonGroup,
  CircularProgress,
  FormControlLabel,
  Input,
  InputLabel,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { allLetter, allNumberLetter, isEmail } from "../../../utils/validators";

const useStyles = makeStyles({
  form: {
    maxWidth: 400,
    margin: "0 auto",
  },
  group: {
    marginBottom: 40,
  },
});

interface Props {
  fields: {
    [key: string]: any;
  };
  handleSubmit?: (values: any) => void;
  loading?: boolean;
  reset?: boolean;
}

const FormBuilder: React.FC<Props> = ({
  fields,
  handleSubmit,
  loading,
  reset,
}) => {
  const classes = useStyles();
  const [formValues, setFormValues] = useState<any>({});
  const [formError, setFormError] = useState<any>({});

  useEffect(() => {
    if (fields) {
      initialForm();
    }
  }, [fields]);

  useEffect(() => {
    if (reset) {
      initialForm();
    }
  }, [reset]);

  const initialForm = () => {
    const newState = {};
    Object.keys(fields).forEach((item: any) => {
      // @ts-ignore
      newState[item] = fields[item].default
        ? fields[item].default
        : fields[item].value
        ? fields[item].value
        : fields[item]?.type === "repeater"
        ? [""]
        : fields[item]?.repeaterFields
        ? fields[item]?.value
        : "";
    });
    setFormValues(newState);
  };

  const getFormFieldElement = (formKey: string) => {
    const field = fields[formKey] || {};
    const { readonly, validate, html_attr, ...fieldRest } = field;
    const { class: className, ...htmlAttrRest } = html_attr;

    if (field?.type === "text") {
      return (
        <div className={classes.group}>
          <InputLabel>{field?.title || ""}</InputLabel>
          <Input
            fullWidth
            {...fieldRest}
            {...htmlAttrRest}
            readOnly={readonly || false}
            className={className || ""}
            name={formKey}
            value={formValues[formKey]}
            onChange={(e) => {
              setFormValues({ ...formValues, [formKey]: e.target.value });
              if (validate === "only_letters" && !allLetter(e.target.value)) {
                setFormError({
                  ...formError,
                  [formKey]: "Field must contain only letter's",
                });
              } else {
                setFormError({ ...formError, [formKey]: undefined });
              }
            }}
          />
          {formError[formKey] && (
            <Alert severity="error">{formError[formKey]}</Alert>
          )}
        </div>
      );
    } else if (field?.type === "email") {
      return (
        <div className={classes.group}>
          <InputLabel>{field?.title || ""}</InputLabel>
          <Input
            fullWidth
            {...fieldRest}
            {...htmlAttrRest}
            readOnly={readonly || false}
            className={className || ""}
            name={formKey}
            value={formValues[formKey]}
            onChange={(e) => {
              setFormValues({ ...formValues, [formKey]: e.target.value });
              if (validate) {
                if (validate.includes("email") && !isEmail(e.target.value)) {
                  setFormError({
                    ...formError,
                    [formKey]: "Please provide a valid email address",
                  });
                } else if (
                  validate.includes("max") &&
                  e.target.value.length >
                    +String(validate).split("|")[1].split(":")[1]
                ) {
                  setFormError({
                    ...formError,
                    [formKey]: "Field input can't exceed 200 characters",
                  });
                } else {
                  setFormError({ ...formError, [formKey]: undefined });
                }
              } else {
                setFormError({ ...formError, [formKey]: undefined });
              }
            }}
          />
          {formError[formKey] && (
            <Alert severity="error">{formError[formKey]}</Alert>
          )}
        </div>
      );
    } else if (field?.type === "hidden") {
      return <input {...fieldRest} {...htmlAttrRest} />;
    } else if (field?.type === "radio") {
      return (
        <div className={classes.group}>
          <InputLabel>{field?.title || ""}</InputLabel>
          <RadioGroup
            {...fieldRest}
            {...htmlAttrRest}
            value={formValues[formKey]}
            defaultValue={field?.default}
            onChange={(e, value) => {
              setFormValues({ ...formValues, [formKey]: value });
            }}
          >
            {field?.options?.map?.((opt: any, i: number) => (
              <FormControlLabel
                key={i}
                value={opt.key}
                control={<Radio />}
                label={opt.label}
              />
            ))}
          </RadioGroup>
          {formError[formKey] && (
            <Alert severity="error">{formError[formKey]}</Alert>
          )}
        </div>
      );
    } else if (field?.type === "select") {
      return (
        <div className={classes.group}>
          <InputLabel>{field?.title || ""}</InputLabel>
          <Select
            {...fieldRest}
            {...htmlAttrRest}
            fullWidth
            value={formValues[formKey]}
            defaultValue={field?.default}
            onChange={(e) => {
              setFormValues({ ...formValues, [formKey]: e.target.value });
            }}
          >
            {field?.options?.map?.((opt: any, i: number) => (
              <MenuItem key={i} value={opt.key}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          {formError[formKey] && (
            <Alert severity="error">{formError[formKey]}</Alert>
          )}
        </div>
      );
    } else if (field?.type === "textarea") {
      return (
        <div className={classes.group}>
          <InputLabel>{field?.title || ""}</InputLabel>
          <TextField
            multiline
            rows={2}
            rowsMax={4}
            fullWidth
            {...fieldRest}
            {...htmlAttrRest}
            readOnly={readonly || false}
            className={className || ""}
            name={formKey}
            value={formValues[formKey]}
            onChange={(e) => {
              setFormValues({ ...formValues, [formKey]: e.target.value });
            }}
          />
          {formError[formKey] && (
            <Alert severity="error">{formError[formKey]}</Alert>
          )}
        </div>
      );
    } else if (field?.type === "repeater") {
      if (field?.repeater_fields) {
        return (
          <div className={classes.group}>
            <InputLabel>{field?.title || ""}</InputLabel>
            {formValues[formKey]?.map?.((item: any, ind: number) => {
              return (
                <div key={ind}>
                  {Object.keys(item)?.map?.((key: string, i: number) => (
                    <React.Fragment>
                      <Input
                        {...(field?.repeater_fields?.[i] || [])}
                        value={item[key]}
                        onChange={(e) => {
                          const value = e.target.value;
                          const fieldValues = [...formValues[formKey]];
                          fieldValues[ind][key] = value;
                          setFormValues({
                            ...formValues,
                            [formKey]: [...fieldValues],
                          });

                          if (
                            field?.repeater_fields?.[key].validate ===
                              "only_letters" &&
                            !allLetter(value)
                          ) {
                            const errors = [...(formError[formKey] || [])];
                            errors[ind] = {
                              ...(errors[ind] || {}),
                              [key]: "Only letters are allowed",
                            };
                            setFormError({
                              ...formError,
                              [formKey]: errors,
                            });
                          } else {
                            const errors = [...(formError[formKey] || [])];
                            errors[ind] = {
                              ...(errors[ind] || {}),
                              [key]: undefined,
                            };
                            setFormError({
                              ...formError,
                              [formKey]: errors,
                            });
                          }
                        }}
                      />
                      {formError[formKey] &&
                        formError[formKey][ind] &&
                        formError[formKey][ind][key] && (
                          <Alert severity="error">
                            {formError[formKey][ind][key]}
                          </Alert>
                        )}
                    </React.Fragment>
                  ))}
                  <br />
                  <br />
                  <ButtonGroup variant="contained" color="primary">
                    <Button
                      size="small"
                      onClick={() => {
                        const fieldValue = [...formValues[formKey]];
                        fieldValue.splice(ind, 1);
                        if (fieldValue.length === 0) {
                          fieldValue.splice(0, 0, {
                            work_place: "",
                            designation: "",
                          });
                        }
                        setFormValues({
                          ...formValues,
                          [formKey]: [...fieldValue],
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </ButtonGroup>
                </div>
              );
            })}
            <br />
            <br />
            <ButtonGroup variant="contained" color="primary">
              <Button
                size="small"
                onClick={() => {
                  const fieldValue = [...formValues[formKey]];
                  fieldValue.push({
                    work_place: "",
                    designation: "",
                  });
                  setFormValues({
                    ...formValues,
                    [formKey]: [...fieldValue],
                  });
                }}
              >
                Add
              </Button>
            </ButtonGroup>
          </div>
        );
      }
      return (
        <div className={classes.group}>
          <InputLabel>{field?.title || ""}</InputLabel>
          {formValues[formKey]?.map?.((item: string, i: number) => (
            <>
              <Input
                fullWidth
                {...fieldRest}
                {...htmlAttrRest}
                readOnly={readonly || false}
                className={className || ""}
                name={formKey}
                value={formValues[formKey][i]}
                onChange={(e) => {
                  const value = e.target.value;
                  const fieldValues = [...formValues[formKey]];
                  fieldValues[i] = value;
                  setFormValues({ ...formValues, [formKey]: [...fieldValues] });

                  if (validate) {
                    if (
                      validate.includes("only_letter_number") &&
                      !allNumberLetter(e.target.value)
                    ) {
                      const errors = [...(formError[formKey] || [])];
                      errors[i] = "Only number & letters are allowed";
                      setFormError({
                        ...formError,
                        [formKey]: errors,
                      });
                    } else if (
                      validate.includes("max") &&
                      e.target.value.length >
                        +String(validate).split("|")[1].split(":")[1]
                    ) {
                      const errors = [...(formError[formKey] || [])];
                      errors[i] = "Field input can't exceed 100 characters";
                      setFormError({
                        ...formError,
                        [formKey]: errors,
                      });
                    } else {
                      const formErrors = [...(formError[formKey] || [])];
                      formErrors[i] = undefined;
                      setFormError({ ...formError, [formKey]: formErrors });
                    }
                  } else {
                    const formErrors = [...(formError[formKey] || [])];
                    formErrors[i] = undefined;
                    setFormError({ ...formError, [formKey]: formErrors });
                  }
                }}
              />
              {formError[formKey] && formError[formKey][i] && (
                <Alert severity="error">{formError[formKey][i]}</Alert>
              )}
              <br />
              <br />
              <ButtonGroup variant="contained" color="primary">
                <Button
                  size="small"
                  onClick={() => {
                    const fieldValue = [...formValues[formKey]];
                    fieldValue.splice(i, 1);
                    if (fieldValue.length === 0) {
                      fieldValue.splice(0, 0, "");
                    }
                    setFormValues({
                      ...formValues,
                      [formKey]: [...fieldValue],
                    });
                  }}
                >
                  Remove
                </Button>
              </ButtonGroup>
            </>
          ))}
          <br />
          <br />
          <ButtonGroup variant="contained" color="primary">
            <Button
              size="small"
              onClick={() => {
                const fieldValue = [...formValues[formKey]];
                fieldValue.push("");
                setFormValues({ ...formValues, [formKey]: [...fieldValue] });
              }}
            >
              Add
            </Button>
          </ButtonGroup>
        </div>
      );
    }
  };

  const isErrorExist = () => {
    let isExist = false;

    const valuesWithOutUndefined = Object.values(formError)
      .flat()
      .filter((op) => op !== undefined);

    if (
      valuesWithOutUndefined.length &&
      typeof valuesWithOutUndefined[0] === "object"
    ) {
      const values = Object.values(valuesWithOutUndefined?.[0] || []);
      return values.filter((v) => v !== undefined).length
        ? (isExist = true)
        : (isExist = false);
    } else valuesWithOutUndefined.length ? (isExist = true) : (isExist = false);

    return isExist;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isErrorExist()) {
      handleSubmit?.(formValues);
    }
  };

  return (
    <form className={classes.form} onSubmit={onSubmit}>
      {Object.keys(fields || []).map?.((formKey: any, i: number) => (
        <React.Fragment key={i}>{getFormFieldElement(formKey)}</React.Fragment>
      ))}
      <Button
        disabled={!!isErrorExist() || loading}
        type="submit"
        variant="contained"
        color="primary"
      >
        Submit{" "}
        {loading && (
          <CircularProgress
            style={{
              marginLeft: 10,
            }}
            size={18}
            color="inherit"
          />
        )}
      </Button>
    </form>
  );
};

export default FormBuilder;
