import { Alert, AlertTitle } from "@material-ui/lab";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormBuilder from "../../common/FormBuilder";
import useFetch from "../../common/hooks/useFetch";

const Update = () => {
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const { data } = useFetch("/api/get_form.php?id=" + params.id);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessageType(null);
      setMessages([]);
    }, 4000);

    return () => clearTimeout(timer);
  }, [messageType]);

  const listUpdateMutation = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      Axios.get("/api/submit_form.php", values).then((res) => {
        if (res?.data?.status === "success") {
          setMessageType("success");
          setMessages(res.data.messages);
          setLoading(false);
        } else if (res?.data?.status === "error") {
          setMessageType("error");
          setMessages(res.data.messages);
          setLoading(false);
        }
      });
    }, 2000);
  };

  return (
    <div
      style={{
        marginTop: 50,
      }}
    >
      {messageType && (
        <Alert severity={messageType}>
          <AlertTitle>
            {messageType === "success"
              ? "Success"
              : messageType === "error"
              ? "Error"
              : null}
          </AlertTitle>
          {messages.map((m, i) => (
            <p key={i}>{m}</p>
          ))}
        </Alert>
      )}
      <FormBuilder
        loading={loading}
        fields={data?.fields?.[0]}
        handleSubmit={listUpdateMutation}
        reset={false}
      />
    </div>
  );
};

export default Update;
