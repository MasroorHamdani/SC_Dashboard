import React, { Component } from 'react';
import {withStyles} from '@material-ui/core';

import * as firebase from 'firebase';
import styles from './DataAnalysisStyle';

class DispenserAnalysis extends Component {
    constructor() {
        super()
        this.state = {
            dispenser: []
        };
        this.ref = firebase.firestore().collection('FRASER_WWY_MALL');
    }
    onCollectionUpdate = (querySnapshot) => {
        console.log(querySnapshot, "querySnapshot");
        const dispenser = [];
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
        });
    }
    componentDidMount() {
        this.ref.onSnapshot(this.onCollectionUpdate);
    }
    
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.main}>Dispenser Box</div>
        )
    }
}

export default withStyles(styles)(DispenserAnalysis);