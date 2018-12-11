import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TablePagination,
  TableRow, Paper} from '@material-ui/core';
import EnhancedTableHead from './GridHeader';
import styles from "./GridStyle";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
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
 * category - Sent as return data to above function
 */

class EnhancedTable extends React.Component {
  state = {
    selected: [],
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.props.orderBy === property && this.props.order === 'desc') {
      order = 'asc';
    }
    this.props.handleChange("orderBy", orderBy);
    this.props.handleChange("order", order);
  };

  handleChangePage = (event, page) => {
    this.props.handleChange("page", page);
  };

  handleChangeRowsPerPage = event => {
    this.props.handleChange("rowsPerPage", event.target.value);
  };

  isSelected = id => this.props.selected.indexOf(id) !== -1;

  render() {
    const { classes, data, rows, order, orderBy,
        rowsPerPage, page, handleClick, category} = this.props;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    

    // const rowss = data.map(d => {
    //   let bulk = [];
    //   rows.map(row => {
    //     let t = `d.${row.id}`;
    //     bulk.push(<TableCell scope="row">{t}</TableCell>)
    //   }, this)
    //   return bulk
    // }, this)

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rows={rows}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.insid);
                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, n.insid, category)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.insid}
                      selected={isSelected}
                    >
                      <TableCell component="th" scope="row">
                        {n.name}
                      </TableCell>
                      <TableCell>{n.locn}</TableCell>
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
        </div>
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
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);
