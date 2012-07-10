@echo off
set closure=-jar closure\compiler.jar
set opts=--compilation_level ADVANCED_OPTIMIZATIONS --output_wrapper "(function() {%%output%%})();"

java %closure% %opts% --js=..\adapters\ddom.standalone.js --js=..\ddom.js --js_output_file=ddom.standalone.min.js

java %closure% %opts% --externs closure\externs.jquery-1.7.js --js=..\adapters\ddom.jquery.js --js=..\ddom.js --js_output_file=ddom.jquery.min.js