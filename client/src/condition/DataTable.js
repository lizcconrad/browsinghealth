import React, { Component } from 'react';
import ReactTable from "react-table";
import List from './List.js';

export default class DataTable extends Component {
  render() {

    let defaultPageSize, showPagination, showPageSizeOptions;
    
    // if the length of the data is less than the defaultPageSize, only show as many rows as there are data
    // otherwise, use the defaultPageSize from this.props
    if(this.props.data.length <= this.props.defaultPageSize) {
      defaultPageSize = this.props.data.length;
      showPagination = false;
      showPageSizeOptions = false;
    } else {
      defaultPageSize = this.props.defaultPageSize;
      showPagination = true;
      showPageSizeOptions = true;
    }

    let table = null;
    if(this.props.subComponent) {
      table = <ReactTable
        data={this.props.data}
        columns={this.props.columns}
        defaultPageSize={defaultPageSize}
        showPagination={showPagination}
        showPageSizeOptions={showPageSizeOptions}
        // SubComponent used to display the list of links to clinical trials
        SubComponent = {
          row => {
            return(<List links={this.props.data[row.index].nct_ids} />)
          }
        }
      />
    } else {
      table = <ReactTable
        data={this.props.data}
        columns={this.props.columns}
        defaultPageSize={defaultPageSize}
        showPagination={showPagination}
        showPageSizeOptions={showPageSizeOptions}
      />
    }
    
    return (
      table
    )
  }

}

DataTable.defaultProps = {
  subComponent: true
}
