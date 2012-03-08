@echo off
set closure=-jar closure\compiler.jar
set opts=--compilation_level SIMPLE_OPTIMIZATIONS

java %closure% %opts% --js=..\ddom.js --js_output_file=ddom.noadapter.min.js

java %closure% %opts% --js=..\adapters\ddom.standalone.js --js=..\ddom.js --js_output_file=ddom.standalone.min.js

java %closure% %opts% --js=..\adapters\ddom.jquery.js --js=..\ddom.js --js_output_file=ddom.jquery.min.js