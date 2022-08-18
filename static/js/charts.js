function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);

    console.log(data);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
      // Create a variable that holds the samples array. 
      let samples = data.samples;
      console.log(samples);
      // Create a variable that filters the samples for the object with the desired sample number.
      let sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
      // Create a variable that holds the first sample in the array.
      let selectedSample = sampleArray[0];
      console.log(selectedSample);
      // Create variables that hold the otu_ids, otu_labels, and sample_values.
      let otuID = selectedSample.otu_ids.toString().split(",");
      console.log(otuID);
      let otuLabels = selectedSample.otu_labels;
      console.log(otuLabels);
      let sampleValues = selectedSample.sample_values;
      console.log(sampleValues)});

      // Create the yticks for the bar chart
      // Chain the slice() method with the map() and reverse() functions to 
      //retrieve the top 10 otu_ids sorted in descending order.

      var yticks = otuID.map(function(element){
        return `OTU ${element}`;}).slice(0,10).reverse();
      console.log(yticks);

      var xticks = sampleValues.slice(0,10).reverse();
      console.log(xticks)

      // Create the trace for the bar chart. 
      var barData = [{
        x: xticks,
        y: yticks,
        text: otuLabels.slice(0,10).reverse(),
        type: "bar",
        orientation: 'h'    
      }];

      // Create the layout for the bar chart. 
      var barLayout = {
        title: 'Top 10 Species of Bacteria',
        width: 450, 
        height: 400                
      };

      // Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", [barData], barLayout);


    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuID,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      markers: {
        color: otuID,
        size: sample_values
    }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout); 


    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    let metaData = data.metadata;
    // 2. Create a variable that holds the first sample in the metadata array.
    let metaDataArray = metaData.filter(sampleObj => sampleObj.id == sample);
    let metaSample = metaDataArray[0];
    // 3. Create a variable that holds the washing frequency.
    let wfreq = metaSample.wfreq;
    console.log(wfreq);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wfreq,
      type: 'indicator',
      mode: 'gauge+number',
      title: {text: 'Belly Button Washing Frequency<br># of Scrubs per Week'},
      gauge: {
        axis: {range: [0,10], tickwidth: 1, tickcolor: 'darkslateblue'},
        bar: {color: darkslateblue},
        borderwidth: 2,
        steps: [
          {range: [0,2], color: 'coral'},
          {range: [2,4], color: 'lightgreen'},
          {range: [4,6], color: 'crimson'},
          {range: [6,8], color: 'teal'},
          {range: [8,10], color: 'peachpuff'}
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     width: 500,
     height: 400,
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);

};