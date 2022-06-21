import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const BACKEND_URL = "http://10.65.132.54:3000";

/*
 * Plan:
 *   1. Define backend url
 *   2. Get items and show them +
 *   3. Toggle item done +
 *   4. Handle item add +
 *   5. Delete +
 *   6. Filter
 *
 * */

function App() {
  var opened = false;
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const getNotCompletedItems = () => { 
    opened = false;
    axios
      .get(`https://api.todoist.com/rest/v1/tasks`, {
        headers: {
          Authorization: "Bearer 2a93b84bf15512083fa5b3a5d8d6cbf17c002e4b",
        },
      })
      .then((response) => {
        console.log(response.data);
        setItems(response.data);
      });
  }
  const getCompletedItems = () => {
    opened = true;
    axios.get(
      `https://api.todoist.com/sync/v8/completed/get_all`, {
          headers: {
            Authorization: "Bearer 2a93b84bf15512083fa5b3a5d8d6cbf17c002e4b",
          }
        }
      
    ).then((response) => {
      console.log(response)
      setItems(response.data.items)
    })
  }

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };
  
  const handleAddItem = () => {
    axios
      .post(
        `https://api.todoist.com/rest/v1/tasks`,
        {
          content: `${itemToAdd}`,
        },
        {
          headers: {
            Authorization: "Bearer 2a93b84bf15512083fa5b3a5d8d6cbf17c002e4b",
          },
        }
      )
      .then((response) => {
        setItems([...items, response.data]);
      })
      .catch((err) => {
        console.log(err);
      });
    setItemToAdd("");
  };

  const toggleItemChange = ({ id, done }) => {
    // console.log(done);
    // if (done) {
    //   axios
    //   .post(`https://api.todoist.com/rest/v1/tasks/${id}/reopen`, 
    //   {
    //     done: !done,
    //   },
    //   {
    //     headers: {
    //       Authorization: "Bearer 2a93b84bf15512083fa5b3a5d8d6cbf17c002e4b",
    //     },
    //   })
    //   .then((response) => {
    //     console.log(response)
    //   });
    // } else {
      axios
        .post(`https://api.todoist.com/rest/v1/tasks/${id}/close`, 
        {
          done: !done,
        },
        {
          headers: {
            Authorization: "Bearer 2a93b84bf15512083fa5b3a5d8d6cbf17c002e4b",
          },
        })
        .then((response) => {
          setItems( 
            items.map((item) => {
              if (item.id === id) {
                return {
                  ...item,
                  done: !done,
                };
              }
              return item;
            })
          );
        });

  
  };
  // const toggleItemReOpen = ({ id, done }) => {
  //   axios
  //     .post(`https://api.todoist.com/rest/v1/tasks/${id}/reopen`, 
  //     {
  //       done: !done,
  //     },
  //     {
  //       headers: {
  //         Authorization: "Bearer 2a93b84bf15512083fa5b3a5d8d6cbf17c002e4b",
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response)
  //     });
  // };

  // N => map => N
  // N => filter => 0...N
  const handleItemDelete = (id) => {
    axios.delete(`${BACKEND_URL}/todos/${id}`).then((response) => {
      const deletedItem = response.data;
      console.log("Было:", items);
      const newItems = items.filter((item) => {
        return deletedItem.id !== item.id;
      });
      console.log("Осталось:", newItems);
      setItems(newItems);
    });
  };

  useEffect(() => {
    console.log(searchValue);
    axios
      .get(`https://api.todoist.com/rest/v1/tasks`, {
        headers: {
          Authorization: "Bearer 2a93b84bf15512083fa5b3a5d8d6cbf17c002e4b",
        },
      })
      .then((response) => {
        console.log(response.data);
        setItems(response.data);
      });
  }, [searchValue]);

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
        <button
              onClick={() => getNotCompletedItems()}
              type="button"
              className={`btn btn-all-info`}
            >
              Active 
        </button>
        <button
              onClick={() => getCompletedItems()}
              type="button"
              className={`btn btn-done-info`}
            >
              Completed
        </button>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemChange(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
