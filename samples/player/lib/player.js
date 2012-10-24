/*
 * Update from Jsonp 
 * jQuery JSONP Core Plugin 2.1.4 (2010-11-17)
 * 
 * http://code.google.com/p/jquery-jsonp/
 *
 * Copyright (c) 2010 Julian Aubourg
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 */
var D = {}; // update from jquery 
D.type = (function(){
    // class => type
    var class2type = {}; 
    var arr = 'Boolean Number String Function Array Date RegExp Object'.split(" ");
    for (var i = 0; i < arr.length; i++) {
        class2type['[object '+ arr[i]+']'] = arr[i].toLowerCase();
    }  

    return function(obj){
       return !obj? String(obj):class2type[Object.prototype.toString.call(obj)]||"object";
    };
}());

D.isWindow = function(obj){
    return obj && obj == obj.window;
};

D.isPlainObject =  function( obj ) {
        var core_hasOwn = Object.prototype.hasOwnProperty;
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || D.type(obj) !== "object" || obj.nodeType || D.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	};
D.param = function(a){
    var s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = D.type( value ) === 'function' ? value() : ( !value ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};
        // object 
        for(var i in a ){
            if(a.hasOwnProperty(i)){
                add(i,a[i]); 
            }
        }
        return s.join( "&" ).replace(/%20/g, "+" );
}

D.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !D.type(target) === 'function' ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( D.isPlainObject(copy) || (copyIsArray = (D.type(copy)==='array')) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && (D.type(src) === 'array') ? src : [];

					} else {
						clone = src && D.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = D.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

D.browser = (function(){
  var matched, browser;
  // Use of jQuery.browser is frowned upon.
  // More details: http://api.jquery.com/jQuery.browser
  // jQuery.uaMatch maintained for back-compat
  var uaMatch = function( ua ) { 
      ua = ua.toLowerCase();

      var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
      /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
      /(msie) ([\w.]+)/.exec( ua ) ||
      ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
      []; 

      return {
          browser: match[ 1 ] || "", 
          version: match[ 2 ] || "0" 
      };  
  };

  matched = uaMatch( navigator.userAgent );
  browser = {}; 

  if ( matched.browser ) { 
      browser[ matched.browser ] = true;
      browser.version = matched.version;
  }

  // Chrome is Webkit, but Webkit is also Safari.
  if ( browser.chrome ) { 
      browser.webkit = true;
  } else if ( browser.webkit ) { 
      browser.safari = true;
  }

  return  browser;

}());

( function( $ , setTimeout ) {
	
	// ###################### UTILITIES ##
	
	// Noop
	function noop() {
	}
	
	// Generic callback
	function genericCallback( data ) {
		lastValue = [ data ];
	}

	// Add script to document
	function appendScript( node ) {
		head.insertBefore( node , head.firstChild );
	}
	
	// Call if defined
	function callIfDefined( method , object , parameters ) {
		return method && method.apply( object.context || object , parameters );
	}
	
	// Give joining character given url
	function qMarkOrAmp( url ) {
		return /\?/ .test( url ) ? "&" : "?";
	}
	
	var // String constants (for better minification)
		STR_ASYNC = "async",
		STR_CHARSET = "charset",
		STR_EMPTY = "",
		STR_ERROR = "error",
		STR_JQUERY_JSONP = "_jqjsp",
		STR_ON = "on",
		STR_ONCLICK = STR_ON + "click",
		STR_ONERROR = STR_ON + STR_ERROR,
		STR_ONLOAD = STR_ON + "load",
		STR_ONREADYSTATECHANGE = STR_ON + "readystatechange",
		STR_REMOVE_CHILD = "removeChild",
		STR_SCRIPT_TAG = "<script/>",
		STR_SUCCESS = "success",
		STR_TIMEOUT = "timeout",
		
		// Shortcut to jQuery.browser
		browser = $.browser,
		
		// Head element (for faster use)
		head = document.getElementsByTagName('head')[ 0 ] || document.documentElement,
		// Page cache
		pageCache = {},
		// Counter
		count = 0,
		// Last returned value
		lastValue,
		
		// ###################### DEFAULT OPTIONS ##
		xOptionsDefaults = {
			//beforeSend: undefined,
			//cache: false,
			callback: STR_JQUERY_JSONP,
			//callbackParameter: undefined,
			//charset: undefined,
			//complete: undefined,
			//context: undefined,
			//data: "",
			//dataFilter: undefined,
			//error: undefined,
			//pageCache: false,
			//success: undefined,
			//timeout: 0,
			//traditional: false,		
			url: location.href
		};
	
	// ###################### MAIN FUNCTION ##
	function jsonp( xOptions ) {
		
		// Build data with default
		xOptions = $.extend( {} , xOptionsDefaults , xOptions );
		
		// References to xOptions members (for better minification)
		var completeCallback = xOptions.complete,
			dataFilter = xOptions.dataFilter,
			callbackParameter = xOptions.callbackParameter,
			successCallbackName = xOptions.callback,
			cacheFlag = xOptions.cache,
			pageCacheFlag = xOptions.pageCache,
			charset = xOptions.charset,
			url = xOptions.url,
			data = xOptions.data,
			timeout = xOptions.timeout,
			pageCached,
			
			// Abort/done flag
			done = 0,
			
			// Life-cycle functions
			cleanUp = noop;
		
		// Create the abort method
		xOptions.abort = function() { 
			! done++ &&	cleanUp(); 
		};

		// Call beforeSend if provided (early abort if false returned)
		if ( callIfDefined( xOptions.beforeSend, xOptions , [ xOptions ] ) === false || done ) {
			return xOptions;
		}
			
		// Control entries
		url = url || STR_EMPTY;
		data = data ? ( (typeof data) == "string" ? data : $.param( data , xOptions.traditional ) ) : STR_EMPTY;
			
		// Build final url
		url += data ? ( qMarkOrAmp( url ) + data ) : STR_EMPTY;
		
		// Add callback parameter if provided as option
		//callbackParameter && ( url += qMarkOrAmp( url ) + encodeURIComponent( callbackParameter ) + "=?" );
		
		// Add anticache parameter if needed
		! cacheFlag && ! pageCacheFlag && ( url += qMarkOrAmp( url ) + "_" + ( new Date() ).getTime() + "=" );
		
		// Replace last ? by callback parameter
		//url = url.replace( /=\?(&|$)/ , "=" + successCallbackName + "$1" );
		
		// Success notifier
		function notifySuccess( json ) {
			! done++ && setTimeout( function() {
				cleanUp();
				// Pagecache if needed
				pageCacheFlag && ( pageCache [ url ] = { s: [ json ] } );
				// Apply the data filter if provided
				dataFilter && ( json = dataFilter.apply( xOptions , [ json ] ) );
				// Call success then complete
				callIfDefined( xOptions.success , xOptions , [ json , STR_SUCCESS ] );
				callIfDefined( completeCallback , xOptions , [ xOptions , STR_SUCCESS ] );
			} , 0 );
		}
		
		// Error notifier
		function notifyError( type ) {
			! done++ && setTimeout( function() {
				// Clean up
				cleanUp();
				// If pure error (not timeout), cache if needed
				pageCacheFlag && type != STR_TIMEOUT && ( pageCache[ url ] = type );
				// Call error then complete
				callIfDefined( xOptions.error , xOptions , [ xOptions , type ] );
				callIfDefined( completeCallback , xOptions , [ xOptions , type ] );
			} , 0 );
		}
	    
		// Check page cache
		pageCacheFlag && ( pageCached = pageCache[ url ] ) 
			? ( pageCached.s ? notifySuccess( pageCached.s[ 0 ] ) : notifyError( pageCached ) )
			:
			// Initiate request
			setTimeout( function( script , scriptAfter , timeoutTimer ) {
				
				if ( ! done ) {
				
					// If a timeout is needed, install it
					timeoutTimer = timeout > 0 && setTimeout( function() {
						notifyError( STR_TIMEOUT );
					} , timeout );
					
					// Re-declare cleanUp function
					cleanUp = function() {
						timeoutTimer && clearTimeout( timeoutTimer );
						script[ STR_ONREADYSTATECHANGE ]
							= script[ STR_ONCLICK ]
							= script[ STR_ONLOAD ]
							= script[ STR_ONERROR ]
							= null;
						head[ STR_REMOVE_CHILD ]( script );
						scriptAfter && head[ STR_REMOVE_CHILD ]( scriptAfter );
					};
					
					// Install the generic callback
					// (BEWARE: global namespace pollution ahoy)
					window[ successCallbackName ] = genericCallback;

					// Create the script tag
					script = document.createElement( 'script' );
					script.id = STR_JQUERY_JSONP + count++;
					
					// Set charset if provided
					if ( charset ) {
						script[ STR_CHARSET ] = charset;
					}
					
					// Callback function
					function callback( result ) {
						( script[ STR_ONCLICK ] || noop )();
						result = lastValue;
						lastValue = undefined;
						result ? notifySuccess( result[ 0 ] ) : notifyError( STR_ERROR );
					}
										
					// IE: event/htmlFor/onclick trick
					// One can't rely on proper order for onreadystatechange
					// We have to sniff since FF doesn't like event & htmlFor... at all
					if ( browser.msie ) {
						
						script.event = STR_ONCLICK;
						script.htmlFor = script.id;
						script[ STR_ONREADYSTATECHANGE ] = function() {
							/loaded|complete/.test( script.readyState ) && callback();
						};
						
					// All others: standard handlers
					} else {					
					
						script[ STR_ONERROR ] = script[ STR_ONLOAD ] = callback;
						
						browser.opera ?
							
							// Opera: onerror is not called, use synchronized script execution
							( ( scriptAfter = document.getElementsByTagName( STR_SCRIPT_TAG )[ 0 ] ).text = "document.getElementById('" + script.id + "')[0]." + STR_ONERROR + "()" )
							
							// Firefox: set script as async to avoid blocking scripts (3.6+ only)
							: script[ STR_ASYNC ] = STR_ASYNC;
					}
					
					// Set source
					script.src = url;
					
					// Append main script
					appendScript( script );
					
					// Opera: Append trailing script
					scriptAfter && appendScript( scriptAfter );
				}
				
			} , 0 );
		
		return xOptions;
	}
	
	// ###################### SETUP FUNCTION ##
	jsonp.setup = function( xOptions ) {
		$.extend( xOptionsDefaults , xOptions );
	};

	$.jsonp = jsonp;
	
}( D , setTimeout ) );



/**
 * player
 * Copyright (c) 2012 Hyvi
 * Licensed under the MIT license.
 */

/**
 * 播放视频或者音频
 * 各种播放类型支持情况：
 *  - qt
 *      support : wav/mp4
 *      browsers : ie(>8) , QuickTime needed
 *      systems : window
 *  - html5      
 *      support : mp4(only chrome) ogg webm
 *      browsers : ie(>8) chrome filefox
 *      systems : window/linux/macos
 *  - swf
 *      support .swf
 *      browsers: ie(>5) chrome filefox
 *      systems : window/linux/macos
 *  - mp
 *      support : avi(only ie) wmv
 *      browsers : ie(>5) firefox chrome
 *      systems : window
 *  - audio
 *      参看：http://buzz.jaysalvat.com/documentation/sound/
 *      
 * @param {String} callurl 视频或者音频文件的直链地址
 * @param {String} type  选用那种播放方式，例如：视频播放类型有qt\html5\swf\mp,音频播放类型有audio. 以上播放类型的支持情况见详细描述。
 * @param {String} container    放在页面播放的位置,dom元素的id值。
 * @api public
 */
function play(callurl,type,container){ 
    var param = {m:'jsonp', jsoncallback: "_jqjsp"}, o = {};

    // 处理返回来的数据
    o.success = function(data){
        // data 包含返回来的地址
        // for example :
        // {"retcode":"0000","url":"http:\/\/file.dbank.com\/file\/MDAwMDAwMDH_B4hlDaY-vrS_zoETQtBWjnLyZqny0ViWUm5CEINm7g..\/bb516947768fbb05b41a2487f200716e14400\/sample.avi?key=AAABQFBf64UWE2T6&a=13001564-c0a8c9b0-48049-e3bebc2607\/stat_manual6cc5&mode=download"}
        if(data.retcode === '0000'){

            // 1, 设置播放器的模板代码，用${video_src}替换播放视频的url值
            var embed,select = type;
            /**  Audio  */
            if(select === 'audio'){
               var mySound = new buzz.sound(data.url); 
               mySound.play();
            }

            /**  Video  */
            if(select === 'qt'){ 
                // support : wav/mp4
                // browsers : ie(>8) , QuickTime needed
                // systems : window
                embed = '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab"> <param name="src" value="${video_src}"><param name="controller" value="true"> </object>';
            }else if ( select === 'html5') { 
                // support : mp4(only chrome) ogg webm 
                // browsers : ie(>8) chrome filefox
                // systems : window/linux/macos
                embed = '<video  controls="controls"> <source src="${video_src}" type="video/mp4"> <source src="${video_src}" type="video/ogg"> <source src="${video_src}" type="video/webm"> Your browser does not support the video tag.  </video>';
            }else if( select === 'swf' ){
                // support .swf
                // browsers: ie(>5) chrome filefox 
                // systems : window/linux/macos
                // http://www.w3schools.com/html/html_object.asp
                // flash by using swfobject http://stackoverflow.com/questions/137326/best-way-to-embed-a-swf-file-in-a-html-page
                embed = '<object  classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/ pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0"> <param name="SRC" value="${video_src}"> <embed src="${video_src}" > </embed> </object>';
            }else if (select === 'mp'){
                // Playing WMV Movies Using Windows Media Player 
                // support : avi(only ie) wmv
                // browsers : ie(>5) firefox chrome 
                // systems : window
                embed = '<object width="100%" height="100%" type="video/x-ms-asf" url="${video_src}" data="${video_src}" classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6"> <param name="url" value="${video_src}"> <param name="filename" value="${video_src}"> <param name="autostart" value="1"> <param name="uiMode" value="full"><param name="autosize" value="1"> <param name="playcount" value="1"> <embed type="application/x-mplayer2" src="${video_src}" width="100%" height="100%" autostart="true" showcontrols="true" pluginspage="http://www.microsoft.com/Windows/MediaPlayer/"></embed> </object>'
            }

            // 2, 替换模板中的${video_src}
            embed = embed.replace(/\$\{video_src\}/gi,data.url);

            // 3, 放置在dom相应的位置
            if(!container){
               // 如果没有设置容器，直接使用document.write
               container = 'inlinevideo'
            }
            document.getElementById(container).innerHTML = embed;
        }
    };

    // param 包含 url 请求直链的地址
    // o 包含成功回调函数，和失败回调函数
    // 处理下载地址
    D.jsonp({
        url: callurl,
        data:param,
        dataType: "jsonp",
        timeout: 30000,
        success: o.success,
        pageCache:true,
        error: o.error
    });  
}

