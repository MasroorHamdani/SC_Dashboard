import React, {Component} from "react";
import {withStyles, Grid, TextField, Button,
    Typography} from '@material-ui/core';
import styles from './ProjectCreationStyle';

class ProjectGeneralInfo extends Component {
    constructor(props) {
      super(props)
      this.state = {
        // expanded: 'project'
      }
    }
    render() {
        const {classes, data, onChange, onClick} = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="site"
                            name="site"
                            label="Project Name" //{t('firstname')}
                            fullWidth
                            value={data.general.site}
                            onChange={e=>onChange(e, 'general')}/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="site_addr"
                        name="site_addr"
                        label="Site Address"
                        fullWidth
                        autoComplete="Site Address"
                        value={data.general.site_addr}
                        onChange={e=>onChange(e, 'general')}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="Region"
                        name="Region"
                        label="Time Zone/Region"
                        fullWidth
                        value={data.general.Region}
                        onChange={e=>onChange(e, 'general')}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="Email"
                            name="Email"
                            label="Email"
                            fullWidth
                            value={data.general.Email}
                            onChange={e=>onChange(e, 'general')}
                        />
                    </Grid>
                    {data.generalErrorMessage &&
                        <Grid 
                            item
                            xs={24} sm={12}>
                            <Typography
                                color="secondary">
                                {data.generalErrorMessage}
                            </Typography>
                        </Grid>
                    }
                    {data.showFooter &&
                        <Grid item xs={12} sm={6}
                            direction='row'
                            justify='flex-end'
                            >
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={e=>onClick('general', true)}>
                                Draft
                            </Button>
                        </Grid>
                    }
                    {data.showFooter &&
                        <Grid item xs={12} sm={6}
                            container
                            alignItems='center'
                            direction='row'
                            justify='flex-end'
                            >
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={e=>onClick('location')}>
                                Next
                            </Button>
                        </Grid>
                    }
                </Grid>
            </div>
        )
    }
}
export default withStyles(styles)(ProjectGeneralInfo);