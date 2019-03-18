import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TablePagination,
  TableRow, Paper, TextField, Select, MenuItem,
  List, ListItem} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import EnhancedTableHead from './GridHeader';
import styles from "./GridStyle";
import CustomModal from '../../components/modal/Modal';
import { NamespacesConsumer } from 'react-i18next';

function desc(a, b, orderBy) {
/**
 * For sorting the columns at first place on page loading.
 */
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
/**
 * For filtering this function is used.
 */
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
/**
 * This will be the function called from the render part, which will call the desc function
 * depenfing the order value, if it is desc or asec, along with the orderby- which is the column
 */
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

/**
 * Main Grid component, which internally calls other component
 * 'EnhancedTableHead' - This is a dynamic component,
 * with all the function defined liks sorting mechanism,
 * pagination, changing page number and size.
 * Input passed
 * data - Data to be displayed in Grid
 * rows - The Row structure for columns header, which is passed to child component
 * order - Asc/Desc
 * orderBy - Column key which will be used by defauult for sorting
 * rowsPerPage - By default no of rows Per Page
 * page - Numnber of pages
 * handleClick - Function to handle clicking on any Grid row
 * category - It is selected tabs value which is, Sent as return data to above function
 * redirectID - It will be used in handleClick function,
 *    which means pass this key value as parameter to called function
 * allowDelete is passed as true or false, by default it will be false.
 *    It will specify if table will show up delete column of not
 * allowEdit is passed as true or false, by default it will be false.
 *    It will specify if table will show up edit column of not
 */

class EnhancedTable extends React.Component {
  state = {
    selected: [],
    queryToColumn: '',
    query: '',
    open: false,
    toDelete: ''
  };

  handleOpen = (id) => {
  /**
   * Show up dialogue box on deleting a row.
   */
    this.setState({
      open: true,
      toDelete: id
    });
  };

  handleClose = () => {
  /**
   * Close the modal opned up
   */
    this.setState({ open: false });
  };
  
  onDelete = () => {
  /**
   * Perform specific function on delete.
   * Usually it will be part of the container which will call the Grid component
   */
    // console.log(this.state.toDelete);
    //API call to delete user;
    this.handleClose();
  };
  onEdit = (id) => {
  /**
   * Perform specific function on Edit. 
   * Usually it will be part of the container which will call the Grid component
   */
    // console.log(id);
  };
  handleRequestSort = (event, property) => {
  /**
   * Handle the sorting changes,
   * any column selected with any order will call this function,
   * which will internally call the parent function.
   */
    const orderBy = property;
    let order = 'desc';

    if (this.props.orderBy === property && this.props.order === 'desc') {
      order = 'asc';
    }
    this.props.handleChange("orderBy", orderBy);
    this.props.handleChange("order", order);
  };

  handleChangePage = (event, page) => {
  /**
   * Call parent fucntion, which will set the parent state value,
   * which will recall all the functions needed to refresh the UI
   */
    this.props.handleChange("page", page);
  };

  handleChangeRowsPerPage = event => {
    /**
     * Call parent fucntion, which will set the parent state value,
     * which will recall all the functions needed to refresh the UI
     */
    this.props.handleChange("rowsPerPage", event.target.value);
  };

  setQueryColumn = (event) => {
  /**
   * Cfunction which will set the query column for filtering the table data for any selected column.
   */
    this.setState({queryToColumn: event.target.value})
  };

  /**
   * set the isSelected as per the selected value passed from parent.
   */ 
  isSelected = id => this.props.selected.indexOf(id) !== -1;

  render() {
    const { classes, data, rows, order, orderBy,
        rowsPerPage, page, handleClick, category, redirectID, allowDelete,
        allowEdit} = this.props;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const queryToLower = this.state.query.toLowerCase();
    return (
      <NamespacesConsumer>
            {
            t=><Paper className={classes.root}>
          <div className={classes.searchSection}>
          {/**
          * Filter with all the column names,
          * select any and type the value looking for in the text box,
          * and the function will be called on key change and refine the data in the table
          */}
            <Select
            displayEmpty
            value={this.state.queryToColumn}
            onChange={this.setQueryColumn}
            >
            <MenuItem value="" disabled>{t('selectColumn')}</MenuItem>
            {rows.map(row => {
              return <MenuItem value={row.id} key={row.id}>{row.label}</MenuItem>
              }, this)}
            </Select>
            <TextField
            className={classes.searchField}
            disabled={this.state.queryToColumn ? false : true}
            placeholder="All"
            value={this.state.query}
            onChange={e=>this.setState({query: e.target.value})}
            />
          </div>
          <Table className={classes.table} aria-labelledby="tableTitle">
          {/**
          * Call the conpmnent which will set up the header of the grid.
          * Based on the row passed.
          */}
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rows={rows}
              allowDelete={allowDelete}
              allowEdit={allowEdit}
            />
            <TableBody>
            {/**
            * Handle the filtered data as well as the sorting of the data
            */}
              {stableSort(this.state.query ?
              data.filter(x => x[this.state.queryToColumn].toLowerCase().includes(queryToLower)) :
              data,
              getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n[redirectID]);
                  return (
                    <TableRow
                      hover
                      className={classes.pointer}
                      onClick={(!allowEdit && handleClick) ?event => handleClick(event, n[redirectID], category): null}
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n[redirectID]}
                      selected={isSelected}
                      >
                      {rows.map( (test, i) => {
                        let id = test.id;
                        return <TableCell key={i} value={n[id]}
                                // onClick={test.editTable ? () => this.onEdit(i): ''}
                                >
                                {Array.isArray(n[id]) ?
                                  <List dense={true}>
                                    {n[id].map((value, index) => {
                                      return <ListItem key={index}>
                                        {value}
                                      </ListItem>
                                    })}
                                  </List>
                                :
                                  <span>{n[id]}</span>
                                }
                              </TableCell>
                      })}
                      { allowEdit &&
                        <TableCell>
                          <EditIcon className={classes.icon}
                          onClick={event => handleClick(event, n[redirectID], category)}/>
                        </TableCell>
                      }
                      {allowDelete &&
                       <TableCell>
                         <DeleteIcon className={classes.icon}
                         onClick={event => this.handleOpen(n[redirectID])}
                        //  onClick={event => this.onDelete(event, n[redirectID])}
                        />
                        </TableCell>
                      }
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        {/**
        * modal for updating user once delete is enabled and clicked for a row
        */}
        <CustomModal
          header="Remove User"
          content="Do you Want Remove the User"
          handleClose={this.handleClose}
          handleClick={this.onDelete}
          open={this.state.open}
          showFooter={true}
        />
      </Paper>
      }</NamespacesConsumer>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);
