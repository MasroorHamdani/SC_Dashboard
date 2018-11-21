import React, { Component } from 'react';
import API_END_POINT from "./../constants/Constant";
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
        const url= API_END_POINT,
        endPoint = "/get-project",
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
                      'x-api-key':'QcbUJLoJSY2Mj1IdHNgAV6BoArOS6KHa7TlL4Qgx',
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
        // fetch(urlEndPoint, {
        //   method: 'POST',
        //   headers: {'Content-Type':'application/json',
        //   'x-api-key':'QcbUJLoJSY2Mj1IdHNgAV6BoArOS6KHa7TlL4Qgx',
        //   'Authorization':sessionStorage.getItem('IdToken')
        //   },
        //   body: JSON.stringify(data_to_post)
        // })
        // .then(result => result.json())
        // .then(result => {
        //   this.setState({
        //       data: result
        //   })
        // });
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