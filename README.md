# Texta

Mutate TextNodes parts matching regular expressions.

## Method

Texta is a factory that produces observers that replace text in the DOM. These can also be used manually. 

The definition is:

    MutationObserver Texta(regex, match_callback, root, className)
        regex: (required)
            RegExp or a function that returns something that is passed to match_callback.
        match_callback: (required)
            Function that takes 1 parameter and returns a single node.
        root: (default: document.body)
            Node whose text is to be mutated.
        className: (default: "texta")
            CSS class to be applied to spans that replace modified TextNodes.
    
    Instance functions:
    
        MutationObserver mutate(node)
            Mutates all TextNodes under node which defaults to root.
    
        void start();
            Start the observer to watch root.
    
        void stop();
            Stop the observer.

## Examples

Cloud to Butt:

    Texta(/\b(C)(loud)/i, function(m){
        return document.createTextNode((m[1]=="C" && "B" || "b")+(m[2]=="LOUD" && "UTT" || "utt"));
    }).mutate().start();

A simple way to turn request numbers into links.

    Texta(/\bREQ\d{7}\b/, function(m){
        var a = document.createElement("a");
        a.className = "request";
        a.appendChild(document.createTextNode(m[0]));
    }).mutate().start();

### User Scripts

To include in user scripts use the following metablock entry:

    // @require https://raw.githubusercontent.com/anonscm/texta/master/lib/texta.js
