import React, { Component } from 'react';
import * as constants from "../constants/Constant";
import axios from 'axios';

class ProjectDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: "CERTIS_CCK_MRT",
            data : {}
        }
    }
    componentDidMount(){
        const url= constants.API_END_POINT,
        endPoint = constants.API_URLS['PROJECT_DETAILS'],
        urlEndPoint = url + endPoint,
        data_to_post = {
            "pid": this.state.pid
        },
        self = this;
        axios({
            method: 'post',
            url: urlEndPoint,
            data: data_to_post,
            headers: {'Content-Type':'application/json',
                      'x-api-key': constants.X_API_KEY,
                      'Authorization':sessionStorage.getItem('IdToken')
                    }
          })
          .then(function (response) {
            const response_data = response['data'];
            self.setState({
                data: response_data
            })
          })
          .catch(function (error) {
            console.log(error);
          });
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

export default ProjectDetails;