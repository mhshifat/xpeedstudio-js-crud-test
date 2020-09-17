import { Typography } from "@material-ui/core";
import React from "react";
import FormBuilder from "../../common/FormBuilder";
import useFetch from "../../common/hooks/useFetch";

const DemoDynamicForm = () => {
  const { data } = useFetch("/api/get_form.php");

  return (
    <div>
      <Typography
        style={{
          marginBottom: 50,
        }}
        align="center"
      >
        Dynamic form builder using "getform" api
      </Typography>

      <FormBuilder fields={data?.fields?.[0]} handleSubmit={(values) => {}} />
    </div>
  );
};

export default DemoDynamicForm;
