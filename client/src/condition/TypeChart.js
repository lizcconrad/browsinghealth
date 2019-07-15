import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { Bar } from 'react-chartjs-2';

// array of the labels used in the chart 
const labels = [
  'Drug',
  'Other',
  'Procedure',
  'Behavioral',
  'Device',
  'Biological',
  'Dietary Supplement',
  'Radiation',
  'Genetic',
  'Diagnostic Test',
  'Combination Product'];
// color that each bar is filled with
const backgroundColor = [
  "rgba(255, 179, 186, 0.4)", 
  "rgba(255, 223, 186, 0.4)", 
  "rgba(255, 255, 186, 0.4)", 
  "rgba(186, 255, 201, 0.4)",
  "rgba(186, 255, 255, 0.4)",
  "rgba(255, 179, 186, 0.4)", 
  "rgba(255, 223, 186, 0.4)", 
  "rgba(255, 255, 186, 0.4)", 
  "rgba(186, 255, 201, 0.4)",
  "rgba(186, 255, 255, 0.4)"];
// border color of each bar
const borderColor = [
  "rgba(255, 179, 186, 1)", 
  "rgba(255, 223, 186, 1)", 
  "rgba(255, 255, 186, 1)", 
  "rgba(186, 255, 201, 1)",
  "rgba(186, 255, 255, 1)",
  "rgba(255, 179, 186, 1)", 
  "rgba(255, 223, 186, 1)", 
  "rgba(255, 255, 186, 1)", 
  "rgba(186, 255, 201, 1)",
  "rgba(186, 255, 255, 1)"];
const borderWidth = 2;

// GraphQL query to get the intervention distribution given a condition
const TYPE_DISTRIBUTION = gql`
  query($condition: String!) {
    typeDistribution(condition: $condition) {
      _id
      count
    }
  }
`

class TypeChart extends Component {

  constructor(props) {
    super(props);

    this.labels = labels;
    this.backgroundColor = backgroundColor;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
    
    // set the default distribution value for each intervention type to be 0
    this.state = {
        chartData: {
        'drug': 0,
        'other': 0,
        'procedure': 0,
        'behavioral': 0,
        'device': 0,
        'biological': 0,
        'dietary supplement': 0,
        'radiation': 0,
        'genetic': 0,
        'diagnostic test': 0,
        'combination product': 0
      }
    }
  }

  //after the component is rendered, call this function to update the state and the chart
  componentDidMount() {

    // array to hold the current chartData
    let currentChart = this.state.chartData
    // array of the data that goes in the chart
    let dataArray = [];
    let total = 0;

    // refetch the GraphQL query that collects the distribution data
    this.props.TYPE_DISTRIBUTION.refetch()
      .then((result) => {
        // add the amount of each type of intervention to get a total for calculating the percentage distribution
        for (let i = 0; i < result.data.typeDistribution.length; i++) {
          total += result.data.typeDistribution[i].count;
        }

        for (let i = 0; i < result.data.typeDistribution.length; i++) {
          //result.data.typeDistribution[i]._id is the string of the intervention type
          // so using this id as the key will save the data to the proper place in the dictionary
          // the righthand side of the equation is just a calculation of the percentage of how many interventions are of this type
          currentChart[result.data.typeDistribution[i]._id] = parseFloat(((result.data.typeDistribution[i].count / total) * 100).toFixed(2));
        }

        // save the data from the state's chartData to an array
        // this is necessary because the chart component itself takes a simple array of data, not a dictionary
        for (let key in currentChart) {
          dataArray.push(currentChart[key]);
        }

        // save this array to the state
        this.setState({dataArray: dataArray});

      });
  }

  render() {    

    if(this.props.TYPE_DISTRIBUTION.loading) {
      return null;
    }

    let data;
    let options;

    // if the state has a dataArray (built in componentDidMount)
    if(this.state.dataArray) {

      // data for the chart
      data = {
        datasets: [{
          data: this.state.dataArray,
          backgroundColor: this.backgroundColor,
          borderColor: this.borderColor,
          borderWidth: this.borderWidth
        }],
        labels: this.labels
      };

      // options for the chart
      options = {
        // whether to display the legend
        legend: { display: false },
        scales: {
          yAxes: [{
            ticks: {
              callback: function(value){return value + "%"}
            },  
            scaleLabel: {
              display: true,
              labelString: "Percentage"
            }
          }]
        }
      };

      return(<Bar data={data} options={options} />);

    } else {
      return(null);
    }
  }
}

// export the graphql query with a name
// the name is saved to props if needed
export default compose(
  graphql(TYPE_DISTRIBUTION, { name: "TYPE_DISTRIBUTION" })
)(TypeChart);
