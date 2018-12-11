import React, { Component } from 'react';

/**
 * Component to display Analytics details for a select Device to User
 * It will show graphical data to users.
 */
class AnalysisData extends Component {
    render() {
        const {category} = this.props;
        return (
            <div>{category}</div>
        )
    }
}

export default AnalysisData;