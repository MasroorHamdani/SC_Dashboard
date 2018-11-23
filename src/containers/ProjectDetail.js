import React, { Component } from 'react';
import { connect } from "react-redux";

import {API_URLS, X_API_KEY} from "../constants/Constant";
import {getApiConfig} from "../services/ApiCofig";
import {projectData} from '../actions/ProjectDataAction';

class ProjectDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: "CERTIS_CCK_MRT",
            data : {}
        }
    }
    componentDidMount(){
        const endPoint = API_URLS['DASHBOARD'],
            data_to_post = {
                "pid": this.state.pid
            },
            config = getApiConfig(endPoint, X_API_KEY, 'POST', data_to_post);
        this.props.onProjectData(config);

        // const url= constants.API_END_POINT,
        // endPoint = constants.API_URLS['PROJECT_DETAILS'],
        // urlEndPoint = url + endPoint,
        // data_to_post = {
        //     "pid": this.state.pid
        // },
        // self = this;
        // axios({
        //     method: 'post',
        //     url: urlEndPoint,
        //     data: data_to_post,
        //     headers: {'Content-Type':'application/json',
        //               'x-api-key': constants.X_API_KEY,
        //               'Authorization':sessionStorage.getItem('IdToken')
        //             }
        //   })
        //   .then(function (response) {
        //     const response_data = response['data'];
        //     self.setState({
        //         data: response_data
        //     })
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   });
    }
    componentDidUpdate(prevProps, prevState) {
        console.log(this.props.state);
    }
    render() {
        return(
            <div>
                {/* {this.state.data} */}
                Welcome to Project details Page
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        state : state,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onProjectData: (config) => {
            //will dispatch the async action
            dispatch(projectData(config))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails);