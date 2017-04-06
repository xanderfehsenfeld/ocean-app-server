

function streamData(url, args, username="xman", password="el33tnoob" ){
    var latest = document.getElementById('latest');
    var output = document.getElementById('output');
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    var position = 0;

    function handleNewData() {
        // the response text include the entire response so far
        // split the messages, then take the messages that haven't been handled yet
        // position tracks how many messages have been handled
        // messages end with a newline, so split will always show one extra empty message at the end
        var messages = xhr.responseText.split('\n');
        messages.slice(position, -1).forEach(function(value) {
            latest.textContent = value;  // update the latest value in place
            // build and append a new item to a list to log all output
            var item = document.createElement('li');
            item.textContent = value;
            output.appendChild(item);
        });
        position = messages.length - 1;
    }

    var timer;
    timer = setInterval(function() {
        // check the response for new data
        handleNewData();
        // stop checking once the response has ended
        if (xhr.readyState == XMLHttpRequest.DONE) {
            clearInterval(timer);
            latest.textContent = 'Done';
        }
    }, 30);
}

function printSpeed( content_length, timeElapsed ){
    var size = "size: " + (content_length/(Math.pow(2,20))).toFixed(3) + " mb"
    var time = "download time elapsed:" + (timeElapsed/1000).toFixed(5) + " s"
    var speed = "speed: " + ((content_length/(Math.pow(2,20)))/(timeElapsed/1000)).toFixed(3) + " mb/s"
    
    console.log( "DOWNLOADED DATA:\n" + size + ",\n" + time + ",\n" + speed)
    

}
function downloadData( url, args, username="xman", password="el33tnoob" ){
    
    /* args as they pertain to the server
     * 'callback': the string name of the javascript function to call when this request is answered
     * 'gzip' if included, the response will be compressed
    */
    
    /* Default args */
    var template = {callback:"hm.handleJSON"};
    
    /* Overwrite defaults if other values are provided.*/
    for (var attrname in args) { template[attrname] = args[attrname]; }
        
    var callback = template.callback;
    delete template.callback
    
    var start = performance.now();
                
    /* make asynchronous call */
    /* JSON Cross-origin Ajax request to the server */
    $.ajax({
        url: url,
        dataType: "json",
        data: template,
        success: (data, textStatus, jqXHR) => {
            console.timeEnd("ajaxRequest");
            printSpeed( jqXHR.getResponseHeader("Content-Length"), performance.now()-start );
            callback(data);
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
            console.time("ajaxRequest")
        },
    });   
    
}
