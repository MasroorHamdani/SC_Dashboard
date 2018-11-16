import React, { Component } from 'react';
import ProjectDataComponent from "./projectData";
import "./App.css";

// import Helmet from 'react-helmet';
class Home extends Component {
  state = {
    // pid: "CERTIS_CCK_MRT",
    data : {}
  }
  componentDidMount(){
    const url= "https://1w5tcso1ol.execute-api.ap-southeast-1.amazonaws.com/alpha",
    endPoint = "/get-settings",
    urlEndPoint = url + endPoint;

    fetch(urlEndPoint, {
      method: 'GET',
      headers: {'Content-Type':'application/json',
      'x-api-key':'QcbUJLoJSY2Mj1IdHNgAV6BoArOS6KHa7TlL4Qgx',
      'Authorization':sessionStorage.getItem('IdToken')
      }
    })
    .then(result => result.json())
    .then(result => {
      const mapped_data = [];
      if(result["Item"]){
        const projects = result["Item"]["Projects"]
        for (var key in projects) {
          projects[key]['key']=key;
          mapped_data.push(projects[key])
        }
      }
      this.setState({
          data: mapped_data
      })
      // console.log(this.state.data, typeof(this.state.data));
      // var arr3 = Object.values(this.state.data);
      // console.log(arr3, typeof(arr3));
      console.log(this.state.data.length, "9099")
      this.state.data.map((row, index) => {
        console.log(index, row);
      });
    });
    
    // const url= "https://1w5tcso1ol.execute-api.ap-southeast-1.amazonaws.com/alpha",
    // endPoint = "/get-project",
    // urlEndPoint = url + endPoint,
    // data_to_post = {
    //   "pid": this.state.pid
    // };

    //     fetch(urlEndPoint, {
    //       method: 'post',
    //       headers: {'Content-Type':'application/json',
    //       'x-api-key':'QcbUJLoJSY2Mj1IdHNgAV6BoArOS6KHa7TlL4Qgx',
    //       'Authorization':sessionStorage.getItem('IdToken')
    //       },
    //       body: JSON.stringify(data_to_post)
    //     })
    //     .then(result => result.json())
    //     .then(result => {
    //         this.setState({
    //             data: result
    //         })
    //     });
  }
    render() {
      const content = <div className="Something">
            <h2>Welcome to SmartClean</h2>
          </div>;
      const non_jsx = React.createElement(
        'div',
        {className: 'Something'},
        'Hello, React!',
        'or something more then that',
      );
      
      // const result = data.map((entry, index) => {
      //   return <li key={index}>{entry}</li>;
    // });

      return (
        <div className="App App-header">
          {/* <Helmet title="SmartClean" /> */}
          <ProjectDataComponent data={this.state.data}/>
          {content}
          {non_jsx}
        </div>
      );
    }
  }
  
  export default Home;