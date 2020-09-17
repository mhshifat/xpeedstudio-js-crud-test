import { useEffect, useState } from "react";

const useFetch = (url: string, body?: any, method: "get" | "post" = "get") => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url, {
      method,
      body,
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        setData(res.data);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  }, [body, method, url]);

  return { loading, error, data } as {
    loading: boolean;
    error: any;
    data: any;
  };
};

export default useFetch;
