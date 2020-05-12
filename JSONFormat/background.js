chrome.runtime.onConnect.addListener(function(port) {
    var loading = false
    port.onMessage.addListener(function(msg) {
        if(loading) return
        loading = true
        var url = msg.url;
        var options = {
            url: url,
            filename: (Math.random()+'').slice(2,12) + '.json',
            conflictAction: "overwrite",
            method: "GET",
        };
        chrome.downloads.download(options, function(){
            loading = false
        });
    });
});
