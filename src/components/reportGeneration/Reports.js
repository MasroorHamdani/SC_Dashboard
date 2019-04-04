import React, { Component } from 'react';
import {withStyles, Button, Typography, GridList,
    Card, CardHeader, Avatar, Radio, IconButton,
    LinearProgress} from '@material-ui/core';
import axios from 'axios';

import {LINK} from '../../constants/Constant';
import styles from './ReportGenerationStyle';

class Reports extends Component {
    downLoadFile = (url) => {
        axios({
            url: url,
            method: 'GET',
            responseType: 'blob', // important
            headers: {
                'Content-Type': 'application/pdf',
                'Accept': 'application/pdf'
            }
          }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'report.pdf');
            link.click();
            window.URL.revokeObjectURL(url);
          }).catch((error) => {
              console.log(error);
          });
    }
    render() {
        const {classes, stateData, handleServiceToggle} = this.props;
        return (
            <div className={classes.root}>
                <main className={classes.content}>
                    {stateData.loading &&
                        <LinearProgress className={classes.buttonProgress}/>
                    }
                    {stateData.serviceList ?
                        <GridList cellHeight={130} className={classes.gridList}>
                        {stateData.serviceList.map((row) => (
                            <Card className={classes.card} key={row.ServiceID}>
                                <CardHeader
                                avatar={
                                    <Avatar aria-label="Recipe" className={classes.avatar}>
                                    {/* {SERVICES[key]['avatar']} */}
                                    test
                                    </Avatar>
                                }
                                action={
                                    <IconButton>
                                        <Radio
                                        checked={stateData.serviceChecked === row.ServiceID}
                                        onChange={handleServiceToggle(row.ServiceID)}
                                        />
                                    </IconButton>
                                }
                                title={row.NS}
                                subheader={row.Description}
                                />
                            </Card>
                        ))}
                    </GridList>
                    :
                        <div><Typography variant="h6">No Services for given Project</Typography></div>
                    }
                    {/* Report list page
                    Here is the link to download */}
                    <Button onClick={e=>this.downLoadFile(LINK)}>Report Link</Button>
                </main>
            </div>
        )
    }
}

export default withStyles(styles)(Reports);