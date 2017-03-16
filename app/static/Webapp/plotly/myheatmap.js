/* A wrapper class for the Plotly chart 'heatmapgl'.
Based off of the animation examples from the plotly.js websites
Requests data from a server and adds to a plotly heatmap graph
*/






class MyHeatmap{
    
    constructor( div, height ){
        
        /* define sliders */    
        this.sliders = [{
            pad: {t: 30},
            currentvalue: {
                xanchor: 'right', prefix: 'frame: ',font: {color: '#888',size: 20}
            },
            
        }];
    
        /* The id of the div which will contain the heatmap */
        this.div = div;
        
        /* set the height */
        layout.height = height;
        
    }
    
    /* Initially plot the map with one frame of data */
    initHeatmap( json ){
        
        var z = json.frames[0];
        
        /* Initial data Data */
        var trace = [
            {
                z: z,
                /* x: json.lonp,
                y: json.latp, */
                hoverinfo:"z+text",            
                type: 'heatmapgl',
                colorscale: 'Jet',
                opacity: 1,
                reversescale: false,
                name:'trace0',
                connectgaps: false,
                zsmooth:"fast",
            }
        ];
        
        /* set the width */
        layout.width = json.ratio * layout.height;
        layout.margin = {
                t: 100,
                r: 100 * json.ratio,
                b: 100,
                l: 100 * json.ratio,
        }
        
        /* Initinally plot an empty heatmap */
        Plotly.plot(this.div, trace, layout,  {scrollZoom: false, staticPlot:false, displayModeBar: false, showLink:false});
        
        /* Bind the event listeners */
        this.bindEventListeners();
        
    }
        
    /* Bind plotly event listeners*/
    bindEventListeners(){
        
        function stringify( obj ){
            var props = "{"
            if (obj !== null) { 
                for (var propertyname in obj) {
                    props = props + propertyname + ", ";
                }
            }

            return props + "}"         
        }
        
        var myPlot = document.getElementById( this.div )
        var plotData = myPlot.data;
        console.log( stringify( myPlot.data ) );
        
        myPlot.on('plotly_restyle', function(){
            console.log("restyle");
        });
        
        myPlot.on('plotly_relayout', function(data){
            console.log("relayout traces:" );
        });
        
        /* No data provided */
        myPlot.on('plotly_animated', function(  data ){           
            console.log("animated " + stringify( plotData ));
            
        });
        
        myPlot.on('plotly_redraw', function(){
            console.log("redraw");
        });
        
        myPlot.on('plotly_afterplot', function(){
            console.log("afterplot");
        });
    }
    
    /* Play through the frames */
    play(){
        
        /* Begin with initial animation */
        Plotly.animate(this.div, null, updatemenus[0]['buttons'][0]['args'][1]);
    }
    
    /* Add frames to the plot and animate */
    addFrames( json ){
        
        //console.log( Object.keys( json.frames ) )
                    
        /* Make the frames to animate */
        var id;
        
        var processedFrames = [];
        
        Object.keys( json.frames ).map( function( key, index ){
            
            processedFrames.push( {
                name: "" + key,
                data: [{
                    z: json.frames[key],
                }],
                traces: [0],
            } );
        });
        
        /* Add and animate frames */
        Plotly.addFrames( this.div, processedFrames );
        this.play();
        
        
    }
    
    
}