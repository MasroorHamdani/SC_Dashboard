import React, { Component } from 'react';
import {withStyles, FormControl, InputLabel,
    NativeSelect, Input, FormHelperText} from '@material-ui/core';

import * as firebase from 'firebase';
import styles from './DataAnalysisStyle';

class DispenserAnalysis extends Component {
    constructor() {
        super()
        this.state = {
            dispenser: []
        };
        this.ref = firebase.firestore().collection('JTC_TIM_F1').doc('JTC_LOCN2:DM').collection('DATA');
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
        const {classes, data, stateData,
            handleLocationSelectionChange} = this.props;
        return (
            <div className={classes.root}>
                <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="location-native-label-placeholder">
                        Location List
                    </InputLabel>
                    <NativeSelect
                        value={stateData.location}
                        onChange={handleLocationSelectionChange}
                        input={<Input name="location" id="location-native-label-placeholder" />}>
                        <option value='' key='location' id='location'>Choose Location</option>
                        { data &&
                            data.map(function(dt) {
                                return <option value={dt.insid} key={dt.insid}>{dt.insid}</option>
                            })
                        }
                    </NativeSelect>
                    <FormHelperText>Please select Location to get Dispenser data</FormHelperText>
                </FormControl>
            </div>
        )
    }
}

export default withStyles(styles)(DispenserAnalysis);
// let collRef = db.collection('JTC_TIM_F1').doc('JTC_LOCN2:DM').collection('DATA');
// var observer = collRef.onSnapshot(docSnapshot => {
//     docSnapshot.docChanges().forEach(change => {
//         //console.log(`change is ${JSON.stringify(docSnapshot)}`);
//         console.log(`change is ${JSON.stringify(change)}`);
//     });
// }, err => {
//     console.log(`Encountered error: ${err}`);
// });