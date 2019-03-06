import React, { Component } from 'react';
import {withStyles, Button} from '@material-ui/core';
import axios from 'axios';

import {LINK} from '../../constants/Constant';
import styles from './ReportGenerationStyle';

class Reports extends Component {
    downLoadFile = (url) => {
        axios({
            url: url,
            method: 'GET',
            responseType: 'blob', // important
          }).then((response) => {
              console.log(response);
            // const url = window.URL.createObjectURL(new Blob([response.data]));
            // const link = document.createElement('a');
            // link.href = url;
            // link.setAttribute('download', 'file.pdf');
            // document.body.appendChild(link);
            // link.click();
          }).catch((error) => {
              console.log(error);
          });
    }
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <main className={classes.content}>
                    Report list page
                    Here is the link to download
                    <Button onClick={e=>this.downLoadFile(LINK)}>Report Link</Button>
                </main>
            </div>
        )
    }
}

export default withStyles(styles)(Reports);