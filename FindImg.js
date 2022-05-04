/**
 * Function which gives possibility to change the 'alt' attribute of any clickable <img/> on the page
 *
 * @param  inputWrapper  Wrapper for input in what you can edit the 'alt' <img/> attribute
 * @see    undefined              HTMLElement
 */
function findImg(inputWrapper){

    let inputField = document.createElement('input');
    inputWrapper.appendChild(inputField)

    const standardImageBorder = '3px solid red';
    const chosenImageBorder = '5px solid green';
    const chosenShadow = 'green 0 0 13px 20px';
    const standardShadow = 'none';

    let chosenImg = null;

    inputField.addEventListener('focusout', (event) => {
        if(chosenImg) {
           chosenImg.alt = inputField.value;
        }
    })

    let imgs = document.getElementsByTagName("img");

    for (let i = 0; i < imgs.length; i++) {
        getWords(1).then(
            (result) => {
                imgs[i].alt = result[0];
            }
        )
        setImageBorder(imgs[i], standardImageBorder);
        setImageShadow(imgs[i], standardShadow)
        setImageClickListener(imgs[i]);
    }

    inputField.addEventListener('change', (event) => {
        if(event.target.value !== window.selectedImg.alt){
            window.selectedImg.alt = event.target.value;
        }
    })

    function setImageBorder(node, borderStyle) {
            node.style.border = borderStyle;
    }

    function setImageShadow(node, shadowStyle) {
        node.style.boxShadow = shadowStyle;
    }

    function setImageClickListener(node) {
        node.addEventListener('click', (event) => {
            //Check if event node it's not a current
            if(window.selectedImg === event.target){
                return;
            }
            chosenImg = node;
            //Change styles for current
            setImageBorder(chosenImg, chosenImageBorder);
            setImageShadow(chosenImg, chosenShadow);
            //Change styles for previous
            if(window.selectedImg){
                setImageBorder(window.selectedImg, standardImageBorder);
                setImageShadow(window.selectedImg, standardShadow);
            }
            inputField.value = event.target.alt;
            window.selectedImg = event.target;
        })
    }

    function getWords(number) {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();//TODO: investigate xmlhttprequest and Fetch API difference/useful
            xhr.onload = function () {
                if (this.status == 200) {
                    const data = JSON.parse(this.responseText);
                    resolve(data);
                } else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                }
            };

            xhr.open('GET', 'https://random-word-api.herokuapp.com/word?number=' + number, true);
            xhr.send();
        })
    }

    const observeDOM = (function(){
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        return function( obj, callback ){
            if( !obj || obj.nodeType !== 1 ) return;

            if( MutationObserver ){
                // define a new observer
                const mutationObserver = new MutationObserver(callback)

                // have the observer observe foo for changes in children
                mutationObserver.observe( obj, { childList:true, subtree:true })
                return mutationObserver
            }

            // browser support fallback
            else if( window.addEventListener ){
                obj.addEventListener('DOMNodeInserted', callback, false)
                obj.addEventListener('DOMNodeRemoved', callback, false)
            }
        }
    })()

    const container = document.querySelector('body');

    // Observe a specific DOM element:
    observeDOM( container, function(m){
        let addedNodes = [];

        m.forEach(record => record.addedNodes.length & addedNodes.push(...record.addedNodes))

        //Filter if there can be some 'not img' elements
        addedNodes = addedNodes.filter(node => node.nodeName === 'IMG')

        //New images
        addedNodes.forEach((node) => {
            setImageClickListener(node);
            setImageBorder(node, standardImageBorder);
            setImageShadow(node, standardShadow)
            getWords(1)
                .then((words) => node.alt = words[0])
                .catch(alert);
        })
    });

}

//FOR TESTING, add input and img in one time
setTimeout(() => {
    let img = document.createElement('img');
    img.setAttribute('src', 'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg')
    document.body.appendChild(img)
    let text = document.createElement('input');
    document.body.appendChild(text)
}, 3000)


findImg(document.querySelector('body'))