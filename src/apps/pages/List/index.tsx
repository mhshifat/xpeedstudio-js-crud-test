import {
  Input,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { ArrowDropDown, ArrowDropUp, Edit } from "@material-ui/icons";
import { Alert, AlertTitle } from "@material-ui/lab";
import Axios from "axios";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";
import useFetch from "../../common/hooks/useFetch";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  columnSort: {
    display: "inline-flex",
    flexDirection: "column",
  },
  sortIcons: {
    fontSize: "18px",
    cursor: "pointer",
  },
});

const List = () => {
  const classes = useStyles();
  const { data } = useFetch("/api/list.php");
  const [rows, setRows] = useState<any[]>([]);
  const [searchString, setSearchString] = useState("");
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

  useEffect(() => {
    if (data?.rows && !searchString) {
      setRows(data.rows);
    }
  }, [data, searchString]);

  const reorderListQuery = () => {
    Axios.get("/api/reorder.php").then((res) => {
      if (res?.data?.status === "success") {
        setMessageType("success");
        setMessages(res.data.messages);
      } else if (res?.data?.status === "error") {
        setMessageType("error");
        setMessages(res.data.messages);
      }
    });
  };

  const sortTableData = (tableName: string, orderBy: "asc" | "desc") => {
    setRows(_.orderBy(rows, ["id"], [orderBy]));
  };

  const searchInTable = () => {
    const headerObj = data?.headers?.[0];
    Object.keys(headerObj).forEach((item) => {
      if (headerObj[item].searchable) {
        const foundData = data?.rows?.filter(
          (row: any) =>
            row[item].toString().toLowerCase() === searchString ||
            row[item].toString().toLowerCase().includes(searchString)
        );
        if (foundData.length) {
          setRows(foundData);
        }
      }
    });
  };

  return (
    <>
      <Paper>
        <Typography>
          Routes :<Link to="/">Home</Link> | <Link to="/create">Create</Link> |{" "}
          <Link to="/form">Dynamic Form Demo</Link>
        </Typography>
      </Paper>

      <Paper>
        <Input
          type="text"
          placeholder="Type and enter to Search..."
          fullWidth
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              searchInTable();
            }
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
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
        <Table className={classes.table} aria-label="simple table">
          {data?.headers?.map?.((header: any, i: number) => (
            <TableHead key={i}>
              <TableRow>
                <TableCell>
                  <div>
                    {header?.id?.title}
                    {header?.id?.sortable && (
                      <span className={classes.columnSort}>
                        <ArrowDropUp
                          className={classes.sortIcons}
                          onClick={() => sortTableData("id", "asc")}
                        />
                        <ArrowDropDown
                          style={{ marginTop: "-10px" }}
                          className={classes.sortIcons}
                          onClick={() => sortTableData("id", "desc")}
                        />
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell align="right">
                  {header?.name?.title}{" "}
                  {header?.name?.sortable && (
                    <span className={classes.columnSort}>
                      <ArrowDropUp
                        className={classes.sortIcons}
                        onClick={() => sortTableData("name", "asc")}
                      />
                      <ArrowDropDown
                        style={{ marginTop: "-10px" }}
                        className={classes.sortIcons}
                        onClick={() => sortTableData("name", "desc")}
                      />
                    </span>
                  )}
                </TableCell>
                <TableCell align="right">
                  {header?.message?.title}
                  {header?.message?.sortable && (
                    <span className={classes.columnSort}>
                      <ArrowDropUp
                        className={classes.sortIcons}
                        onClick={() => sortTableData("message", "asc")}
                      />
                      <ArrowDropDown
                        style={{ marginTop: "-10px" }}
                        className={classes.sortIcons}
                        onClick={() => sortTableData("message", "desc")}
                      />
                    </span>
                  )}
                </TableCell>
                <TableCell align="right">
                  {header?.created_at?.title}
                  {header?.created_at?.sortable && (
                    <span className={classes.columnSort}>
                      <ArrowDropUp
                        className={classes.sortIcons}
                        onClick={() => sortTableData("created_at", "asc")}
                      />
                      <ArrowDropDown
                        style={{ marginTop: "-10px" }}
                        className={classes.sortIcons}
                        onClick={() => sortTableData("created_at", "desc")}
                      />
                    </span>
                  )}
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
          ))}
          <DragDropContext
            onDragEnd={(param) => {
              const srcIndex = param.source.index;
              const desIndex = param?.destination?.index;
              desIndex && rows.splice(desIndex, 0, rows.splice(srcIndex, 1)[0]);
              reorderListQuery();
            }}
          >
            <Droppable droppableId="droppable-1">
              {(provided, snapshot) => (
                <TableBody
                  innerRef={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {rows?.map?.((row: any, i: number) => (
                    <Draggable draggableId={"draggable" + i} index={i} key={i}>
                      {(provided, snapshot) => (
                        <TableRow
                          innerRef={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TableCell component="th" scope="row">
                            {row?.id}
                          </TableCell>
                          <TableCell align="right">{row?.name}</TableCell>
                          <TableCell align="right">{row?.message}</TableCell>
                          <TableCell align="right">{row?.created_at}</TableCell>
                          <TableCell align="right">
                            <Link to={"/update/" + row?.id}>
                              <Edit
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                            </Link>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </TableContainer>
    </>
  );
};

export default List;
