import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TableHead, TableSortLabel, Tooltip, TableRow, TableCell} from '@material-ui/core';

/**
 * Child component - This is Grid hearder component,
 * which will take input and according to that will add that many columns in the Grid(table)
 * Input passed are:
 * order - this indicates asc or Desc
 * orderby - which field to be used as the default sorted one.
 * rows - indicates the list of row, which defines how many columns are there in table
 * onRequestSort it is a function, which will accept the column on which we can sort the table
 */
class EnhancedTableHead extends Component {
    // createSortHandler = property => event => {
    //   this.props.onRequestSort(event, property);
    // };
  
    render() {
      const { order, orderBy, rows, onRequestSort, allowDelete,
        allowEdit } = this.props;
      return (
        <TableHead>
          <TableRow>
            {rows.map(row => {
              return (
                <TableCell
                  key={row.id}
                  align={row.numeric}
                  padding={row.disablePadding ? 'none' : 'default'}
                  sortDirection={orderBy === row.id ? order : false}
                >
                  <Tooltip
                    title={row.toolTip? row.toolTip : 'Sort'}
                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderBy === row.id}
                      direction={order}
                    //   onClick={this.createSortHandler(row.id)}
                      onClick={e => onRequestSort(e, row.id)}
                    >
                      {row.label}
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              );
            }, this)}
            {allowEdit &&
              <TableCell/>
            }
            {allowDelete &&
              <TableCell/>
            }
          </TableRow>
        </TableHead>
      );
    }
  }
  
  EnhancedTableHead.propTypes = {
    // onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
  };

  export default EnhancedTableHead;