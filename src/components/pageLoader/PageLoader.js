import React, { Component } from 'react';
import {withStyles} from '@material-ui/core';
import { connect } from 'react-redux';
import {isEqual} from 'lodash';

import styles from './PageLoaderStyle';

class PageLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading : ''
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.pageLoader &&
            !isEqual(this.props.pageLoader, prevProps.pageLoader)) {
            this.setState({isLoading: this.props.pageLoader.isLoading})
        }
    }
    render() {
        const {classes} = this.props;
        
        return <div>
            {(this.state.isLoading) ? (
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
