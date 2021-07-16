function dropdown() {
    d3.json("samples.json").then((data)=> {
        console.log(data)
        // point to the dropdown menu 
        var dropMenu = d3.select("#selDataset");

        data.names.forEach(function(name) {
            dropMenu.append("option").text(name).property("value", name);
        });

        // Get the value of the input element
        var inputValue = dropMenu.property("value");
        console.log(inputValue);
    });
}

function demoInfo(sample) {
    d3.json("samples.json").then((data) =>{
        console.log(data);
        var metadata = data.metadata;
        console.log(metadata);

        var filteredData = metadata.filter(meta => meta.id == sample);
        console.log(filteredData);

        var result = filteredData[0];
        console.log(result);

        var demoDiv = d3.select("#sample-metadata");

        // var inputValue = dropMenu.property("value");
        // console.log(inputValue);
        
        // clear the previous demo info before loading another.
        demoDiv.html("");

        Object.entries(result).forEach(([key, value])=> {
            demoDiv.append("h5").text(`${key.toUpperCase()}: ${value}`);
        });

        // Build Guage chart
        var washFreq = result.wfreq;
        console.log(result);
        console.log(washFreq);

        var gaugeData = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: washFreq,
                title: { text: "Belly Button Wash Frequency <br> Scrubs per Week" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {axis: { range:[null, 9] } }
            }
        ];
        var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
}

function buildCharts(sample) {
    // promise, when it is fullfilled then show it.
    d3.json("samples.json").then((data) => {
        // console.log(data);

        var allData = data;  
        // console.log(allData);
        var samples = allData.samples;
        console.log(samples);

        var sampleArray = samples.filter(sampleObject => sampleObject.id == sample);
        console.log(sampleArray);

        var result = sampleArray[0];
        console.log(result);

        var sample_values = result.sample_values;
        console.log(sample_values)

        var otu_ids = result.otu_ids;
        console.log(otu_ids)

        var otu_labels = result.otu_labels;
        // console.log(otu_labels);

        // map used to iterate over each of the top 10 and create a string OTUid
        var tickMarks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

        // build Chart , slice give my top 10, reverse descending
        var barData = [{
            y: tickMarks, 
            x: sample_values.slice(0,10).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h",
        }];

        var barLayout = {
            title: "Top 10 Bacteria Cultures",
            margin: {
                t: 40,
                r: 0,
                b: 40,
                l: 140,
            }
        };

        Plotly.newPlot("bar",barData,barLayout);

        // build bubble chart  
        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth",
            }

        }];

        var bubbleLayout = [{
            title:"Bacteria Culteres per Sample",
            margin: {
                t: 50,
                r: 10,
                b: 10,
                l: 10,
            },
            hovermode: "closest",
        }]
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    }); // Cant access data after this point.
}

// This function initializes my page.
function init() {
    dropdown(940);
    demoInfo(940);
    buildCharts(940);
}
init();


// The function that my event listner is connected to found on my html
function optionChanged(nextSample) {
    demoInfo(nextSample);
    buildCharts(nextSample);
}