import React, { Component } from 'react';
import {withStyles} from '@material-ui/core';
import { connect } from "react-redux";

import styles from './PageLoaderStyle';

class PageLoader extends Component {
    render() {
        const {classes} = this.props;
        return <div>
            {(this.props.pageLoader && this.props.pageLoader.isLoading) ? (
                <div className={classes.overlay}>
                    <div className={classes.spinner} />
                </div>
            ) : (
                ""
            )}
        </div>
        }
}

const mapStateToProps = (state) => ({
  pageLoader: state.PageLoadingReducer.data,
});

export default connect(mapStateToProps)(withStyles(styles)(PageLoader));
