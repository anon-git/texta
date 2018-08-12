(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.Texta = factory();
    }
}(this, function () {

    function findTextNodes(root) {
        root = root || document.body;
        var textNodes = [];
        var ignoreTags = /^(?:a|noscript|option|script|style|textarea)$/i;
        (function findTextNodes(node) {
          node = node.firstChild;
          while (node) {
            if (node.nodeType == 3)
              textNodes.push(node);
            else if (!ignoreTags.test(node.nodeName))
              findTextNodes(node);
            node = node.nextSibling;
          }
        })(root);
        return textNodes;
    }

    function mutateText(regex, match_callback, root, className) {

        regex = new RegExp(regex, "g");

        function modifyTextNode(node) {
            var l, m;
            var txt = node.textContent;
            var span = null;
            var p = 0;
            
            if (txt.trim().length == 0)
                return;
            
            while ( (m=regex.exec(txt)) !== null)
            {
                if (null===span) {
                    // Create a new span for the replaced text and newly created href
                    span=document.createElement('span');
                    span.className=className;
                }

                // Put in text up to the link
                span.appendChild(document.createTextNode(txt.substring(p, m.index)));
                // Create a link and put it in the span
                span.appendChild(match_callback(m));
                //track insertion point
                p = m.index+m[0].length;
            }
            if (span) {
                // Take the text after the last link
                span.appendChild(document.createTextNode(txt.substring(p, txt.length)));
                
                // Replace the original text with the new span
                try {
                    node.parentNode.replaceChild(span, node);
                } catch (e) {
                    console.error(e);
                    console.debug(node);
                }
            }
        }

        if ('text/xml'!=document.contentType && 'application/xml'!=document.contentType) {
            var node, allLinks=findTextNodes(root);
            for(var i=0; i<allLinks.length; i++) {
                node=allLinks[i];
                modifyTextNode(node);
            }
        }
    }

    function Texta(regex, match_callback, root, className){
        root = root || document.body;
        className = className || 'texta';
        function onMutation(mutation) {
            for (var i = 0; i < mutation.addedNodes.length; ++i) {
                mutateText(regex, match_callback, mutation.addedNodes[i], className);
            }
        }
        var texta_observer = new MutationObserver(function(mutations, observer) {
            observer.stop();
            mutations.forEach(onMutation);
            observer.start();
        });
        var texta_observer_config = {
            attributes: false,
            characterData: false,
            childList: true,
            subtree: true
        };
        texta_observer.start = function() {
            texta_observer.observe(root, texta_observer_config);
        };
        texta_observer.stop = function() {
            texta_observer.disconnect();
        };
        texta_observer.mutate = function(node) {
            mutateText(regex, match_callback, node || root, className);
            return texta_observer;
        };
        return texta_observer;
    }

    return Texta;

}));
