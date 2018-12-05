import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TableHead, TableSortLabel, Tooltip, TableRow, TableCell} from '@material-ui/core';

class EnhancedTableHead extends Component {
    // createSortHandler = property => event => {
    //   this.props.onRequestSort(event, property);
    // };
  
    render() {
      const { order, orderBy, rows, onRequestSort } = this.props;
      return (
        <TableHead>
          <TableRow>
            {rows.map(row => {
              return (
                <TableCell
                  key={row.id}
                  numeric={row.numeric}
                  padding={row.disablePadding ? 'none' : 'default'}
                  sortDirection={orderBy === row.id ? order : false}
                >
                  <Tooltip
                    title="Sort"
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