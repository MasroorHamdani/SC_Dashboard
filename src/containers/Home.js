import React, { Component } from 'react';
import ProjectDataComponent from "./../components/projectData";
import "./../sass/App.css";
import * as constants from "../constants/Constant";
import axios from 'axios';
import { Redirect } from 'react-router'
import { NamespacesConsumer } from 'react-i18next';
// import * as DashboardActions from './../actions/dashboardAction';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : {},
      redirect: false
    }
  }
  // //Create
  // createTodo = (todo) => {
  //   this.props.actions.CreateTodo(todo)
  // }
  
  handleClick() {
    console.log('Click happened');
    // this.setState({ redirect: true })
    this.props.history.push(constants.REACT_URLS['PROJECT_DETAILS'])
  }

  componentDidMount(){
    const url= constants.API_END_POINT,
    endPoint = constants.API_URLS['DASHBOARD'],
    urlEndPoint = url + endPoint,
    self = this;
    axios({
      method:'GET',
      url: urlEndPoint,
      headers: {'Content-Type':'application/json',
                'x-api-key': constants.X_API_KEY,
                'Authorization':sessionStorage.getItem('IdToken')
              }
    }).then(function(response) {
      const mapped_data = [],
      response_data = response['data'];
      if(response_data["Item"]) {
        const projects = response_data["Item"]["Projects"]
        for (var key in projects) {
          projects[key]['key']=key;
          mapped_data.push(projects[key])
        }
      }
      self.setState({
        data: mapped_data
      })
    }).catch(function (error) {
      console.log(error);
    });
  }

    render() {
      const content = <div className="Something">Welcome Back</div>;
      const non_jsx = React.createElement(
        'div',
        {className: 'Something'},
        'Hello, React!',
        'or something more then that',
      );
      // if (this.state.redirect) {
      //   return <Redirect to='/project'/>;
      // }
      return (
        <div className="App App-header">
        <NamespacesConsumer>
          {
            t => <h1>{t('Welcome to React')}</h1>
          }
        </NamespacesConsumer>
          <ProjectDataComponent data={this.state.data} onClick={this.handleClick.bind(this)}/>
          {content}
          {non_jsx}
          
        </div>
      );
    }
  }
  
  export default Home;