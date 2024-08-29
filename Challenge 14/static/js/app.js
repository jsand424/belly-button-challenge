// Function to build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dla-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the metadata
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    const result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const PANEL = d3.select("#sample-metadata");

    // Clear any existing metadata
    PANEL.html("");

    // Append key-value pairs to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Function to build the charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dla-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples array
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    const result = resultArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // Build the Bubble Chart
    const bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    const bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      margin: { t: 30, l: 150 },
      hovermode: 'closest',
      xaxis: { title: "OTU ID" },
      margin: { t: 0 }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Build the Bar Chart
    const yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    const barData = [{
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    }];

    const barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to initialize the dashboard
function init() {
  // Get a reference to the dropdown select element
  const selector = d3.select("#selDataset");

  // Populate the select options
  d3.json("https://static.bc-edx.com/data/dla-1-2/m14/lms/starter/samples.json").then((data) => {
    const sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function to handle changes in the dropdown menu
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
