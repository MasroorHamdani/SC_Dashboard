import React, { Component } from 'react';
import DataAnalysisComponent from '../components/dataAnalysis/DataAnalysis';

class DataAnalysis extends Component {
  state = ({
    value: '',
    header: "Devices"
  })
  handleChange = event => {
    this.setState({ value: event.target.value });
  };
  render () {
      const menuList = [
          {
            name: "Dashboard",
            id: 'Dashboard'
          },
          {
            name: "Data Analysis",
            id: "Data Analysis"
          },
          {
            name: "Reports",
            id: "Reports"
          },
        ];
      return(
          <DataAnalysisComponent menuList={menuList} data={this.state} handleChange={this.handleChange}/>
      )
  }
}

export default DataAnalysis;