SET flags=--compilation_level SIMPLE_OPTIMIZATIONS ^
 --js %CLOSURE_HOME%/base.js ^
 --js framework-1.4/**.js ^
 --externs %CLOSURE_HOME%/js/externs/**.js ^
 --generate_exports ^
 --js_output_file dist/framework-1.4-compiled.js
java -jar %CLOSURE_HOME%/compiler.jar %flags%