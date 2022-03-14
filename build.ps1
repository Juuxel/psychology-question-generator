rm -Recurse -Force build
mkdir build
tsc src/main.ts --outFile build/main.js -t es6
cp src/index.html build/index.html
