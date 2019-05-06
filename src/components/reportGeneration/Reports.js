import React, { Component } from 'react';
import {withStyles, Button, Typography, GridList,
    Card, CardHeader, Avatar, Radio, IconButton,
    LinearProgress, CardContent} from '@material-ui/core';

import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import PageviewIcon from '@material-ui/icons/Pageview';

import EnhancedTable from '../grid/Grid';
import {S3_REPORTS_END_POINT, SORTING, DATE_TIME_FORMAT,
    DESCRIPTIVE_DATE_TIME_FORMAT} from '../../constants/Constant';

import {formatDateTime} from '../../utils/DateFormat';
import styles from './ReportGenerationStyle';
import download from '../../images/download.png';


class Reports extends Component {
    constructor(props) {
        super(props)
        this.state = {
            order: SORTING['DECENDING'],
            orderBy: 'FName',
            selected: [],
            page: 0,
            rowsPerPage: 5,
            expanded: false
        }
    }
    downLoadFile = (url) => {
        let newUrl = `${S3_REPORTS_END_POINT}/${url}`,
            fileType = url.split('.')[url.split('.').length-1],
            fileName = url.split('/')[url.split('/').length-1],
            header, responseType = 'blob';
        if(fileType === 'pdf') {
            header = {
                'Content-Type': 'application/pdf',
                'Accept': 'application/pdf'
            }
        } else if(fileType === 'xlsx') {
            // header = {
            //     'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            //     'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            // }
            // responseType = 'arraybuffer'
            header = {
                'Accept': 'application/vnd.ms-excel' 
            }
        } else if(fileType === 'xls') {
            header = {
                'Content-Type': 'application/vnd.ms-excel',
                'Accept': 'application/vnd.ms-excel' 
            }
        } else if(fileType === 'csv') {
            header = {
                'Content-Type': 'text/csv',
                'Accept': 'text/csv'
            }
        }
        axios({
            url: newUrl,
            method: 'GET',
            responseType: responseType, // important
            headers: header
          }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            // Appending link to body is required specifically for downloading on firefox.
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }).catch((error) => {
              console.log(error);
          });
    }

    handleExpandClick = () => {
        this.setState({expanded: !this.state.expanded})
    }
    render() {
        const {classes, stateData, handleServiceToggle,
            handleChangeEnd, handleChangeStart,
            getServiceReports} = this.props;
            let rows = [], searchList = [];
            if(stateData.report) {
                stateData.report.map((row) => {
                    row['generatedOn'] = formatDateTime(row['GeneratedOn'], DATE_TIME_FORMAT, DESCRIPTIVE_DATE_TIME_FORMAT)
                    row['link'] = <div onClick={e=>this.downLoadFile(row['Path'])}>
                                    <Avatar alt='download' src={download}></Avatar>
                                </div>
                })
                rows = [{ id: 'FName', numeric: 'left', disablePadding: false, label: 'Filename' },
                    { id: 'generatedOn', numeric: 'left', disablePadding: false, label: 'Generated On' },
                    { id: 'link', numeric: 'left', disablePadding: false, label: 'Download' }];
                searchList = [{id: 'FName', label: 'Filename'},
                    {id: 'generatedOn', label: 'Generated On'}]
            }
        return (
            <div className={classes.root}>
                <main className={classes.content}>
                    {stateData.loading &&
                        <LinearProgress className={classes.buttonProgress}/>
                    }
                    {(stateData.serviceList && stateData.serviceList.length > 0) &&
                        <GridList 
                            cellHeight={250} 
                            className={classes.gridList}>
                        {stateData.serviceList.map((row) => (
                            <Card className={classes.card} key={row.ServiceID}>
                                <CardHeader
                                avatar={
                                    <Avatar className={classes.avatar}>
                                        <PageviewIcon />
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
                                title={row.Title}
                                subheader={row.Description}
                                />
                                <CardContent>
                                    {row.Schedule &&
                                        <Typography><b>Schedule:</b> {row.Schedule.Every} {row.Schedule.Unit}</Typography>
                                    }
                                    {(Array.isArray(row.Actions) && row.Actions.length) &&
                                        <Typography component="div">
                                            {row.Actions.map((dt, index) => {
                                                return <Typography key={index}><b>{dt.Endpoint} :</b> {dt.Value}</Typography>
                                            })}
                                        </Typography>
                                    }
                                    <Typography><b>Report created on:
                                        </b> {formatDateTime(row.CreatedOn, DATE_TIME_FORMAT, DESCRIPTIVE_DATE_TIME_FORMAT)}</Typography>
                                </CardContent>
                                
                            </Card>
                            ))}
                        </GridList>
                    }
                    { (!stateData.loading && (!stateData.serviceList || stateData.serviceList.length === 0)) &&
                        <div><Typography variant="h6">No Services for given Project</Typography></div>
                    }
                    {stateData.showDate &&
                        <div className={classes.dateRow}>
                            <Typography variant="h6" className={classes.marginRight} >Custom</Typography>
                            <DatePicker
                                className={classes.marginRight}
                                selected={stateData.startDate}
                                selectsStart
                                startDate={stateData.startDate}
                                endDate={stateData.endDate}
                                onChange={handleChangeStart}
                                showMonthDropdown
                                showYearDropdown
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={5}
                                dateFormat="MM/d/YY HH:mm"
                                timeCaption="Time"
                                maxDate={new Date()}
                            />
                            <DatePicker
                                className={classes.marginRight}
                                selected={stateData.endDate}
                                selectsEnd
                                startDate={stateData.startDate}
                                endDate={stateData.endDate}
                                onChange={handleChangeEnd}
                                showMonthDropdown
                                showYearDropdown
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={5}
                                dateFormat="MM/d/YY HH:mm"
                                timeCaption="Time"
                                minDate={stateData.startDate}
                                maxDate={new Date()}
                            />
                            <Button onClick={getServiceReports}
                                color="primary" variant="contained"
                                size="small">
                                Go
                            </Button>
                        </div>
                    }
                    {stateData.rangeError &&
                        <Typography className={classes.errorMessage}>{stateData.rangeError}</Typography>
                    }

                    {stateData.report &&
                        <EnhancedTable data={stateData.report} rows={rows}
                        order={this.state.order} orderBy={this.state.orderBy}
                        rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                        selected={this.state.selected}
                        searchList={searchList}
                        redirectID="ID"
                        allowDelete={false} allowEdit={false}/>
                    }
                </main>
            </div>
        )
    }
}

export default withStyles(styles)(Reports);