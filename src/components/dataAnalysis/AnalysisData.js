import React, { Component } from 'react';

class AnalysisData extends Component {
    render() {
        const {category} = this.props;
        return (
            <div>{category}</div>
        )
    }
}

export default AnalysisData;