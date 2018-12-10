import React, { Component } from 'react';
import DataAnalysisComponent from '../components/dataAnalysis/DataAnalysis';

class DataAnalysis extends Component {
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
            {
              name: "Reports",
              id: "Reports"
            }
          ];
          console.log(menuList, "***")
        return(
            <DataAnalysisComponent menuList={menuList}/>
        )
    }
}

export default DataAnalysis;