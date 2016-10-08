

//import {load_js} from '../pkg.js'

export function use_color(){
    if (!window._color){
        window._color=true
        document.write(`<script src="http://cdn.bootcss.com/spectrum/1.8.0/spectrum.min.js"></script>`)
        document.write(`<link href="http://cdn.bootcss.com/spectrum/1.8.0/spectrum.min.css" rel="stylesheet">`)

    }

}


