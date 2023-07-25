import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { userActions } from "_store";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import moment from "moment/moment";

export { Audit };

function Audit() {
  const users = useSelector((x) => x.users.list);
  const dispatch = useDispatch();
  const [itemsPerPage,setItemsPerPage] = useState(5);
  const [itemOffset, setItemOffset] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const endOffset = itemOffset + itemsPerPage;
  const [currentUsers, setCurrentUsers] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [timeFormat, setTimeFormat] = useState();
  const [userSlice, setUserSlice] = useState([]);
  const [searchBy, setSearchBy] = useState(1); // 1- First Name 2- Last Name 3- userName
  const [sortBy, setSortBy] = useState(1); // 1- First Name 2- Last Name 3- userName
  const [orderOfSorting, setOrderOfSorting] = useState(1); // 1- ascending, 2-descending

  useEffect(() => {
    dispatch(userActions.getAll());
  }, []);

  useEffect(() => {
    if (users?.value?.length > 0) {
      setCurrentUsers(users.value);
      setTimeFormat(12);
    }
  }, [users]);

  useEffect(() => {
    if (currentUsers?.length > 0) {
      const currentPageCount = Math.ceil(currentUsers?.length / itemsPerPage);
      setPageCount(currentPageCount);
      setUserSlice(currentUsers.slice(itemOffset, endOffset));
    }
  }, [currentUsers, itemOffset,itemsPerPage]);

  useEffect(() => {
    if (currentUsers?.length > 0) {
      let allusers = users.value;
      if (searchString === "" && users?.value?.length > 0) {
        setCurrentUsers(users?.value);
        setItemOffset(0);
      } else {
        let newUsers = [];
        switch (searchBy) {
          case 1:
            newUsers = allusers.filter((user) =>
              user.firstName.toLowerCase().includes(searchString.toLowerCase())
            );
            break;
          case 2:
            newUsers = allusers.filter((user) =>
              user.lastName.toLowerCase().includes(searchString.toLowerCase())
            );
            break;
          case 3:
            newUsers = allusers.filter((user) =>
              user.username.toLowerCase().includes(searchString.toLowerCase())
            );
            break;
        }
        setCurrentUsers(newUsers);
        setItemOffset(0);
      }
    }
  }, [searchString]);

  useEffect(() => {
    if (currentUsers.length > 0) {
      let newUsers = [];
      switch (sortBy) {
        case 1: {
          if (orderOfSorting === 1) {
            newUsers = currentUsers
              .slice()
              .sort((a, b) => (a.firstName > b.firstName ? 1 : -1));
          } else {
            newUsers = currentUsers
              .slice()
              .sort((a, b) => (b.firstName > a.firstName ? 1 : -1));
          }
          break;
        }
        case 2: {
          if (orderOfSorting === 1) {
            newUsers = currentUsers
              .slice()
              .sort((a, b) => (a.lastName > b.lastName ? 1 : -1));
          } else {
            newUsers = currentUsers
              .slice()
              .sort((a, b) => (b.lastName > a.lastName ? 1 : -1));
          }
          break;
        }
        case 3: {
          if (orderOfSorting === 1) {
            newUsers = currentUsers
              .slice()
              .sort((a, b) => (a.username > b.username ? 1 : -1));
          } else {
            newUsers = currentUsers
              .slice()
              .sort((a, b) => (b.username > a.username ? 1 : -1));
          }
          break;
        }
      }
      setCurrentUsers(newUsers);
    }
  }, [sortBy, orderOfSorting]);

  function handlePageClick(event) {
    const newOffset = (event.selected * itemsPerPage) % users.value.length;
    setItemOffset(newOffset);
  }

  function handleSearchTextChange(event) {
    setSearchString(event.target.value);
  }
  function handleTimeFormatChange(event) {
    setTimeFormat(parseInt(event.target.value));
  }
  function handleSearchByChange(event) {
    setSearchString("");
    setSearchBy(parseInt(event.target.value));
  }
  function handleSortBy(event) {
    setSortBy(parseInt(event.target.value));
  }
  function handleOrderBy(event) {
    setOrderOfSorting(parseInt(event.target.value));
  }
  function handleItemsPerPageClick(event){
    setItemsPerPage(parseInt(event.target.value))
  }
  return (
    <div>
      <h1>Auditor Page</h1>
      <div className="container">
        <label>Search By</label>
        <select id="search-by" className="margin-right" onChange={handleSearchByChange}>
          <option value={1}>First Name</option>
          <option value={2}>Last Name</option>
          <option value={3}>User Name</option>
        </select>
        {searchBy === 1 && (
          <input
            type="search"
            placeholder="search by first name"
            id="first-name-search"
            onChange={handleSearchTextChange}
            value={searchString}
            className="margin-right"
          />
        )}
        {searchBy === 2 && (
          <input
            type="search"
            placeholder="search by last name"
            id="last-name-search"
            onChange={handleSearchTextChange}
            value={searchString}
            className="margin-right"
          />
        )}
        {searchBy === 3 && (
          <input
            type="search"
            placeholder="search by username"
            id="user-name-search"
            onChange={handleSearchTextChange}
            value={searchString}
            className="margin-right"
          />
        )}
      </div>
      <div className="container">
        <label>Sort By</label>
        <select className="margin-right" id="sort-by" onChange={handleSortBy}>
          <option value={1}>First Name</option>
          <option value={2}>Last Name</option>
          <option value={3}>User Name</option>
        </select>
        <select className="margin-right" id="order-by" onChange={handleOrderBy}>
          <option value={1}>Ascending</option>
          <option value={2}>Descending</option>
        </select>
      </div>
      <div className="container">
        <label>Time Format</label>
        <select className="margin-right" id="select-time-format" onChange={handleTimeFormatChange}>
          <option value={12}>12 Hour</option>
          <option value={24}>24 Hour</option>
        </select>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: "25%" }}>First Name</th>
            <th style={{ width: "25%" }}>Last Name</th>
            <th style={{ width: "25%" }}>Username</th>
            <th style={{ width: "25%" }}>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {userSlice.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.username}</td>
              <td>
                {timeFormat === 24
                  ? moment(user?.createdDate).format("DD/MM/YYYY HH:mm:ss")
                  : moment(user?.createdDate).format(
                      "DD/MM/YYYY hh:mm:ss A"
                    )}{" "}
              </td>
            </tr>
          ))}
          {users?.loading && (
            <tr>
              <td colSpan="4" className="text-center">
                <span className="spinner-border spinner-border-lg align-center"></span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        activeClassName="active"
      />
      <div className="container">
        <label>Items per page</label>
        <select id="search-by" className="margin-right" onChange={handleItemsPerPageClick}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
        </div>
    </div>
  );
}
