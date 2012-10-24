# player

播放视频和音频

## Getting Started


### In the browser
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/Hyvi/player/master/dist/player.min.js
[max]: https://raw.github.com/Hyvi/player/master/dist/player.js

In your web page:

```html
<script src="dist/player.min.js"></script>
<script>
/**   Video   */ 
// http://dl.vmall.com/u13001564/sample.avi?m=jsonp  // test env
var callurl = 'http://dl.vmall.com/u13001564/sample.avi';
//var callurl = 'http://dl.vmall.com/u13001564/movie.swf';
//var callurl = 'http://dl.vmall.com/u13001564/3d.wmv';
//var callurl = 'http://dl.vmall.com/u13001564/nianshaowuzhi.mp4';
//var callurl = 'http://dl.vmall.com/u13001564/Big_Buck_Bunny_Trailer_400p.ogg';

/**   Audio   */
//var callurl =  'http://dl.vmall.com/u13001564/nianshaowuzhi.mp3';

play(callurl,'mp',"inlinevideo");
</script>
```


## Documentation
###各种播放类型支持情况：
   - qt
       * support : wav/mp4
       * browsers : ie(>8) , QuickTime needed
       * systems : window
   - html5      
       * support : mp4(only chrome) ogg webm
       * browsers : ie(>8) chrome filefox
       * systems : window/linux/macos
   - swf
       * support .swf
       * browsers: ie(>5) chrome filefox
       * systems : window/linux/macos
   - mp
       * support : avi(only ie) wmv
       * browsers : ie(>5) firefox chrome
       * systems : window
   - audio
       * 参看：http://buzz.jaysalvat.com/documentation/sound/
   
## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

_Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "lib" subdirectory!_

## Release History
_(20121024)_    整理文档,完善readme.

## License
Copyright (c) 2012 Hyvi  
Licensed under the MIT license.
