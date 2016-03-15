SET flags=--compilation_level SIMPLE_OPTIMIZATIONS ^
 --js framework-1.4/**.js ^
 --externs %CLOSURE_HOME%/js/externs/**.js ^
 --js_output_file dist/framework-1.4-compiled.js
java -jar %CLOSURE_HOME%/compiler.jar %flags%


SET flags=--compilation_level SIMPLE_OPTIMIZATIONS ^
 --js extensions/**.js ^
 --externs %CLOSURE_HOME%/js/externs/**.js ^
 --js_output_file dist/extensions-compiled.js
java -jar %CLOSURE_HOME%/compiler.jar %flags%